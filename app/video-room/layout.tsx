"use client";

import { useEffect } from "react";

/** 비디오방 진입 시 body/루트 배경을 검정으로 덮어서 스크롤 시 연갈색이 보이지 않게 함 */
export default function VideoRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const rootDiv = body.firstElementChild as HTMLElement | null;
    const prevHtmlBg = html.style.background;
    const prevBodyBg = body.style.background;
    const prevRootBg = rootDiv?.style.background ?? "";

    html.style.background = "#000";
    body.style.background = "#000";
    if (rootDiv) rootDiv.style.background = "#000";

    return () => {
      html.style.background = prevHtmlBg;
      body.style.background = prevBodyBg;
      if (rootDiv) rootDiv.style.background = prevRootBg;
    };
  }, []);

  return <>{children}</>;
}
