"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { CountryStat } from "@/lib/analysisStats";
import { ALPHA2_TO_NUMERIC } from "@/lib/countryCodes";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapSectionProps {
  byCountry: CountryStat[];
  countWithCountry: number;
  totalCount: number;
}

function getFill(
  geoId: string | number,
  countByNumeric: Record<string, number>,
  maxCount: number
): string {
  const id = String(geoId);
  const count = countByNumeric[id] ?? countByNumeric[id.padStart(3, "0")] ?? 0;
  if (count <= 0) return "#E5E7EB";
  if (maxCount <= 0) return "#4A5E42";
  const t = count / maxCount;
  const r = Math.round(140 - (140 - 74) * t);
  const g = Math.round(158 - (158 - 94) * t);
  const b = Math.round(131 - (131 - 66) * t);
  return `rgb(${r},${g},${b})`;
}

export default function WorldMapSection({
  byCountry,
  countWithCountry,
  totalCount,
}: WorldMapSectionProps) {
  const { countByNumeric, maxCount } = useMemo(() => {
    const map: Record<string, number> = {};
    let max = 0;
    byCountry.forEach((c) => {
      const num = ALPHA2_TO_NUMERIC[c.code];
      if (num != null) {
        const key = String(num);
        map[key] = (map[key] ?? 0) + c.count;
        if (map[key] > max) max = map[key];
      }
    });
    return { countByNumeric: map, maxCount: max };
  }, [byCountry]);

  const noData = totalCount === 0 || countWithCountry === 0;
  const noCountryInfo = totalCount > 0 && countWithCountry === 0;

  return (
    <section className="rounded-2xl p-5 shadow-card border border-secondary overflow-hidden relative"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.12), inset 0 0 80px rgba(139, 123, 107, 0.06)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
        독서 세계지도
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">읽은 책의 출판국가를 지도 위에 표시해요</p>

      <div
        className="relative w-full max-w-full aspect-[1.6] max-h-[280px] rounded-xl overflow-hidden"
        style={{
          background: "#F2E6D0",
          border: "1px solid #8C9E83",
          boxShadow: "inset 0 0 40px rgba(139, 123, 107, 0.15)",
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 95,
            center: [10, 25],
          }}
          width={800}
          height={500}
          style={{ width: "100%", height: "100%", overflow: "hidden" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getFill(geo.id, countByNumeric, maxCount)}
                  stroke="#8C9E83"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", cursor: "default" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div className="mt-4 space-y-2">
        {noData && (
          <p className="text-[13px] text-text-muted font-sans">
            등록된 도서가 없습니다.
          </p>
        )}
        {noCountryInfo && (
          <p className="text-[13px] text-text-muted font-sans">
            도서 카드를 눌러 출판 국가를 입력하면 지도에 반영됩니다.
          </p>
        )}
        {countWithCountry > 0 && (
          <>
            <p className="text-[14px] font-bold text-primary font-serif">
              당신이 읽은 책 중 출판 국가가 있는 도서는 {countWithCountry}권입니다.
            </p>
            {byCountry.slice(0, 8).map((c) => (
              <p key={c.code} className="text-[13px] text-text-main font-sans">
                <span className="font-bold text-primary">{c.name}</span>에서 나온 책이{" "}
                <span className="font-bold">{c.count}권</span> ({c.percent}%)
              </p>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
