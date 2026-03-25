"use client";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Platform, Post, SavedPost, ImageItem, PLATFORM_COLORS } from "./constants";
import { ImageEditorModal } from "./ImageEditorModal";

interface PostCardProps {
  post: Post;
  images?: ImageItem[];
  onSaved?: (saved: SavedPost) => void;
}

export function PostCard({ post, images = [], onSaved }: PostCardProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [editedImages, setEditedImages] = useState<ImageItem[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);

  const allImages = [...images, ...editedImages];

  useEffect(() => {
    setSelectedIndexes(new Set(images.map((_, i) => i)));
  }, [images]);

  function handleEdited(dataUrl: string, name: string) {
    const newItem: ImageItem = { name, preview: dataUrl, blobUrl: dataUrl, uploading: false };
    setEditedImages((prev) => {
      const next = [...prev, newItem];
      const newIndex = images.length + next.length - 1;
      setSelectedIndexes((s) => new Set([...s, newIndex]));
      return next;
    });
  }

  function openEditor(img: ImageItem) {
    setEditingImage(img);
    setEditorOpen(true);
  }

  const badgeClass =
    PLATFORM_COLORS[post.platform as Platform] ??
    "bg-slate-200 text-slate-700 dark:bg-gray-700 dark:text-gray-200";

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
      const selectedImages = allImages
        .filter((img, i) => selectedIndexes.has(i) && img.blobUrl)
        .map((img) => img.blobUrl as string);

      const platformMap: Record<string, string> = {
        Facebook: "FACEBOOK",
        LinkedIn: "LINKEDIN",
        Twitter: "TWITTER",
        Instagram: "INSTAGRAM",
      };

      const newPost: SavedPost = {
        id: "local_" + Date.now() + "_" + Math.random().toString(36).slice(2),
        title: post.platform,
        platform: platformMap[post.platform] ?? post.platform,
        content: post.content,
        publishedAt: new Date().toISOString(),
        images: selectedImages,
        published: false,
      };

      if (onSaved) {
        onSaved(newPost);
        setSaved(true);
        setSelectedIndexes(new Set());
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e) {
      console.error(e);
      setSaveError(true);
      setTimeout(() => setSaveError(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-gray-700 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          translate="no"
          className={[
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
            badgeClass,
          ].join(" ")}
        >
          {post.platform === "LinkedIn" ? (
            <span>
              <span className="font-bold leading-none">in</span> {post.platform}
            </span>
          ) : (
            post.platform
          )}
        </span>
        <span className="text-xs text-slate-400 dark:text-gray-500">
          {post.scheduledDate.slice(0, 16).replace("T", " ")}
        </span>
      </div>
      <p className="text-sm text-slate-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>
      {allImages.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-slate-400 dark:text-gray-500">
            \u0417\u0443\u0440\u0430\u0433 \u0441\u043E\u043D\u0433\u043E\u0445 (\u0437\u0430\u0430\u0432\u0430\u043B \u0431\u0438\u0448)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {allImages.map((img, i) => {
              const selected = selectedIndexes.has(i);
              const isEdited = i >= images.length;
              return (
                <div key={i} className="relative group aspect-square">
                  <button
                    type="button"
                    onClick={() => toggleImage(i)}
                    className={[
                      "w-full h-full rounded-lg overflow-hidden border-2 transition-all",
                      selected
                        ? "border-[#4038d4] ring-2 ring-[#4038d4]/20 dark:ring-[#4038d4]/30"
                        : "border-slate-200 dark:border-gray-700 opacity-60 hover:opacity-90",
                    ].join(" ")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    {isEdited && (
                      <span className="absolute bottom-1 left-1 bg-purple-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                        AI
                      </span>
                    )}
                  </button>
                  {selected && (
                    <span className="absolute top-2 right-2 bg-[#4038d4] text-white rounded-full size-5 flex items-center justify-center text-[11px] font-bold shadow-sm pointer-events-none">
                      ✓
                    </span>
                  )}
                  {!isEdited && (
                    <button
                      type="button"
                      onClick={() => openEditor(img)}
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#4038d4] hover:bg-[#3530b8] rounded-full p-1.5 shadow-md"
                      title="AI-\u0430\u0430\u0440 \u0437\u0430\u0441\u0432\u0430\u0440\u043B\u0430\u0445"
                    >
                      <Pencil className="size-3.5 text-white" />
                    </button>
                  )}
                </div>
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
          className={
            saved
              ? "border-green-500 text-green-600"
              : saveError
              ? "border-red-500 text-red-600"
              : ""
          }
        >
          {saving
            ? "\u0425\u0430\u0434\u0433\u0430\u043B\u0436 \u0431\u0430\u0439\u043D\u0430..."
            : saved
            ? "\u2713 \u0425\u0430\u0434\u0433\u0430\u043B\u0430\u0433\u0434\u0441\u0430\u043D"
            : saveError
            ? "\u2717 \u0410\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430"
            : "\u0425\u0430\u0434\u0433\u0430\u043B\u0430\u0445"}
        </Button>
      </div>
      {editingImage && (
        <ImageEditorModal
          open={editorOpen}
          onOpenChange={setEditorOpen}
          imagePreview={editingImage.preview}
          imageName={editingImage.name}
          onEdited={handleEdited}
        />
      )}
    </div>
  );
}
