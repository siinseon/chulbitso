"use client";

import { useMemo } from "react";
import type { Book } from "@/lib/useBooks";

interface ReadingReceiptProps {
  books: Book[];
}

function getMent(pricePerPage: number): string {
  if (pricePerPage <= 0) return "";
  if (pricePerPage <= 10) return "1페이지당 약 N원짜리 초혜자입니다.";
  if (pricePerPage <= 20) return "1페이지당 약 N원짜리 혜자입니다.";
  if (pricePerPage <= 50) return "1페이지당 약 N원. 가성비 굿.";
  if (pricePerPage <= 100) return "1페이지당 약 N원. 알뜰 지식 쇼핑.";
  return "1페이지당 약 N원. 프리미엄 읽기.";
}

export default function ReadingReceipt({ books }: ReadingReceiptProps) {
  const items = useMemo(() => {
    return books
      .filter((b) => (b.retailPrice ?? 0) > 0 && (b.pageCount ?? 0) > 0)
      .map((b) => {
        const price = b.retailPrice!;
        const pages = b.pageCount!;
        const pricePerPage = Math.round(price / pages);
        return {
          title: b.title,
          author: b.author,
          price,
          pages,
          pricePerPage,
          ment: getMent(pricePerPage).replace("N", String(pricePerPage)),
        };
      })
      .sort((a, b) => a.pricePerPage - b.pricePerPage);
  }, [books]);

  if (items.length === 0) {
    return (
      <section className="rounded-2xl p-5 bg-white shadow-card">
        <h3 className="text-[14px] font-bold text-primary mb-3">
          가성비 독서 영수증
        </h3>
        <p className="text-[13px] text-text-muted">
          정가와 쪽수를 입력한 도서가 있으면, 1페이지당 가격으로 가성비 영수증을 뽑아드려요.
        </p>
      </section>
    );
  }

  const totalPrice = items.reduce((s, i) => s + i.price, 0);
  const totalPages = items.reduce((s, i) => s + i.pages, 0);
  const avgPerPage = totalPages > 0 ? Math.round(totalPrice / totalPages) : 0;

  return (
    <section className="rounded-2xl p-5 bg-white shadow-card">
      <h3 className="text-[14px] font-bold text-primary mb-2">
        가성비 독서 영수증
      </h3>
      <p className="text-[12px] text-text-muted mb-4">
        나 이렇게 알뜰하게 지식 쇼핑했다 📄
      </p>

      <div className="flex justify-center">
        <div
          className="w-full max-w-[300px] bg-[#faf8f3] border border-[#e8e4dc] rounded-t-lg overflow-hidden receipt-paper"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div className="px-4 pt-5 pb-2 font-mono text-[12px] text-text-main space-y-1">
            <div className="text-center border-b border-dashed border-secondary pb-3 mb-3">
              <p className="font-bold text-[13px] text-primary tracking-wider">
                ★ 가성비 독서 영수증 ★
              </p>
              <p className="text-[10px] text-text-muted mt-1">
                (책 가격 ÷ 쪽수 = 1페이지당 원)
              </p>
            </div>

            {items.map((item, i) => (
              <div key={i} className="py-2 border-b border-dashed border-secondary last:border-0">
                <p className="font-bold truncate" title={item.title}>
                  {item.title}
                </p>
                <p className="text-[11px] text-text-muted truncate">
                  {item.author}
                </p>
                <p className="text-[11px] mt-1">
                  ₩{item.price.toLocaleString()} / {item.pages}쪽
                </p>
                <p className="text-[11px] font-bold text-primary mt-0.5">
                  → {item.ment}
                </p>
              </div>
            ))}

            <div className="border-t-2 border-dashed border-secondary pt-3 mt-3 text-center">
              <p className="text-[11px] text-text-muted">
                총 {items.length}권 · ₩{totalPrice.toLocaleString()} · {totalPages.toLocaleString()}쪽
              </p>
              <p className="text-[12px] font-bold text-primary mt-1">
                평균 1페이지당 약 {avgPerPage}원
              </p>
            </div>
          </div>

          {/* 지그재그 찢어진 끝 */}
          <div
            className="h-3 w-full receipt-tear"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
