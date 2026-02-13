/**
 * 알라딘 author 필드 파싱
 * 형식: "저자 지음" / "저자(지은이), 번역가 옮김" / "저자(지은이), 번역가(옮긴이)"
 */

export function parseAuthorTranslator(authorStr: string | undefined): {
  author: string;
  translator?: string;
} {
  if (!authorStr?.trim()) return { author: "" };

  const s = authorStr.trim();
  const parts = s.split(/[,，]/).map((p) => p.trim()).filter(Boolean);

  let author = "";
  let translator: string | undefined;

  for (const part of parts) {
    const hasTranslator = /옮김|\(옮긴이\)|옮긴이/.test(part);
    const hasAuthor = /지음|\(지은이\)|지은이/.test(part);

    if (hasTranslator) {
      translator = part
        .replace(/\s*옮김\s*$/i, "")
        .replace(/\s*\(옮긴이\)\s*$/i, "")
        .replace(/\s*옮긴이\s*$/i, "")
        .trim();
    }
    if (hasAuthor) {
      author = part
        .replace(/\s*지음\s*$/i, "")
        .replace(/\s*\(지은이\)\s*$/i, "")
        .replace(/\s*지은이\s*$/i, "")
        .trim();
    }
  }

  // 콤마 없이 "저자 지음"만 있는 경우
  if (parts.length === 1 && !author && !translator) {
    const p = parts[0];
    if (/옮김|\(옮긴이\)|옮긴이/.test(p)) {
      translator = p
        .replace(/\s*옮김\s*$/i, "")
        .replace(/\s*\(옮긴이\)\s*$/i, "")
        .replace(/\s*옮긴이\s*$/i, "")
        .trim();
    } else {
      author = p
        .replace(/\s*지음\s*$/i, "")
        .replace(/\s*\(지은이\)\s*$/i, "")
        .replace(/\s*지은이\s*$/i, "")
        .trim();
    }
  }

  return { author: author || s, translator: translator || undefined };
}
