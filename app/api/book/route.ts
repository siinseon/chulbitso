import { NextRequest, NextResponse } from "next/server";

const ALADIN_API_KEY = "ttbdkdnxoghk1245002";
const ALADIN_ITEM_LOOKUP = "http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx";

/**
 * ISBN13으로 알라딘 한 건 조회 (표지, 설명 등 보강용)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("isbn")?.replace(/\D/g, "") ?? "";

  if (!raw) {
    return NextResponse.json(
      { error: "isbn 쿼리가 필요합니다." },
      { status: 400 }
    );
  }

  const itemIdType = raw.length === 13 ? "ISBN13" : raw.length === 10 ? "ISBN" : "ISBN13";

  const params = new URLSearchParams({
    ttbkey: ALADIN_API_KEY,
    ItemIdType: itemIdType,
    ItemId: raw,
    Output: "JS",
    Version: "20131101",
    OptResult: "ebookList,reviewList",
  });

  try {
    const res = await fetch(`${ALADIN_ITEM_LOOKUP}?${params.toString()}`);
    const data = await res.json();

    const item = data?.item?.[0] as Record<string, unknown> | undefined;
    if (!item) {
      return NextResponse.json(
        { error: "해당 ISBN으로 검색된 도서가 없습니다." },
        { status: 404 }
      );
    }

    const subInfo = (item.subInfo as Record<string, unknown>) ?? {};
    const rawPage = subInfo.itemPage ?? item.itemPage;
    const pageCount =
      typeof rawPage === "number" && rawPage > 0
        ? rawPage
        : typeof rawPage === "string"
          ? parseInt(rawPage, 10) || undefined
          : undefined;

    const book = {
      title: (item.title as string) ?? "",
      author: (item.author as string) ?? "",
      publisher: (item.publisher as string) ?? "",
      pubDate: (item.pubDate as string) ?? "",
      cover: (item.cover as string) ?? "",
      description: (item.description as string) ?? "",
      isbn: (item.isbn13 as string) ?? (item.isbn as string) ?? "",
      retailPrice:
        typeof item.priceStandard === "number"
          ? item.priceStandard
          : parseInt(String(item.priceStandard || "0"), 10) || 0,
      pageCount,
      format: (subInfo.packaging as string) ?? (item.form as string) ?? undefined,
      category: (item.categoryName as string) ?? undefined,
      series: (item.seriesInfo as { seriesName?: string } | undefined)?.seriesName ?? (item.seriesName as string) ?? undefined,
    };

    return NextResponse.json(book);
  } catch (error) {
    console.error("Aladdin ItemLookUp error:", error);
    return NextResponse.json(
      { error: "도서 정보 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
