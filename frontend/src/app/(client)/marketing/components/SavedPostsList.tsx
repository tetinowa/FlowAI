"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavedPost } from "./constants";
import { SavedPostRow } from "./SavedPostRow";

interface SavedPostsListProps {
  posts: SavedPost[];
  loading: boolean;
  onUpdated: (id: string, content: string) => void;
  onDeleted: (id: string) => void;
}

export function SavedPostsList({ posts, loading, onUpdated, onDeleted }: SavedPostsListProps) {
  return (
    <Card className="rounded-2xl shadow p-0">
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Хадгалсан постууд</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {loading && <p className="text-sm text-slate-400 dark:text-gray-500">Ачааллаж байна...</p>}
        {!loading && posts.length === 0 && (
          <p className="text-sm text-slate-400 dark:text-gray-500">Хадгалсан пост байхгүй байна.</p>
        )}
        {!loading && posts.length > 0 && (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <SavedPostRow
                key={post.id}
                post={post}
                onUpdated={(content) => onUpdated(post.id, content)}
                onDeleted={() => onDeleted(post.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
