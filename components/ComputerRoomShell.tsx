"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DosBookList from "./DosBookList";
import BookDetailModal from "./BookDetailModal";
import type { Book } from "@/lib/useBooks";

interface ComputerRoomShellProps {
  books: Book[];
}

export default function ComputerRoomShell({ books }: ComputerRoomShellProps) {
  const [screenOpen, setScreenOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <>
      <div
        className="flex flex-col w-full p-5 sm:p-6 min-h-[280px] rounded-2xl"
        style={{
          background: "linear-gradient(180deg, #1e2a3a 0%, #252d3a 40%, #2d251e 70%, #3d3228 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <h3 className="text-[16px] sm:text-[17px] font-bold text-white/90 font-serif mb-1">
          컴퓨터실
        </h3>
        <p className="text-[12px] text-white/60 font-serif mb-4">
          분류별/상태별 도서 리스트를 확인할 수 있어요.
        </p>
        <button
          type="button"
          onClick={() => setScreenOpen(true)}
          className="flex flex-col items-center justify-center w-full mx-auto py-8 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] rounded-2xl group transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <img
            src="/computer-room.svg"
            alt="옛날 컴퓨터"
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 opacity-95 group-hover:opacity-100 transition-opacity"
            style={{
              filter: `
                drop-shadow(0 2px 4px rgba(0,0,0,0.4))
                drop-shadow(0 6px 12px rgba(0,0,0,0.5))
                drop-shadow(0 12px 24px rgba(0,0,0,0.6))
              `,
            }}
          />
        </button>
      </div>

      <AnimatePresence>
        {screenOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setScreenOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[420px] max-h-[85vh] overflow-auto rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setScreenOpen(false)}
                  className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/60 text-white text-sm hover:bg-black/80 flex items-center justify-center"
                >
                  ✕
                </button>
                <DosBookList
                  books={books}
                  onBookClick={(book) => {
                    setSelectedBook(book);
                  }}
                  appendDummyForTest={books.length < 3}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
