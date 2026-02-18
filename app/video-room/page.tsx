"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import WebtoonVCR from "@/components/WebtoonVCR";
import RetroDiskStorage from "@/components/RetroDiskStorage";
import VideoTapeStorage from "@/components/VideoTapeStorage";
import ComputerRoomShell from "@/components/ComputerRoomShell";
import { useBooks } from "@/lib/useBooks";
import { useVideoTapes } from "@/lib/useVideoTapes";

export default function VideoRoomPage() {
  const router = useRouter();
  const { books } = useBooks();
  const { tapes, addTape, updateTape } = useVideoTapes();
  const allBooks = [...books.my, ...books.read, ...books.ebook];

  const frameStyle = { border: "1px solid rgba(0,255,0,0.5)", borderRadius: 16 };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-black">
      <Header onOpenSettings={() => {}} variant="video" />
      <main className="px-4 py-6 max-w-[480px] mx-auto pb-28 w-full">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[#8a8a8a] text-sm hover:text-white transition-colors flex items-center gap-1 mb-6"
        >
          ← 나가기
        </button>
        <h1 className="text-xl font-bold text-white font-serif mb-6">비디오방</h1>

        <div className="w-full overflow-hidden rounded-2xl" style={frameStyle}>
          <WebtoonVCR
            title="웹툰 또는 웹소설의 제목을 입력하세요."
            initialEpisode={32}
            onRecord={addTape}
            className="w-full max-w-none"
          />
        </div>

        <section className="mt-8 flex flex-col gap-8 w-full">
          <div className="w-full overflow-hidden rounded-2xl" style={frameStyle}>
            <RetroDiskStorage books={books} className="min-h-[280px]" variant="dark" />
          </div>
          <div className="w-full overflow-hidden rounded-2xl" style={frameStyle}>
            <VideoTapeStorage tapes={tapes} onUpdateTape={updateTape} className="min-h-[280px]" variant="dark" />
          </div>
          <div className="w-full flex flex-col items-center overflow-hidden rounded-2xl" style={frameStyle}>
            <ComputerRoomShell books={allBooks} />
          </div>
        </section>
      </main>
    </div>
  );
}
