"use client";

import { ExternalLink } from "lucide-react";

const STORE_LINKS: { name: string; url: string }[] = [
  { name: "예스24", url: "https://event.yes24.com/monthlygift" },
  { name: "교보문고", url: "https://event.kyobobook.co.kr/gift-promotions" },
  { name: "알라딘", url: "https://www.aladin.co.kr/events/wevent.aspx?EventId=138432" },
  { name: "영풍문고", url: "https://www.ypbooks.co.kr/" },
  { name: "밀리의 서재", url: "https://www.millie.co.kr/" },
  { name: "윌라", url: "https://www.welaaa.com/" },
];

export default function GiftScreen() {
  return (
    <section className="animate-fadeIn">
      <div className="rounded-2xl p-5 bg-white shadow-card">
        <h2 className="text-[16px] font-bold text-[#11593F] mb-1">인터넷 서점 사은품</h2>
        <p className="text-[13px] text-gray-500 mb-4">
          서점을 누르면 해당 사은품/이벤트 페이지로 이동해요.
        </p>
        <ul className="space-y-2">
          {STORE_LINKS.map(({ name, url }) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#11593F]/10 text-gray-800 font-medium text-[14px] transition-colors"
              >
                <span>{name}</span>
                <ExternalLink size={18} className="text-[#11593F] flex-shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
