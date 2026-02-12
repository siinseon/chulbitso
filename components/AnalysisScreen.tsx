"use client";

import { useMemo } from "react";
import { Compass } from "lucide-react";
import type { BooksSnapshot } from "@/lib/analysisStats";
import { computeAnalysisSummary } from "@/lib/analysisStats";
import WorldMapSection from "./WorldMapSection";
import SkyLadderSection from "./SkyLadderSection";
import ReadingBalanceSeesawSection from "./ReadingBalanceSeesawSection";
import TimeRadioSection from "./TimeRadioSection";
import SeriesTripleSwingsSection from "./SeriesTripleSwingsSection";
import TripleSwingsSection from "./TripleSwingsSection";
import GenreTripleSwingsSection from "./GenreTripleSwingsSection";
import EchoPipesSection from "./EchoPipesSection";
import CloudStorageSection from "./CloudStorageSection";
import SandcastlesSection from "./SandcastlesSection";
import type { Book } from "@/lib/useBooks";

interface AnalysisScreenProps {
  books: BooksSnapshot;
  onOpenReceipt?: () => void;
  onReadBook?: (book: Book) => void;
}

export default function AnalysisScreen({ books, onOpenReceipt, onReadBook }: AnalysisScreenProps) {
  const summary = useMemo(() => computeAnalysisSummary(books), [books]);

  return (
    <div className="space-y-10 animate-fadeIn">
      <h2 className="text-[16px] font-bold text-primary font-serif flex items-center gap-2">
        <Compass size={20} />
        탐험
      </h2>

      <div className="space-y-10">
        <WorldMapSection
          byCountry={summary.byCountry}
          countWithCountry={summary.countWithCountry}
          totalCount={summary.totalCount}
        />

        {onOpenReceipt && (
          <div
            className="rounded-2xl p-5 sm:p-6 shadow-card border border-secondary"
            style={{ background: "#f8f6f2" }}
          >
            <h3 className="text-[16px] sm:text-[17px] font-bold text-primary font-serif mb-2">
              가쪽비 계산하기
            </h3>
            <p className="text-[14px] sm:text-[15px] text-text-muted">
              페이지와 가격으로 환산한 지식의 가치
            </p>
            <button
              type="button"
              onClick={onOpenReceipt}
              className="mt-4 w-full py-3.5 min-h-[48px] rounded-xl bg-primary text-white font-bold text-[14px] hover:opacity-90 active:opacity-95 transition-opacity"
            >
              가쪽비 영수증 발급기
            </button>
          </div>
        )}

        <SkyLadderSection
          totalPages={summary.knowledgeThickness.totalPages}
          heightCm={summary.knowledgeThickness.heightCm}
        />

        <TimeRadioSection avgPubYear={summary.avgPubYear} />

        <SeriesTripleSwingsSection topSeries={summary.topSeries} />

        <TripleSwingsSection topAuthors={summary.topAuthors} />

        <GenreTripleSwingsSection topGenres={summary.topGenres ?? []} />

        <SandcastlesSection topPublishers={summary.topPublishers ?? []} />

        <ReadingBalanceSeesawSection books={books} />

        <EchoPipesSection topTranslators={summary.topTranslators} />

        <CloudStorageSection books={books} />
      </div>
    </div>
  );
}
