"use client";

import { useMemo } from "react";
import { BarChart3, BookOpen, BookMarked, DollarSign, Layers, Ruler } from "lucide-react";
import type { BooksSnapshot } from "@/lib/analysisStats";
import { computeAnalysisSummary } from "@/lib/analysisStats";
import WorldMapSection from "./WorldMapSection";

interface AnalysisScreenProps {
  books: BooksSnapshot;
}

function BarRow({
  label,
  count,
  total,
  sub,
}: {
  label: string;
  count: number;
  total: number;
  sub?: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-20 flex-shrink-0 text-[13px] font-bold text-primary">
        {label}
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-6 bg-ivory-border/80 rounded-lg overflow-hidden">
          <div
            className="h-full bg-primary rounded-lg transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="w-14 text-right text-[12px] text-muted flex-shrink-0">
        {sub ?? `${count}권`}
      </div>
    </div>
  );
}

export default function AnalysisScreen({ books }: AnalysisScreenProps) {
  const summary = useMemo(() => computeAnalysisSummary(books), [books]);

  const maxOwnership = Math.max(1, ...summary.ownership.map((o) => o.count));
  const maxReading = Math.max(1, ...summary.reading.map((r) => r.count));
  const maxCategory = Math.max(1, ...summary.category.map((c) => c.count));

  return (
    <div className="space-y-6 animate-fadeIn overflow-x-hidden min-w-0 w-full">
      <h2 className="section-title text-[15px] flex items-center gap-2">
        <BarChart3 size={20} />
        분석
      </h2>

      {/* 출판 국가별 세계지도 */}
      <WorldMapSection
        byCountry={summary.byCountry}
        countWithCountry={summary.countWithCountry}
        totalCount={summary.totalCount}
      />

      {/* 한눈에 보기 */}
      <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
        <h3 className="text-[14px] font-bold text-primary mb-4 flex items-center gap-2 font-serif">
          <BookOpen size={18} />
          한눈에 보기
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-library-card/80 border border-ivory-border p-4">
            <p className="text-[12px] text-muted">총 도서</p>
            <p className="text-xl font-bold text-primary font-serif">{summary.totalCount}권</p>
          </div>
          <div className="rounded-xl bg-library-card/80 border border-ivory-border p-4">
            <p className="text-[12px] text-muted">누적 투자 (정가)</p>
            <p className="text-lg font-bold text-primary font-serif">
              ₩{summary.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="col-span-2 rounded-xl bg-library-card/80 border border-ivory-border p-4">
            <p className="text-[12px] text-muted">평균 책값 (정가)</p>
            <p className="text-lg font-bold text-primary">
              {summary.totalCount > 0
                ? `₩${Math.round(summary.avgPrice).toLocaleString()}`
                : "-"}
            </p>
          </div>
        </div>
      </section>

      {/* 지식의 두께 */}
      <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
        <h3 className="text-[14px] font-bold text-primary mb-4 flex items-center gap-2 font-serif">
          <Ruler size={18} />
          지식의 두께
        </h3>
        <p className="text-[12px] text-muted mb-3">
          총 쪽수 × 0.1mm (종이 한 장 두께) = 쌓인 높이
        </p>
        <div className="rounded-xl bg-library-card/80 border border-ivory-border p-4 space-y-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[28px] font-bold text-primary font-serif">
              {summary.knowledgeThickness.totalPages > 0
                ? summary.knowledgeThickness.heightCm >= 100
                  ? `${(summary.knowledgeThickness.heightCm / 100).toFixed(1)}m`
                  : `${summary.knowledgeThickness.heightCm.toFixed(1)}cm`
                : "-"}
            </span>
            {summary.knowledgeThickness.totalPages > 0 && (
              <span className="text-[13px] text-muted">
                (총 {summary.knowledgeThickness.totalPages.toLocaleString()}쪽)
              </span>
            )}
          </div>
          <p className="text-[15px] font-bold text-text-main flex items-center gap-2">
            <span>{summary.knowledgeThickness.icon}</span>
            {summary.knowledgeThickness.message}
          </p>
        </div>
      </section>

      {/* 소유형태별 */}
      <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
        <h3 className="text-[14px] font-bold text-primary mb-4 flex items-center gap-2">
          <Layers size={18} />
          소유형태별
        </h3>
        <div className="space-y-1">
          {summary.ownership.map((o) => (
            <BarRow
              key={o.type}
              label={o.label}
              count={o.count}
              total={maxOwnership}
              sub={`${o.count}권 · ₩${o.value.toLocaleString()}`}
            />
          ))}
        </div>
        {summary.totalCount === 0 && (
          <p className="text-[13px] text-muted py-2">등록된 도서가 없습니다.</p>
        )}
      </section>

      {/* 독서 상태별 */}
      <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
        <h3 className="text-[14px] font-bold text-primary mb-4 flex items-center gap-2">
          <BookMarked size={18} />
          독서 상태별
        </h3>
        <div className="space-y-1">
          {summary.reading.map((r) => (
            <BarRow
              key={r.status}
              label={r.label}
              count={r.count}
              total={maxReading}
            />
          ))}
        </div>
        {summary.totalCount === 0 && (
          <p className="text-[13px] text-muted py-2">등록된 도서가 없습니다.</p>
        )}
      </section>

      {/* 분야별 */}
      <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
        <h3 className="text-[14px] font-bold text-primary mb-4 flex items-center gap-2">
          <BarChart3 size={18} />
          분야별
        </h3>
        <div className="space-y-1">
          {summary.category.length === 0 ? (
            <p className="text-[13px] text-muted py-2">분야 정보가 없습니다.</p>
          ) : (
            summary.category.map((c) => (
              <BarRow
                key={c.category}
                label={c.label}
                count={c.count}
                total={maxCategory}
              />
            ))
          )}
        </div>
      </section>

      {/* 금액 요약 */}
      <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
        <h3 className="text-[14px] font-bold text-primary mb-4 flex items-center gap-2 font-serif">
          <DollarSign size={18} />
          소유형태별 금액
        </h3>
        <div className="space-y-3">
          {summary.ownership.map((o) => (
            <div
              key={o.type}
              className="flex items-center justify-between py-2 border-b border-ivory-border last:border-0"
            >
              <span className="text-[13px] font-bold text-primary">{o.label}</span>
              <span className="text-[13px] text-text-main">
                ₩{o.value.toLocaleString()}
                {o.count > 0 && (
                  <span className="text-[11px] text-muted ml-1">
                    (평균 ₩{Math.round(o.value / o.count).toLocaleString()})
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
        {summary.totalCount === 0 && (
          <p className="text-[13px] text-muted py-2">등록된 도서가 없습니다.</p>
        )}
      </section>
    </div>
  );
}
