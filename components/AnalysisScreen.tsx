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
import SandcastlesSection from "./SandcastlesSection";
import ReceiptMachineSection from "./ReceiptMachineSection";
import IpodHistoryViewer from "./IpodHistoryViewer";
import type { Book } from "@/lib/useBooks";

interface AnalysisScreenProps {
  books: BooksSnapshot;
  onOpenReceipt?: () => void;
  onReadBook?: (book: Book) => void;
}

export default function AnalysisScreen({ books, onOpenReceipt, onReadBook }: AnalysisScreenProps) {
  const summary = useMemo(() => computeAnalysisSummary(books), [books]);

  return (
    <div className="space-y-10 animate-fadeIn overflow-x-hidden min-w-0 w-full">
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
            className="rounded-2xl p-5 sm:p-6 border border-secondary"
            style={{
              background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
              boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
            }}
          >
            <h3 className="text-[16px] sm:text-[17px] font-bold text-primary font-serif mb-1">
              가쪽비 계산하기
            </h3>
            <p className="text-[12px] text-text-muted font-serif mb-4">
              페이지와 가격으로 환산한 지식의 가치
            </p>
            <ReceiptMachineSection onOpenReceipt={onOpenReceipt} />
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

        <div
          className="rounded-2xl p-5 sm:p-6 border border-secondary"
          style={{
            background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
            boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
          }}
        >
          <h3 className="text-[16px] sm:text-[17px] font-bold text-primary font-serif mb-1">
            독서 시간 여행
          </h3>
          <p className="text-[12px] text-text-muted font-serif mb-4">
            휠을 돌려 연/월을 선택하고, 그달에 읽은 책을 둘러보세요.
          </p>
          <IpodHistoryViewer allBooks={[...books.my, ...books.read, ...books.ebook]} />
        </div>
      </div>
    </div>
  );
}
