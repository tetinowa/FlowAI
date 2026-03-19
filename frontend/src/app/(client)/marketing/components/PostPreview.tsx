"use client";
import React, { useState } from "react";
import { Platform, PLATFORM_COLORS } from "../types";

export interface PreviewData {
  platform: Platform;
  content: string;
  title: string;
}

interface PostPreviewProps {
  preview: PreviewData | null;
  aiAdvice: string;
  autoPost: boolean;
  scheduledDate: string | null;
  scheduledTime: string;
}

const PLATFORM_ICON: Record<Platform, React.ReactNode> = {
  LinkedIn: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" fill="white" />
    </svg>
  ),
  "Twitter/X": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Facebook: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
  Instagram: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
    </svg>
  ),
};

export default function PostPreview({
  preview,
  aiAdvice,
  autoPost,
  scheduledDate,
  scheduledTime,
}: PostPreviewProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!preview) return;
    navigator.clipboard.writeText(preview.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pc = preview ? PLATFORM_COLORS[preview.platform] : null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-gray-800 dark:text-gray-100">
            Постын дэлгэрэнгүй
          </span>
          {preview && (
            <span className="text-[9px] font-bold px-2 py-0.5 bg-[#5048e5]/10 text-[#5048e5] rounded-full tracking-wide">
              АВТО ПОСТ
            </span>
          )}
        </div>
        {preview && (
          <button
            onClick={copy}
            className="text-[11px] px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[#5048e5]/40 hover:text-[#5048e5] transition-all"
          >
            {copied ? "✓ Хуулагдлаа" : "Хуулах"}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!preview ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L9.09 8.26L2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-1.18-6.86L22 9.27l-7.09-1.01L12 2z"
                  fill="#E5E7EB"
                />
              </svg>
            </div>
            <p className="text-[12px] font-semibold text-gray-400 dark:text-gray-500">
              Контент үүсгэгдээгүй
            </p>
            <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-1">
              Зүүн талын формыг бөглөж контент үүсгэнэ үү
            </p>
          </div>
        ) : (
          <>
            {/* Platform */}
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 tracking-widest mb-2 uppercase">
                Платформ
              </p>
              <div
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${pc!.pill} border-opacity-30`}
              >
                <div
                  className={`w-8 h-8 rounded-lg ${pc!.badge} flex items-center justify-center shrink-0`}
                >
                  {PLATFORM_ICON[preview.platform]}
                </div>
                <span className="text-[13px] font-bold text-gray-800 dark:text-gray-100">
                  {preview.platform}
                </span>
                {autoPost && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">Авто пост</span>
                    <div className="w-8 h-4 bg-[#5048e5] rounded-full flex items-center justify-end pr-0.5">
                      <div className="w-3 h-3 bg-white rounded-full shadow" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image preview */}
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 tracking-widest mb-2 uppercase">
                Зургийн урьдчилж харах
              </p>
              <div
                className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  {/* Decorative frame */}
                  <div className="absolute inset-4 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          stroke="#D1D5DB"
                          strokeWidth="2"
                        />
                        <path
                          d="M3 9h18M9 21V9"
                          stroke="#D1D5DB"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-300 dark:text-gray-600 text-center">
                      CONTENT
                    </p>
                    <p className="text-[9px] text-gray-200 dark:text-gray-700 text-center mt-0.5 truncate max-w-full px-2">
                      {preview.title}
                    </p>
                  </div>
                  {/* Plant decoration */}
                  <div className="absolute bottom-2 right-2 text-lg">🌿</div>
                </div>
              </div>
            </div>

            {/* Scheduled info */}
            {scheduledDate && (
              <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 2v4M8 2v4M3 10h18"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-semibold text-[#5048e5]">
                  {scheduledDate}-р сарын {scheduledTime}-д автоматаар
                  нийтлэгдэнэ
                </span>
              </div>
            )}

            {/* Content */}
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 tracking-widest mb-2 uppercase">
                Тайлбар
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                <p className="text-[11px] text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                  {preview.content}
                </p>
              </div>
            </div>

            {/* AI advice */}
            <div className="bg-[#5048e5]/5 border border-[#5048e5]/15 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-sm">ℹ️</span>
                <span className="text-[11px] font-bold text-[#5048e5]">
                  AI зөвлөгөө
                </span>
              </div>
              <p className="text-[11px] text-[#5048e5]/80 leading-relaxed">
                {aiAdvice}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
        <button className="flex-1 py-2.5 rounded-xl text-[12px] font-bold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Устгах
        </button>
        <button
          className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white flex items-center justify-center gap-1.5"
          style={{
            background: "#5048e5",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Контент төлөвлөгөө гаргах
        </button>
      </div>
    </div>
  );
}
