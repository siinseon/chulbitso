import type { Book } from "@/lib/useBooks";
import type { OwnershipType, ReadingStatus } from "@/lib/supabase/types";
import { OWNERSHIP_LABELS, READING_STATUS_LABELS } from "@/lib/supabase/types";

export interface BooksSnapshot {
  my: Book[];
  read: Book[];
  ebook: Book[];
}

const CATEGORY_ORDER = ["시집", "소설", "에세이", "인문"] as const;
const CATEGORY_LABEL: Record<string, string> = {
  시집: "시집",
  소설: "소설",
  에세이: "에세이",
  인문: "인문",
};

function allBooks(books: BooksSnapshot): Book[] {
  return [...books.my, ...books.read, ...books.ebook];
}

export interface OwnershipStat {
  type: OwnershipType;
  label: string;
  count: number;
  value: number;
}

export interface ReadingStat {
  status: ReadingStatus;
  label: string;
  count: number;
}

export interface CategoryStat {
  category: string;
  label: string;
  count: number;
}

export interface CountryStat {
  /** ISO 3166-1 alpha-2 (KR, US 등) */
  code: string;
  name: string;
  count: number;
  /** 0..100 */
  percent: number;
}

/** 지식의 두께: 총 쪽수 × 0.1mm = 높이, 레벨별 멘트/아이콘 */
export interface KnowledgeThickness {
  totalPages: number;
  /** cm 단위 */
  heightCm: number;
  message: string;
  icon: string;
}

export interface AnalysisSummary {
  totalCount: number;
  totalValue: number;
  ownership: OwnershipStat[];
  reading: ReadingStat[];
  category: CategoryStat[];
  avgPrice: number;
  byCountry: CountryStat[];
  countWithCountry: number;
  knowledgeThickness: KnowledgeThickness;
}

export function computeAnalysisSummary(books: BooksSnapshot): AnalysisSummary {
  const all = allBooks(books);

  const totalCount = all.length;
  const totalValue = all.reduce((s, b) => s + (b.retailPrice ?? 0), 0);
  const avgPrice = totalCount > 0 ? totalValue / totalCount : 0;

  const ownership: OwnershipStat[] = [
    { type: "OWNED", label: OWNERSHIP_LABELS.OWNED, count: books.my.length, value: books.my.reduce((s, b) => s + (b.retailPrice ?? 0), 0) },
    { type: "PASSED", label: OWNERSHIP_LABELS.PASSED, count: books.read.length, value: books.read.reduce((s, b) => s + (b.retailPrice ?? 0), 0) },
    { type: "EBOOK", label: OWNERSHIP_LABELS.EBOOK, count: books.ebook.length, value: books.ebook.reduce((s, b) => s + (b.retailPrice ?? 0), 0) },
  ];

  const readingByStatus: Partial<Record<ReadingStatus, number>> = {};
  const statuses: ReadingStatus[] = ["READING", "FINISHED", "EXCERPT", "PAUSED", "WISH"];
  statuses.forEach((s) => (readingByStatus[s] = 0));
  all.forEach((b) => {
    readingByStatus[b.readingStatus] = (readingByStatus[b.readingStatus] ?? 0) + 1;
  });
  const reading: ReadingStat[] = statuses.map((status) => ({
    status,
    label: READING_STATUS_LABELS[status],
    count: readingByStatus[status] ?? 0,
  }));

  const categoryCount: Record<string, number> = {};
  all.forEach((b) => {
    const raw = b.category?.trim();
    const cat = raw && CATEGORY_ORDER.includes(raw as (typeof CATEGORY_ORDER)[number]) ? raw : "기타";
    categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
  });
  const orderedCats = [...CATEGORY_ORDER];
  const otherCount = Object.entries(categoryCount)
    .filter(([k]) => !orderedCats.includes(k as (typeof CATEGORY_ORDER)[number]))
    .reduce((s, [, v]) => s + v, 0);
  const category: CategoryStat[] = [
    ...orderedCats.filter((c) => (categoryCount[c] ?? 0) > 0).map((c) => ({ category: c, label: CATEGORY_LABEL[c] ?? c, count: categoryCount[c] ?? 0 })),
    ...(otherCount > 0 ? [{ category: "기타", label: "기타", count: otherCount }] : []),
  ];

  const countryCount: Record<string, number> = {};
  all.forEach((b) => {
    const c = b.country?.trim().toUpperCase().slice(0, 2);
    if (!c) return;
    countryCount[c] = (countryCount[c] ?? 0) + 1;
  });
  const countWithCountry = Object.values(countryCount).reduce((a, b) => a + b, 0);
  const byCountry: CountryStat[] = Object.entries(countryCount)
    .map(([code, count]) => ({
      code,
      name: COUNTRY_NAMES[code] ?? code,
      count,
      percent: countWithCountry > 0 ? Math.round((count / countWithCountry) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const totalPages = all.reduce((s, b) => s + (b.pageCount ?? 0), 0);
  const heightMm = totalPages * 0.1;
  const heightCm = heightMm / 10;
  const knowledgeThickness = getKnowledgeThickness(totalPages, heightCm);

  return {
    totalCount,
    totalValue,
    ownership,
    reading,
    category,
    avgPrice,
    byCountry,
    countWithCountry,
    knowledgeThickness,
  };
}

function getKnowledgeThickness(totalPages: number, heightCm: number): KnowledgeThickness {
  if (totalPages <= 0) {
    return {
      totalPages: 0,
      heightCm: 0,
      message: "도서 상세에서 쪽수를 입력하면 쌓인 높이를 볼 수 있어요!",
      icon: "📖",
    };
  }
  const levels: { maxCm: number; message: string; icon: string }[] = [
    { maxCm: 15, message: "스마트폰 높이만큼 쌓으셨네요!", icon: "📱" },
    { maxCm: 30, message: "고양이 키만큼 읽으셨어요!", icon: "🐈" },
    { maxCm: 100, message: "유치원생 키를 넘겼어요!", icon: "🐥" },
    { maxCm: 200, message: "사람 키를 향해 가는 중!", icon: "🧍" },
    { maxCm: 500, message: "두 배 키에 도전한 서가!", icon: "🚀" },
    { maxCm: 1000, message: "거인의 책탑!", icon: "🏔️" },
    { maxCm: Infinity, message: "전설의 도서관!", icon: "📚" },
  ];
  const level = levels.find((l) => heightCm < l.maxCm) ?? levels[levels.length - 1];
  return {
    totalPages,
    heightCm,
    message: level.message,
    icon: level.icon,
  };
}

const COUNTRY_NAMES: Record<string, string> = {
  KR: "한국",
  US: "미국",
  JP: "일본",
  GB: "영국",
  DE: "독일",
  FR: "프랑스",
  CN: "중국",
  TW: "대만",
  IT: "이탈리아",
  ES: "스페인",
  RU: "러시아",
  IN: "인도",
  BR: "브라질",
  CA: "캐나다",
  AU: "호주",
  MX: "멕시코",
  NL: "네덜란드",
  PL: "폴란드",
  TR: "터키",
  GR: "그리스",
  PT: "포르투갈",
  SE: "스웨덴",
  NO: "노르웨이",
  DK: "덴마크",
  FI: "핀란드",
  AT: "오스트리아",
  CH: "스위스",
  BE: "벨기에",
  IE: "아일랜드",
  CZ: "체코",
  HU: "헝가리",
  RO: "루마니아",
  TH: "태국",
  VN: "베트남",
  ID: "인도네시아",
  MY: "말레이시아",
  SG: "싱가포르",
  PH: "필리핀",
  IL: "이스라엘",
  EG: "이집트",
  ZA: "남아프리카",
  AR: "아르헨티나",
  CL: "칠레",
  CO: "콜롬비아",
};
