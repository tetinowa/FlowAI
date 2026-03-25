"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Platform, SavedPost, PLATFORM_COLORS } from "./constants";

interface SavedPostRowProps {
  post: SavedPost;
  onUpdated: (content: string) => void;
  onDeleted: () => void;
}

export function SavedPostRow({ post, onUpdated, onDeleted }: SavedPostRowProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const badgeClass =
    PLATFORM_COLORS[post.platform as Platform] ??
    "bg-slate-200 text-slate-700 dark:bg-gray-700 dark:text-gray-200";

  function handleSaveEdit() {
    setSaving(true);
    try {
      onUpdated(editContent);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!confirm("\u042D\u043D\u044D \u043F\u043E\u0441\u0442\u044B\u0433 \u0443\u0441\u0442\u0433\u0430\u0445 \u0443\u0443?")) return;
    setDeleting(true);
    try {
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-gray-700 p-4 flex flex-col gap-2">
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
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400 dark:text-gray-500">
            {new Date(post.publishedAt).toLocaleString("mn-MN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {!editing ? (
            <span>
              <button
                onClick={() => {
                  setEditContent(post.content);
                  setEditing(true);
                }}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 dark:text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="size-3.5" />
              </button>
            </span>
          ) : (
            <span>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="ml-2 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-400 dark:text-gray-500 hover:text-green-600 transition-colors"
              >
                <Check className="size-3.5" />
              </button>
              <button
                onClick={() => setEditing(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}
        </div>
      </div>
      {editing ? (
        <Textarea
          className="text-sm resize-none min-h-24"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
      ) : (
        <p className="text-sm text-slate-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap line-clamp-3">
          {post.content}
        </p>
      )}
      {post.images.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          {post.images.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt=""
              className="rounded-md w-full aspect-square object-cover border border-slate-100 dark:border-gray-800"
            />
          ))}
        </div>
      )}
    </div>
  );
}
