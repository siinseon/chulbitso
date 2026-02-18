import { NextRequest, NextResponse } from "next/server";
import { mapAladdinCategory, shouldClassifyAsPoetry } from "@/lib/categories";
import { parseAuthorTranslator } from "@/lib/authorParser";

const ALADIN_API_KEY = "ttbdkdnxoghk1245002";
const ALADIN_API_URL = "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || !query.trim()) {
    return NextResponse.json(
      { error: "검색어를 입력해주세요." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    ttbkey: ALADIN_API_KEY,
    Query: query.trim(),
    QueryType: "Title",
    MaxResults: "10",
    Output: "JS",
    Version: "20131101",
  });

  try {
    const res = await fetch(`${ALADIN_API_URL}?${params.toString()}`);
    const data = await res.json();

    const items = data.item ?? [];
    const books = items.map((item: Record<string, unknown>) => {
      const subInfo = item.subInfo as Record<string, unknown> | undefined;
      const rawPage = subInfo?.itemPage ?? item.itemPage;
      const pageCount =
        typeof rawPage === "number" && rawPage > 0
          ? rawPage
          : typeof rawPage === "string"
            ? parseInt(rawPage, 10) || 0
            : 0;
      const priceStandard = item.priceStandard;
      const retailPrice =
        typeof priceStandard === "number"
          ? priceStandard
          : parseInt(String(priceStandard || "0"), 10) || 0;
      const categoryName = (item.categoryName as string) ?? "";
      const rawAuthor = (item.author as string) ?? "";
      const { author, translator } = parseAuthorTranslator(rawAuthor);

      const seriesInfo = item.seriesInfo as { seriesName?: string } | undefined;
      const series = seriesInfo?.seriesName ?? (item.seriesName as string) ?? undefined;

      const title = (item.title as string) ?? "";
      const publisher = (item.publisher as string) ?? "";
      const categoryFromAladdin = mapAladdinCategory(categoryName) ?? undefined;
      const category =
        shouldClassifyAsPoetry(title) || shouldClassifyAsPoetry(publisher) || shouldClassifyAsPoetry(series)
          ? "시집"
          : categoryFromAladdin;

      return {
        title,
        author: author || rawAuthor,
        translator: translator ?? undefined,
        publisher,
        pubDate: item.pubDate ?? "",
        cover: item.cover ?? "",
        description: item.description ?? "",
        isbn: item.isbn13 ?? item.isbn ?? "",
        retailPrice,
        pageCount: pageCount > 0 ? pageCount : undefined,
        category,
        series: series || undefined,
      };
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Aladdin API error:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
