"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { StrategyForm } from "./components/StrategyForm";
import { ContentCalendar } from "./components/ContentCalendar";
import { SavedPostsList } from "./components/SavedPostsList";
import { Post, ImageItem, SavedPost } from "./components/constants";

export default function MarketingPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("marketing_advice") || null;
  });
  const [posts, setPosts] = useState<Post[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("marketing_posts") || "[]"); } catch { return []; }
  });
  const [visiblePosts, setVisiblePosts] = useState(() => {
    if (typeof window === "undefined") return 0;
    try { return JSON.parse(localStorage.getItem("marketing_posts") || "[]").length; } catch { return 0; }
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [savedPostsLoading, setSavedPostsLoading] = useState(true);
  const [images, setImages] = useState<ImageItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored: { name: string; blobUrl: string }[] = JSON.parse(localStorage.getItem("marketing_images") || "[]");
      return stored.map((img) => ({ name: img.name, preview: img.blobUrl, blobUrl: img.blobUrl, uploading: false }));
    } catch { return []; }
  });
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success)
            setSavedPosts(data.data.map((p: SavedPost & { images: unknown }) => ({
              ...p,
              images: Array.isArray(p.images) ? p.images : [],
            })));
        })
        .catch(console.error)
        .finally(() => setSavedPostsLoading(false));
    });
  }, [getToken]);

  useEffect(() => {
    getToken().then((token) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketing/strategy`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => {
          if (r.status === 401) { setSessionExpired(true); return null; }
          return r.json();
        })
        .then((data) => {
          if (!data) return;
          if (data.success && data.data) {
            setProductName(data.data.productName);
            setDescription(data.data.description);
            setTargetAudience(data.data.targetAudience);
            if (data.data.advice) setAdvice(data.data.advice);
            if (data.data.updatedAt) setLastSaved(new Date(data.data.updatedAt));
          }
        })
        .catch(console.error);
    });
  }, [getToken]);

  useEffect(() => {
    localStorage.setItem("marketing_posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    const uploaded = images.filter((img) => img.blobUrl && !img.uploading);
    localStorage.setItem("marketing_images", JSON.stringify(uploaded.map((img) => ({ name: img.name, blobUrl: img.blobUrl }))));
  }, [images]);

  useEffect(() => {
    if (advice) localStorage.setItem("marketing_advice", advice);
    else localStorage.removeItem("marketing_advice");
  }, [advice]);

  function handleReset() {
    if (!confirm("Үүсгэсэн постуудыг устгах уу?")) return;
    setPosts([]);
    setAdvice(null);
    setVisiblePosts(0);
    localStorage.removeItem("marketing_posts");
    localStorage.removeItem("marketing_advice");
  }

  async function uploadToBlobAndAdd(file: File) {
    const preview = URL.createObjectURL(file);
    setImages((prev) => [...prev, { name: file.name, preview, file, blobUrl: null, uploading: true }]);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      setImages((prev) =>
        prev.map((img) => img.preview === preview ? { ...img, blobUrl: data.url, uploading: false } : img),
      );
    } catch {
      setImages((prev) => prev.filter((img) => img.preview !== preview));
    }
  }

  function handleImageFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).filter((f) => f.type.startsWith("image/")).forEach(uploadToBlobAndAdd);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleGenerate() {
    if (!productName.trim() || !description.trim() || !targetAudience.trim()) return;
    setLoading(true);
    setAdvice(null);
    setPosts([]);
    setVisiblePosts(0);
    setSessionExpired(false);
    try {
      setLoadingStep("AI-д илгээж байна...");
      const toBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      const imageBase64s = await Promise.all(
        images.map(async (img) => {
          if (img.file) return toBase64(img.file);
          const res = await fetch(img.blobUrl!);
          return toBase64(await res.blob());
        })
      );
      const res = await fetch("/api/marketing-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, description, targetAudience, images: imageBase64s }),
      });
      if (res.status === 401) { setSessionExpired(true); return; }
      setLoadingStep("Монгол руу орчуулж байна...");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
      setAdvice(data.advice ?? null);
      const newPosts = data.posts ?? [];
      setPosts(newPosts);
      newPosts.forEach((_: Post, i: number) => {
        setTimeout(() => setVisiblePosts(i + 1), i * 150);
      });
      const token = await getToken();
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketing/strategy`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productName, description, targetAudience, advice: data.advice }),
      })
        .then((r) => r.json())
        .then((saved) => { if (saved.data?.updatedAt) setLastSaved(new Date(saved.data.updatedAt)); })
        .catch(console.error);
    } catch (err) {
      console.error(err);
      setAdvice("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
      setLoadingStep(null);
    }
  }

  function handleFieldChange(field: "productName" | "description" | "targetAudience", value: string) {
    if (field === "productName") setProductName(value);
    else if (field === "description") setDescription(value);
    else setTargetAudience(value);
  }

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Маркетинг</h1>

      {sessionExpired && (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <span>Таны сесс дууссан байна. Хуудсыг дахин ачааллана уу.</span>
          <button onClick={() => window.location.reload()} className="ml-auto font-semibold underline">
            Дахин ачаалах
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
        <StrategyForm
          productName={productName}
          description={description}
          targetAudience={targetAudience}
          onChange={handleFieldChange}
          loading={loading}
          loadingStep={loadingStep}
          advice={advice}
          lastSaved={lastSaved}
          images={images}
          onImageFiles={handleImageFiles}
          onRemoveImage={removeImage}
          onGenerate={handleGenerate}
        />

        <div className="flex flex-col gap-6">
          <ContentCalendar
            posts={posts}
            visiblePosts={visiblePosts}
            images={images}
            onSaved={(post) => setSavedPosts((prev) => [post, ...prev])}
            onReset={handleReset}
          />
          <SavedPostsList
            posts={savedPosts}
            loading={savedPostsLoading}
            onUpdated={(id, content) =>
              setSavedPosts((prev) => prev.map((p) => p.id === id ? { ...p, content } : p))
            }
            onDeleted={(id) => setSavedPosts((prev) => prev.filter((p) => p.id !== id))}
          />
        </div>
      </div>
    </div>
  );
}
