"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Globe } from "lucide-react";
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
  if (maxCount <= 0) return "#11593F";
  const t = count / maxCount;
  const r = Math.round(200 - (200 - 17) * t);
  const g = Math.round(230 - (230 - 89) * t);
  const b = Math.round(200 - (200 - 63) * t);
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
    <section className="rounded-2xl p-5 bg-white shadow-card">
      <h3 className="text-[14px] font-bold text-[#11593F] mb-4 flex items-center gap-2">
        <Globe size={18} />
        출판 국가별
      </h3>

      <div className="relative w-full aspect-[1.6] max-h-[280px] rounded-xl overflow-hidden bg-gray-100">
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
                  stroke="#94A3B8"
                  strokeWidth={0.3}
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
          <p className="text-[13px] text-gray-500">
            등록된 도서가 없습니다.
          </p>
        )}
        {noCountryInfo && (
          <p className="text-[13px] text-amber-700">
            도서 카드를 눌러 출판 국가를 입력하면 지도에 반영됩니다.
          </p>
        )}
        {countWithCountry > 0 && (
          <>
            <p className="text-[14px] font-bold text-[#11593F]">
              당신이 읽은 책 중 출판 국가가 있는 도서는 {countWithCountry}권입니다.
            </p>
            {byCountry.slice(0, 8).map((c) => (
              <p key={c.code} className="text-[13px] text-gray-700">
                <span className="font-bold text-[#11593F]">{c.name}</span>에서 나온 책이{" "}
                <span className="font-bold">{c.percent}%</span>를 차지합니다.
              </p>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
