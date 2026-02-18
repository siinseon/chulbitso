"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /library 경로 접근 시 메인 페이지로 리다이렉트
 * (탭 기반 네비게이션 사용)
 */
export default function LibraryRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-[#999]">
      이동 중...
    </div>
  );
}
