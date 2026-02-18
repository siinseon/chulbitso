export type OwnershipType = "OWNED" | "PASSED" | "EBOOK";
export type ReadingStatus = "READING" | "FINISHED" | "EXCERPT" | "PAUSED" | "WISH";

export const OWNERSHIP_LABELS: Record<OwnershipType, string> = {
  OWNED: "쌓인 책",
  PASSED: "스친 책",
  EBOOK: "빛으로 쓴 책",
};

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  READING: "펼침",
  FINISHED: "끝냄",
  EXCERPT: "추림",
  PAUSED: "멈춤",
  WISH: "아낌",
};

/** 독서 기록 상태 (상세 기록용) - 저장값 */
export type RecordStatus = "읽는 중" | "완독" | "멈춤" | "소장중";

/** 화면 표시용 라벨 (감성 업그레이드) - value는 그대로, label만 끝냄/펼침/멈춤 */
export const RECORD_STATUS_DISPLAY: Record<RecordStatus, string> = {
  "완독": "끝냄",
  "읽는 중": "펼침",
  "멈춤": "멈춤",
  "소장중": "소장중",
};

export interface ReadDateEntry {
  start: string;
  end: string;
}

export interface BookSentences {
  first?: string;
  last?: string;
}

export interface BookRow {
  id: string;
  created_at?: string;
  title: string;
  author: string;
  publisher?: string;
  pub_date?: string;
  cover?: string;
  description?: string;
  isbn?: string;
  category?: string;
  series?: string;
  retail_price?: number;
  ownership_type: OwnershipType;
  reading_status: ReadingStatus;
  country?: string;
  translator?: string;
  page_count?: number;
  source?: string;
  source_detail?: string;
  resale?: boolean;
  read_dates?: ReadDateEntry[];
  record_status?: RecordStatus;
  rating?: number;
  bgm_link?: string;
  bgm_title?: string;
  bgm_artist?: string;
  weather?: string;
  sentences?: BookSentences;
  spine_color?: string;
  spine_font?: string;
  /** 책 리뷰 (종이비행기) */
  review?: string;
}
