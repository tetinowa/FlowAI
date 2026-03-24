"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Rocket } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { apiFetch } from "@/lib/apiFetch";

const PLATFORM_GRADIENTS: Record<string, string> = {
  LinkedIn: "from-blue-600 to-blue-400",
  Facebook: "from-indigo-600 to-indigo-400",
  Twitter: "from-sky-400 to-cyan-300",
};

interface Post {
  id: string;
  title: string;
  platform: string;
  publishedAt: string;
  reach: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} минутын өмнө`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} цагийн өмнө`;
  const days = Math.floor(hours / 24);
  return `${days} өдрийн өмнө`;
}

const PLATFORM_COLORS: Record<string, string> = {
  LinkedIn: "#2563eb",
  Facebook: "#4f46e5",
  Twitter: "#0ea5e9",
  Instagram: "#e1306c",
};

function PostRow({ title, platform, publishedAt, reach }: Post) {
  const gradient = PLATFORM_GRADIENTS[platform] ?? "from-slate-400 to-slate-300";
  const color = PLATFORM_COLORS[platform] ?? "#6366f1";
  return (
    <div className="px-4 py-3 flex items-center justify-between hover:bg-muted/40 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${gradient} shrink-0 flex items-center justify-center`}>
          <span className="text-white text-[10px] font-black">{platform[0]}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: `${color}15`, color }}
            >
              {platform}
            </span>
            <span className="text-[10px] text-muted-foreground">{timeAgo(publishedAt)}</span>
          </div>
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className="text-sm font-bold tabular-nums">{reach > 0 ? reach.toLocaleString() : "—"}</p>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">хүрэлт</p>
      </div>
    </div>
  );
}

function RecentPosts({ posts, loading }: { posts: Post[]; loading: boolean }) {
  return (
    <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <span className="text-sm font-bold">Сүүлийн постууд</span>
        <span className="text-xs text-muted-foreground">Нийт {posts.length} пост</span>
      </div>
      <div className="divide-y divide-border">
        {loading && (
          <p className="p-4 text-sm text-muted-foreground">Ачааллаж байна...</p>
        )}
        {!loading && posts.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">
            Одоохондоо пост байхгүй байна. Marketing хуудаснаас контент үүсгэж хадгалаарай.
          </p>
        )}
        {!loading && posts.map((post) => <PostRow key={post.id} {...post} />)}
      </div>
    </div>
  );
}

function ContentProgress({ total }: { total: number }) {
  const goal = 30;
  const pct = Math.min(Math.round((total / goal) * 100), 100);
  const dash = `${pct}, 100`;

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-foreground">Контент төлөвлөгөөний явц</h4>
        <p className="text-xs text-muted-foreground mt-1">Сарын зорилт: {goal} пост</p>
      </div>

      <div className="py-8 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="stroke-border"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3"
            />
            <path
              stroke="#5048e5"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeDasharray={dash}
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-black">{pct}%</span>
            <span className="text-[10px] text-muted-foreground uppercase">Дууссан</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Хадгалсан постууд</span>
          <span className="font-bold">{total} / {goal}</span>
        </div>
      </div>
    </div>
  );
}

export function MarketingSection() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken().then((token) => {
      apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setPosts(data.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [getToken]);

  return (
    <section className="space-y-4">
      <SectionHeader
        icon={Rocket}
        title="Маркетингийн гүйцэтгэл"
        linkLabel="Контент студи"
        onLinkClick={() => router.push("/marketing")}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentPosts posts={posts} loading={loading} />
        <ContentProgress total={posts.length} />
      </div>
    </section>
  );
}
