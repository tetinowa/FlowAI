"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Platform, Post, SavedPost, ImageItem, PLATFORM_COLORS } from "./constants";

interface PostCardProps {
  post: Post;
  images?: ImageItem[];
  onSaved?: (saved: SavedPost) => void;
}

export function PostCard({ post, images = [], onSaved }: PostCardProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const { getToken } = useAuth();
  const badgeClass = PLATFORM_COLORS[post.platform as Platform] ?? "bg-slate-200 text-slate-700 dark:bg-gray-700 dark:text-gray-200";

  function toggleImage(i: number) {
    setSelectedIndexes((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const token = await getToken();
      const selectedBlobUrls = images
        .filter((img, i) => selectedIndexes.has(i) && img.blobUrl)
        .map((img) => img.blobUrl as string);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          content: post.content,
          platform: post.platform,
          scheduledDate: post.scheduledDate,
          images: selectedBlobUrls,
        }),
      });
      const data = await res.json();
      if (data.success && onSaved) {
        onSaved({ ...data.data, images: Array.isArray(data.data.images) ? data.data.images : [] });
        setSaved(true);
        setSelectedIndexes(new Set());
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-gray-700 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span translate="no" className={["inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold", badgeClass].join(" ")}>
          {post.platform === "LinkedIn" ? <><span className="font-bold leading-none">in</span> {post.platform}</> : post.platform}
        </span>
        <span className="text-xs text-slate-400 dark:text-gray-500">{post.scheduledDate.slice(0, 16).replace("T", " ")}</span>
      </div>

      <p className="text-sm text-slate-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {images.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-slate-400 dark:text-gray-500">Зураг сонгох (заавал биш)</p>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => {
              const selected = selectedIndexes.has(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleImage(i)}
                  className={[
                    "relative rounded-lg overflow-hidden border-2 aspect-square transition-all",
                    selected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200 dark:border-gray-700 opacity-60 hover:opacity-90",
                  ].join(" ")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  {selected && (
                    <span className="absolute top-1 right-1 bg-blue-500 text-white rounded-full size-4 flex items-center justify-center text-[10px] font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saving || saved}
          className={saved ? "border-green-500 text-green-600" : ""}>
          {saving ? "Хадгалж байна..." : saved ? "✓ Хадгалагдсан" : "Хадгалах"}
        </Button>
      </div>
    </div>
  );
}
