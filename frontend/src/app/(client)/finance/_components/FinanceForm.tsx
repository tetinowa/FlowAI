"use client";
import { useState } from "react";

type TransactionType = "income" | "expense";

interface CategoryDetail {
  amount: string;
  note: string;
}

interface FinanceFormProps {
  onClose: () => void;
  onAdd: (tx: {
    date: string;
    type: string;
    description: string;
    amount: number;
  }) => void;
}

const CATEGORIES = {
  income: [
    { emoji: "💼", label: "Борлуулалтын орлого" },
    { emoji: "📈", label: "Зээл" },
  ],
  expense: [
    { emoji: "🍔", label: "Цалин" },
    { emoji: "🚗", label: "Тээвэр" },
    { emoji: "📦", label: "Бараа материал" },
    { emoji: "📈", label: "Тоног төхөөрөмж ашиглалт" },
  ],
};

export default function FinanceForm({ onClose, onAdd }: FinanceFormProps) {
  const [type, setType] = useState<TransactionType>("income");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryDetails, setCategoryDetails] = useState<
    Record<string, CategoryDetail>
  >({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isIncome = type === "income";
  const selectedCategories = Object.keys(categoryDetails);

  const totalAmount = Object.values(categoryDetails).reduce(
    (sum, d) => sum + (parseFloat(d.amount) || 0),
    0,
  );

  const accentGradient = isIncome
    ? "from-emerald-400 to-green-500"
    : "from-rose-400 to-red-500";
  const accentShadow = isIncome
    ? "shadow-emerald-500/30"
    : "shadow-rose-500/30";
  const focusRing = isIncome
    ? "focus:border-emerald-400/60 focus:ring-emerald-400/10 focus:bg-emerald-400/5"
    : "focus:border-rose-400/60 focus:ring-rose-400/10 focus:bg-rose-400/5";

  const toggleCategory = (label: string) => {
    setCategoryDetails((prev) => {
      const next = { ...prev };
      if (next[label]) {
        delete next[label];
        if (expandedCategory === label) setExpandedCategory(null);
      } else {
        next[label] = { amount: "", note: "" };
        setExpandedCategory(label);
      }
      return next;
    });
  };

  const updateDetail = (
    label: string,
    field: keyof CategoryDetail,
    value: string,
  ) => {
    setCategoryDetails((prev) => ({
      ...prev,
      [label]: { ...prev[label], [field]: value },
    }));
  };

  const handleSubmit = () => {
    if (totalAmount === 0 || !date) return;
    Object.entries(categoryDetails).forEach(([label, detail]) => {
      const amt = parseFloat(detail.amount);
      if (amt > 0) {
        onAdd?.({
          date,
          type,
          description: detail.note ? `${label} - ${detail.note}` : label,
          amount: amt,
        });
      }
    });
    onClose();
  };

  return (
    <div
      className="relative w-full max-w-md bg-[#13141c] rounded-3xl border border-white/[0.07] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      style={{ animation: "slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <div
        className={`h-0.5 w-full bg-linear-to-r ${accentGradient} opacity-80 shrink-0`}
      />

      <div className="overflow-y-auto flex-1 p-7">
        {/* Header */}
        <div className="flex items-center gap-4 mb-7">
          <div
            className={`w-12 h-12 rounded-2xl bg-linear-to-br ${accentGradient} flex items-center justify-center text-xl shadow-lg ${accentShadow} transition-all duration-500`}
          >
            {isIncome ? "💰" : "💸"}
          </div>
          <div>
            <h2 className="text-[#eeeef5] font-black text-[18px] tracking-tight leading-tight">
              Санхүүгийн мэдээлэл нэмэх
            </h2>
            <p className="text-white/30 text-xs font-semibold mt-0.5 tracking-wide uppercase">
              Шинэ гүйлгээ бүртгэх
            </p>
          </div>
        </div>

        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-1.5 bg-white/4 rounded-2xl p-1.5 mb-6">
          {(["income", "expense"] as TransactionType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setCategoryDetails({});
                setExpandedCategory(null);
              }}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                type === t
                  ? t === "income"
                    ? `bg-linear-to-r ${accentGradient} text-[#051a0c] shadow-lg shadow-emerald-500/25`
                    : `bg-linear-to-r ${accentGradient} text-white shadow-lg shadow-rose-500/25`
                  : "text-white/35 hover:text-white/60 hover:bg-white/4"
              }`}
            >
              {t === "income" ? "↑ Орлого" : "↓ Зарлага"}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
            Ангилал
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {CATEGORIES[type].map(({ emoji, label }) => {
              const selected = !!categoryDetails[label];
              return (
                <button
                  key={label}
                  onClick={() => toggleCategory(label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    selected
                      ? isIncome
                        ? "bg-emerald-400/15 border-emerald-400/40 text-emerald-300"
                        : "bg-rose-400/15 border-rose-400/40 text-rose-300"
                      : "bg-white/4 border-white/8 text-white/40 hover:text-white/60 hover:bg-white/[0.07]"
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>

          {/* Accordion list */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-col gap-2">
              {selectedCategories.map((cat) => {
                const catInfo = CATEGORIES[type].find((c) => c.label === cat);
                const detail = categoryDetails[cat];
                const isExpanded = expandedCategory === cat;
                return (
                  <div
                    key={cat}
                    className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                      isIncome
                        ? "border-emerald-400/20 bg-emerald-400/4"
                        : "border-rose-400/20 bg-rose-400/4"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandedCategory(isExpanded ? null : cat)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{catInfo?.emoji}</span>
                        <span
                          className={`text-sm font-bold ${isIncome ? "text-emerald-300" : "text-rose-300"}`}
                        >
                          {cat}
                        </span>
                        {detail.amount ? (
                          <span
                            className={`text-xs font-black px-2 py-0.5 rounded-full ${isIncome ? "bg-emerald-400/15 text-emerald-400" : "bg-rose-400/15 text-rose-400"}`}
                          >
                            ₮{parseFloat(detail.amount).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[11px] text-white/25 font-medium">
                            дүн оруулаагүй
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(cat);
                          }}
                          className="w-5 h-5 flex items-center justify-center rounded-full text-white/20 hover:text-white/60 hover:bg-white/10 text-sm transition-all"
                        >
                          ×
                        </span>
                        <span
                          className={`text-white/30 text-[10px] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        >
                          ▼
                        </span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/5">
                        <div className="pt-3">
                          <label className="block text-[10px] font-black text-white/25 uppercase tracking-widest mb-1.5">
                            Дүн
                          </label>
                          <div className="relative">
                            <span
                              className={`absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm ${isIncome ? "text-emerald-400/60" : "text-rose-400/60"}`}
                            >
                              ₮
                            </span>
                            <input
                              type="number"
                              value={detail.amount}
                              onChange={(e) =>
                                updateDetail(cat, "amount", e.target.value)
                              }
                              placeholder="0"
                              autoFocus
                              className={`w-full bg-white/5 border border-white/8 rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold text-[#eeeef5] outline-none ring-2 ring-transparent transition-all duration-200 ${focusRing} placeholder:text-white/15`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-white/25 uppercase tracking-widest mb-1.5">
                            Тэмдэглэл
                          </label>
                          <input
                            type="text"
                            value={detail.note}
                            onChange={(e) =>
                              updateDetail(cat, "note", e.target.value)
                            }
                            placeholder="Нэмэлт тайлбар..."
                            className={`w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#eeeef5] outline-none ring-2 ring-transparent transition-all duration-200 ${focusRing} placeholder:text-white/20`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="mb-7">
          <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">
            Огноо
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-40">
              📅
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full bg-white/5 border border-white/8 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-semibold text-[#eeeef5] outline-none ring-4 ring-transparent transition-all duration-200 ${focusRing} scheme-dark`}
            />
          </div>
        </div>

        <div className="h-px bg-white/6 mb-6" />

        {/* Footer */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl text-sm font-bold text-white/40 bg-white/5 border border-white/[0.07] hover:bg-white/9 hover:text-white/70 transition-all duration-200"
          >
            Болих
          </button>
          <button
            onClick={handleSubmit}
            disabled={totalAmount === 0 || saving}
            className={`px-7 py-3 rounded-2xl text-sm font-black bg-linear-to-r ${accentGradient} shadow-lg ${accentShadow} hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all duration-200 ${isIncome ? "text-[#041a0a]" : "text-white"} disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
          >
            {saving ? "Хадгалж байна..." : "Хадгалах →"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
