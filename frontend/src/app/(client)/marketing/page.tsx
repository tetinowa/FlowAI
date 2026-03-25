"use client";
import { useState, useEffect, useCallback } from "react";
import { StrategyForm } from "./components/StrategyForm";
import { ContentCalendar } from "./components/ContentCalendar";
import { SavedPostsList } from "./components/SavedPostsList";
import { Post, ImageItem, SavedPost } from "./components/constants";

const LS_POSTS = "marketing_posts";
const LS_ADVICE = "marketing_advice";
const LS_IMAGES = "marketing_images";
const LS_SAVED = "marketing_saved_posts";

function loadSavedPosts(): SavedPost[] {
    if (typeof window === "undefined") return [];
    try {
          return JSON.parse(localStorage.getItem(LS_SAVED) || "[]");
    } catch {
          return [];
    }
}

function persistSavedPosts(posts: SavedPost[]) {
    localStorage.setItem(LS_SAVED, JSON.stringify(posts));
}

export default function MarketingPage() {
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState<string | null>(null);
    const [advice, setAdvice] = useState<string | null>(() => {
          if (typeof window === "undefined") return null;
          return localStorage.getItem(LS_ADVICE) || null;
    });
    const [posts, setPosts] = useState<Post[]>(() => {
          if (typeof window === "undefined") return [];
          try {
                  return JSON.parse(localStorage.getItem(LS_POSTS) || "[]");
          } catch {
                  return [];
          }
    });
    const [visiblePosts, setVisiblePosts] = useState(() => {
          if (typeof window === "undefined") return 0;
          try {
                  return JSON.parse(localStorage.getItem(LS_POSTS) || "[]").length;
          } catch {
                  return 0;
          }
    });
    const [savedPosts, setSavedPosts] = useState<SavedPost[]>(() => loadSavedPosts());
    const [images, setImages] = useState<ImageItem[]>(() => {
          if (typeof window === "undefined") return [];
          try {
                  const stored: { name: string; blobUrl: string }[] = JSON.parse(
                            localStorage.getItem(LS_IMAGES) || "[]",
                          );
                  return stored.map((img) => ({
                            name: img.name,
                            preview: img.blobUrl,
                            blobUrl: img.blobUrl,
                            uploading: false,
                  }));
          } catch {
                  return [];
          }
    });

  useEffect(() => {
        localStorage.setItem(LS_POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
        const uploaded = images.filter((img) => img.blobUrl && !img.uploading);
        localStorage.setItem(
                LS_IMAGES,
                JSON.stringify(
                          uploaded.map((img) => ({ name: img.name, blobUrl: img.blobUrl })),
                        ),
              );
  }, [images]);

  useEffect(() => {
        if (advice) localStorage.setItem(LS_ADVICE, advice);
        else localStorage.removeItem(LS_ADVICE);
  }, [advice]);

  function handleReset() {
        if (!confirm("Үүсгэсэн постуудыг устгах уу?")) return;
        setPosts([]);
        setAdvice(null);
        setVisiblePosts(0);
        localStorage.removeItem(LS_POSTS);
        localStorage.removeItem(LS_ADVICE);
  }

  async function fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
        });
  }

  async function uploadToBlobAndAdd(file: File) {
        const preview = URL.createObjectURL(file);
        setImages((prev) => [
                ...prev,
          { name: file.name, preview, file, blobUrl: null, uploading: true },
              ]);
        try {
                const dataUrl = await fileToBase64(file);
                setImages((prev) =>
                          prev.map((img) =>
                                      img.preview === preview
                                               ? { ...img, blobUrl: dataUrl, uploading: false }
                                        : img,
                                           ),
                                );
        } catch {
                setImages((prev) => prev.filter((img) => img.preview !== preview));
        }
  }

  function handleImageFiles(files: FileList | null) {
        if (!files) return;
        Array.from(files)
          .filter((f) => f.type.startsWith("image/"))
          .forEach(uploadToBlobAndAdd);
  }

  function removeImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const handlePostSaved = useCallback((post: SavedPost) => {
        setSavedPosts((prev) => {
                const next = [post, ...prev];
                persistSavedPosts(next);
                return next;
        });
  }, []);

  async function handleGenerate() {
        if (!productName.trim() || !description.trim() || !targetAudience.trim()) return;
        setLoading(true);
        setAdvice(null);
        setPosts([]);
        setVisiblePosts(0);
        try {
                setLoadingStep("AI-д илгээж байна...");
                const toBase64 = (blob: Blob) =>
                          new Promise<string>((resolve, reject) => {
                                      const reader = new FileReader();
                                      reader.onload = () => resolve(reader.result as string);
                                      reader.onerror = reject;
                                      reader.readAsDataURL(blob);
                          });

          const imageBase64s = await Promise.all(
                    images.map(async (img) => {
                                if (img.file) return toBase64(img.file);
                                if (img.blobUrl) {
                                              if (img.blobUrl.startsWith("data:")) return img.blobUrl;
                                              const res = await fetch(img.blobUrl);
                                              return toBase64(await res.blob());
                                }
                                return null;
                    }),
                  ).then((arr) => arr.filter(Boolean) as string[]);

          const res = await fetch("/api/marketing-generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                                productName,
                                description,
                                targetAudience,
                                images: imageBase64s,
                    }),
          });

          setLoadingStep("Монгол руу орчуулж байна...");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
                setAdvice(data.advice ?? null);
                const newPosts = data.posts ?? [];
                setPosts(newPosts);
                newPosts.forEach((_: Post, i: number) => {
                          setTimeout(() => setVisiblePosts(i + 1), i * 150);
                });
        } catch (err) {
                console.error(err);
                setAdvice("Алдаа гарлаа. Дахин оролдоно уу.");
        } finally {
                setLoading(false);
                setLoadingStep(null);
        }
  }

  function handleFieldChange(
        field: "productName" | "description" | "targetAudience",
        value: string,
      ) {
        if (field === "productName") setProductName(value);
        else if (field === "description") setDescription(value);
        else setTargetAudience(value);
  }

  return (
        <div className="flex-1 p-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                      Маркетинг
              </h1>h1>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
                      <StrategyForm
                                  productName={productName}
                                  description={description}
                                  targetAudience={targetAudience}
                                  onChange={handleFieldChange}
                                  loading={loading}
                                  loadingStep={loadingStep}
                                  advice={advice}
                                  lastSaved={null}
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
                                              onSaved={handlePostSaved}
                                              onReset={handleReset}
                                            />
                                <SavedPostsList
                                              posts={savedPosts}
                                              loading={false}
                                              onUpdated={(id, content) => {
                                                              setSavedPosts((prev) => {
                                                                                const next = prev.map((p) => (p.id === id ? { ...p, content } : p));
                                                                                persistSavedPosts(next);
                                                                                return next;
                                                              });
                                              }}
                                              onDeleted={(id) => {
                                                              setSavedPosts((prev) => {
                                                                                const next = prev.filter((p) => p.id !== id);
                                                                                persistSavedPosts(next);
                                                                                return next;
                                                              });
                                              }}
                                              onDeletedAll={async () => {
                                                              if (!confirm("Бүх хадгалсан постуудыг устгах уу?")) return;
                                                              setSavedPosts([]);
                                                              localStorage.removeItem(LS_SAVED);
                                              }}
                                            />
                      </div>div>
              </div>div>
        </div>div>
      );
}</div>
