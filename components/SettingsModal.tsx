"use client";

import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onReset,
}: SettingsModalProps) {
  const handleReset = () => {
    if (!confirm("⚠️ 정말로 모든 데이터를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.")) {
      return;
    }
    if (!confirm("⚠️ 한 번 더 확인합니다.\n\n모든 책 정보(나의 책, 읽은 책, 전자책)가 영구적으로 삭제됩니다.\n\n계속하시겠습니까?")) {
      return;
    }
    onReset();
    onClose();
    alert("✓ 모든 데이터가 삭제되었습니다.");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="w-full max-w-[480px] bg-chulbit-card rounded-t-2xl p-6 pb-[max(24px,env(safe-area-inset-bottom))] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="settings-title" className="text-[18px] font-bold text-primary">
            설정
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ivory-border/80 text-text-main"
            aria-label="닫기"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="w-full py-4 rounded-xl border-2 border-accent/50 text-accent font-bold text-[15px] hover:bg-accent/10 transition-colors flex items-center justify-center gap-2"
        >
          🗑️ 모든 데이터 초기화
        </button>
      </div>
    </div>
  );
}
