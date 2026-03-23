"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import * as XLSX from "xlsx";
import {
  UploadCloud,
  FileSpreadsheet,
  Trash,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Plus,
  PenLine,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiFetch";
import FinanceForm from "./FinanceForm";
import { FinanceReport } from "./FinanceReport";

interface Transaction {
  [key: string]: string | number;
}
interface UploadedFile {
  name: string;
  data: Transaction[];
}

interface FileUploadProps {
  onResult?: (result: any) => void;
}

// Date object болон бусад утгыг "YYYY-MM-DD" string болгон хөрвүүлнэ
const toDateString = (val: any): string => {
  if (val instanceof Date) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, "0");
    const d = String(val.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(val ?? "");
};

// Банк бүрийн өөр өөр column нэрийг стандарт нэрэнд normalize хийнэ
const COLUMN_ALIASES: Record<string, string[]> = {
  Огноо: [
    "огноо",
    "гүйлгээний огноо",
    "гүйлгээ хийсэн огноо",
    "огноо/цаг",
    "date",
    "txn date",
    "value date",
    "trans date",
    "transaction date",
    "дата",
    "Тайлант огноо",
  ],
  "Гүйлгээний утга": [
    "гүйлгээний утга",
    "утга",
    "тайлбар",
    "гүйлгээ",
    "мэдээлэл",
    "description",
    "particulars",
    "narration",
    "дэлгэрэнгүй",
    "details",
  ],
  Орлого: [
    "орлого",
    "кредит",
    "credit",
    "орлого дүн",
    "incoming",
    "орлогын дүн",
    "deposit",
    "deposits",
    "cr",
    "зээл",
    "Кредит гүйлгээ",
  ],
  Зарлага: [
    "зарлага",
    "дебет",
    "debit",
    "зарлага дүн",
    "outgoing",
    "зарлагын дүн",
    "withdrawal",
    "withdrawals",
    "dr",
    "charges",
    "Дебит гүйлгээ",
  ],
};

const normalizeHeader = (header: string): string => {
  const lower = String(header).toLowerCase().trim();
  for (const [standard, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (
      lower === standard.toLowerCase() ||
      aliases.some((a) => a.toLowerCase() === lower)
    )
      return standard;
  }
  return header;
};

// Excel-ийн header мөрийг олж, банк бүрийн column нэрийг normalize хийж parse хийнэ
const parseExcelData = (buffer: ArrayBuffer): Transaction[] => {
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

  // Огноо эсвэл Date/date агуулсан header мөрийг хайна
  const dateAliases = COLUMN_ALIASES["Огноо"].map((a) => a.toLowerCase());
  const headerRowIndex = rawData.findIndex((row) => {
    if (!Array.isArray(row)) return false;
    return row.some((cell) => {
      const lower = String(cell ?? "")
        .toLowerCase()
        .trim();
      return dateAliases.includes(lower);
    });
  });

  if (headerRowIndex === -1) {
    return XLSX.utils.sheet_to_json<Transaction>(worksheet);
  }

  const rawHeaders = rawData[headerRowIndex] as any[];
  const headers = rawHeaders.map((h) => normalizeHeader(String(h ?? "")));

  const rows = rawData
    .slice(headerRowIndex + 1)
    .filter(
      (row) =>
        Array.isArray(row) && row.some((cell) => cell != null && cell !== ""),
    )
    .map((row) => {
      const obj: Transaction = {};
      headers.forEach((header, i) => {
        if (!header) return;
        const val = row[i] ?? "";
        obj[header] = header === "Огноо" ? toDateString(val) : val;
      });
      return obj;
    })
    .filter((tx) => tx["Огноо"]);

  // Хэрэв Орлого болон Зарлага олдоогүй бол "Дүн" эсвэл "Amount" баганыг шалгана
  const hasIncome = rows.some(
    (r) => r["Орлого"] !== "" && r["Орлого"] !== undefined,
  );
  const hasExpense = rows.some(
    (r) => r["Зарлага"] !== "" && r["Зарлага"] !== undefined,
  );

  if (!hasIncome && !hasExpense) {
    const amountKey = headers.find((h) =>
      ["дүн", "amount", "дүн/amount"].includes(h.toLowerCase()),
    );
    if (amountKey) {
      rows.forEach((row) => {
        const amt = Number(row[amountKey]);
        if (amt > 0) {
          row["Орлого"] = amt;
          row["Зарлага"] = "";
        } else if (amt < 0) {
          row["Зарлага"] = Math.abs(amt);
          row["Орлого"] = "";
        }
      });
    }
  }

  return rows;
};

// "2024-06-04 15:35:12" → "2024-06"
const getMonthKey = (dateVal: string | number): string => {
  const str = String(dateVal);
  const match = str.match(/^(\d{4})[-./](\d{2})/);
  if (!match) return "Тодорхойгүй";
  return `${match[1]}-${match[2]}`;
};

const MONTH_NAMES = [
  "1-р сар",
  "2-р сар",
  "3-р сар",
  "4-р сар",
  "5-р сар",
  "6-р сар",
  "7-р сар",
  "8-р сар",
  "9-р сар",
  "10-р сар",
  "11-р сар",
  "12-р сар",
];

const getMonthLabel = (key: string): string => {
  const [year, month] = key.split("-");
  if (!year || !month) return key;
  return `${year} оны ${MONTH_NAMES[parseInt(month) - 1] ?? month + "-р сар"}`;
};

export default function FileUpload({ onResult }: FileUploadProps) {
  const { getToken, userId } = useAuth();
  const [uploadedFiles, setUploadeddFiles] = useState<UploadedFile[]>([]);
  const [manualTransactions, setManualTransactions] = useState<Transaction[]>(
    [],
  );
  const [showManualForm, setShowManualForm] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    const loadSavedAnalysis = async () => {
      try {
        const token = await getToken();
        const res = await apiFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/finance/analysis`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.length > 0) {
            const latest = data.data[0];
            const restored = {
              summary: latest.summary,
              tips: latest.tips,
              monthly: latest.monthly,
              income: (latest.categories as any)?.income ?? [],
              expenses: (latest.categories as any)?.expenses ?? [],
            };
            setAiResult(restored);
            onResult?.(restored);
          }
        }
      } catch (_) {}
    };
    loadSavedAnalysis();
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>("нийт");
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [monthIndex, setMonthIndex] = useState(-1);

  const downloadPDF = () => {
    if (!aiResult) return;
    setIsPdfLoading(true);

    const date = new Date().toLocaleDateString("mn-MN");

    const catRows = (cats: { name: string; total: number }[]) =>
      cats
        .map(
          (c) =>
            `<tr><td>${c.name}</td><td style="text-align:right">₮${c.total.toLocaleString()}</td></tr>`,
        )
        .join("");

    const monthlyRows = (aiResult.monthly ?? [])
      .map(
        (m: {
          month: string;
          income: { name: string; total: number }[];
          expenses: { name: string; total: number }[];
        }) => {
          const [year, mon] = m.month.split("-");
          const label = `${year} оны ${MONTH_NAMES[parseInt(mon) - 1] ?? mon + "-р сар"}`;
          const incTotal = (m.income ?? []).reduce(
            (s: number, c: { total: number }) => s + c.total,
            0,
          );
          const expTotal = (m.expenses ?? []).reduce(
            (s: number, c: { total: number }) => s + c.total,
            0,
          );
          return `
          <tr style="background:#f8fafc"><td colspan="2" style="font-weight:600;padding:8px 12px;border-top:2px solid #e2e8f0">${label}</td></tr>
          <tr><td style="padding-left:24px;color:#059669">Нийт орлого</td><td style="text-align:right;color:#059669">₮${incTotal.toLocaleString()}</td></tr>
          ${catRows(m.income ?? [])}
          <tr><td style="padding-left:24px;color:#e11d48">Нийт зарлага</td><td style="text-align:right;color:#e11d48">₮${expTotal.toLocaleString()}</td></tr>
          ${catRows(m.expenses ?? [])}`;
        },
      )
      .join("");

    const tipsHtml = (aiResult.tips ?? [])
      .map(
        (t: string, i: number) =>
          `<li style="margin-bottom:8px">${i + 1}. ${t}</li>`,
      )
      .join("");

    const totalIncome = (aiResult.income ?? []).reduce(
      (s: number, c: { total: number }) => s + c.total,
      0,
    );
    const totalExpense = (aiResult.expenses ?? []).reduce(
      (s: number, c: { total: number }) => s + c.total,
      0,
    );

    // Бүх гүйлгээний хүснэгт
    const allTxRows = filteredTransactions
      .map((tx) => {
        const inc = Number(tx["Орлого"] || 0);
        const exp = Number(tx["Зарлага"] || 0);
        return `<tr>
          <td>${String(tx["Огноо"]).slice(0, 10)}</td>
          <td>${tx["Гүйлгээний утга"] ?? ""}</td>
          <td style="text-align:right;color:#059669">${inc ? "₮" + inc.toLocaleString() : ""}</td>
          <td style="text-align:right;color:#e11d48">${exp ? "₮" + exp.toLocaleString() : ""}</td>
        </tr>`;
      })
      .join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Санхүүгийн тайлан</title>
    <style>
      body{font-family:Arial,sans-serif;margin:0;padding:32px;color:#1e293b;font-size:13px}
      h1{font-size:22px;margin-bottom:4px;color:#1e40af}
      .date{color:#64748b;margin-bottom:24px;font-size:12px}
      .summary{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-bottom:20px}
      .summary p{margin:0;line-height:1.7;color:#374151}
      .totals{display:flex;gap:16px;margin-bottom:20px}
      .total-card{flex:1;border-radius:8px;padding:14px;text-align:center}
      .income-card{background:#f0fdf4;border:1px solid #bbf7d0}
      .expense-card{background:#fff1f2;border:1px solid #fecdd3}
      .net-card{background:#f0f9ff;border:1px solid #bae6fd}
      .total-card .label{font-size:11px;color:#64748b;margin-bottom:4px}
      .total-card .value{font-size:18px;font-weight:700}
      .income-card .value{color:#059669}
      .expense-card .value{color:#e11d48}
      .net-card .value{color:#0284c7}
      h2{font-size:15px;margin:20px 0 10px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;color:#334155}
      h3{font-size:14px;color:#334155}
      table{width:100%;border-collapse:collapse;margin-bottom:16px}
      th{font-weight:600}
      td,th{padding:6px 12px;border-bottom:1px solid #f1f5f9}
      ul{padding-left:0;list-style:none;margin:0}
      li{padding:8px 12px;background:#f8fafc;border-radius:6px;margin-bottom:6px;border-left:3px solid #3b82f6}
      @media print{body{padding:16px}@page{margin:15mm}}
    </style></head><body>
    <h1>Санхүүгийн дүн шинжилгээ</h1>
    <div class="date">Тайлан үүсгэсэн: ${date}</div>
    <div class="summary"><p>${aiResult.summary}</p></div>
    <div class="totals">
      <div class="total-card income-card"><div class="label">Нийт орлого</div><div class="value">₮${totalIncome.toLocaleString()}</div></div>
      <div class="total-card expense-card"><div class="label">Нийт зарлага</div><div class="value">₮${totalExpense.toLocaleString()}</div></div>
      <div class="total-card net-card"><div class="label">Цэвэр ашиг</div><div class="value">₮${(totalIncome - totalExpense).toLocaleString()}</div></div>
    </div>
    <h2>Бүх гүйлгээ (${filteredTransactions.length})</h2>
    <table>
      <thead><tr style="background:#f1f5f9;font-size:11px;text-transform:uppercase">
        <th style="text-align:left;padding:6px 12px">Огноо</th>
        <th style="text-align:left;padding:6px 12px">Утга</th>
        <th style="text-align:right;padding:6px 12px">Орлого</th>
        <th style="text-align:right;padding:6px 12px">Зарлага</th>
      </tr></thead>
      <tbody>${allTxRows}</tbody>
    </table>
    <h2>Ангилалаар задаргаа</h2>
    <table>${monthlyRows}</table>
    <h2>Зөвлөмж</h2>
    <ul>${tipsHtml}</ul>
    <script>window.onload=()=>{window.print();}<\/script>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
    setIsPdfLoading(false);
  };

  const allTransactions = useMemo(
    () => [...uploadedFiles.flatMap((f) => f.data), ...manualTransactions],
    [uploadedFiles, manualTransactions],
  );

  // const removeManualTransaction = (index: number) => {
  //   setManualTransactions((prev) => prev.filter((_, i) => i !== index));
  // };

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    for (const tx of allTransactions) {
      const key = getMonthKey(tx["Огноо"] ?? "");
      if (key !== "Тодорхойгүй") months.add(key);
    }
    return Array.from(months).sort();
  }, [allTransactions]);

  // Давхардсан гүйлгээ илрүүлэх — original + давхардсан хос болгон хадгална
  const { uniqueTransactions, duplicates } = useMemo(() => {
    const seen = new Map<string, Transaction>();
    const unique: Transaction[] = [];
    const dupes: { original: Transaction; duplicate: Transaction }[] = [];
    for (const tx of allTransactions) {
      const key = `${tx["Огноо"]}|${tx["Гүйлгээний утга"]}|${tx["Орлого"]}|${tx["Зарлага"]}`;
      if (seen.has(key)) {
        dupes.push({ original: seen.get(key)!, duplicate: tx });
      } else {
        seen.set(key, tx);
        unique.push(tx);
      }
    }
    return { uniqueTransactions: unique, duplicates: dupes };
  }, [allTransactions]);

  // Сонгосон саруудаар шүүнэ; manual гүйлгээ үргэлж орно
  const filteredTransactions = useMemo(() => {
    if (selectedMonths.size === 0) return uniqueTransactions;
    return uniqueTransactions.filter(
      (tx) =>
        tx["_manual"] === 1 ||
        selectedMonths.has(getMonthKey(tx["Огноо"] ?? "")),
    );
  }, [uniqueTransactions, selectedMonths]);

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const readFilesPromises = files.map(
      (file) =>
        new Promise<UploadedFile>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const buffer = event.target?.result as ArrayBuffer;
              const data = parseExcelData(buffer);
              resolve({ name: file.name, data });
            } catch (error) {
              console.error(`${file.name} файлыг уншихад алдаа гарлаа.`, error);
              resolve({ name: file.name, data: [] });
            }
          };
          reader.onerror = (error) => {
            console.error("Файл унших алдаа:", error);
            reject(error);
          };
          reader.readAsArrayBuffer(file);
        }),
    );
    try {
      const parsedFiles = await Promise.all(readFilesPromises);
      setUploadeddFiles((prev) => [...prev, ...parsedFiles]);
    } catch (error) {
      console.error("Өгөгдлүүдийг нэгтгэх үед алдаа гарлаа.", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;
    await processFiles(Array.from(filesList));
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      [".xlsx", ".xls", ".csv"].some((ext) =>
        f.name.toLowerCase().endsWith(ext),
      ),
    );
    await processFiles(files);
  };

  const removeFile = (indexToRemove: number) => {
    setUploadeddFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  };

  const analyzeWithAI = async () => {
    if (filteredTransactions.length === 0) return;
    setIsLoading(true);

    try {
      const transactionsWithMonth = filteredTransactions.map((tx) => ({
        ...tx,
        _month: getMonthKey(tx["Огноо"] ?? ""),
      }));

      const response = await fetch("/api/finance-analyze", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ transactions: transactionsWithMonth, clientId: userId }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `API алдаа (${response.status}): ${text.slice(0, 200)}`,
        );
      }
      const result = await response.json();
      console.log("aiResult:", result);
      setAiResult(result);
      setActiveTab("нийт");
      onResult?.(result);

      const token = await getToken();
      const authHeader = {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/finance/analysis`,
        {
          method: "POST",
          headers: authHeader,
          body: JSON.stringify({
            summary: result.summary,
            categories: { income: result.income, expenses: result.expenses },
            monthly: result.monthly ?? null,
            tips: result.tips,
          }),
        },
      );

      const monthly: {
        month: string;
        revenue: number;
        expense: number;
        netProfit: number;
      }[] =
        Array.isArray(result.monthly) && result.monthly.length > 0
          ? result.monthly
          : result.revenue != null || result.expense != null
            ? [
                {
                  month: new Date().toISOString(),
                  revenue: result.revenue ?? 0,
                  expense: result.expense ?? 0,
                  netProfit:
                    result.netProfit ??
                    (result.revenue ?? 0) - (result.expense ?? 0),
                },
              ]
            : [];

      for (const m of monthly) {
        const raw = m as any;
        // income/expenses can be arrays (from AI) or plain numbers
        const revenue =
          typeof raw.revenue === "number"
            ? raw.revenue
            : Array.isArray(raw.income)
              ? (raw.income as { total: number }[]).reduce(
                  (s, c) => s + (c.total ?? 0),
                  0,
                )
              : typeof raw.income === "number"
                ? raw.income
                : 0;
        const expense =
          typeof raw.expense === "number"
            ? raw.expense
            : Array.isArray(raw.expenses)
              ? (raw.expenses as { total: number }[]).reduce(
                  (s, c) => s + (c.total ?? 0),
                  0,
                )
              : typeof raw.expenses === "number"
                ? raw.expenses
                : 0;
        const netProfit = raw.netProfit ?? revenue - expense;
        // "2025-01" → "2025-01-01" so Date parses correctly
        const monthStr =
          typeof raw.month === "string" && raw.month.length === 7
            ? raw.month + "-01"
            : raw.month;
        await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance`, {
          method: "POST",
          headers: authHeader,
          body: JSON.stringify({
            month: new Date(monthStr).toISOString(),
            revenue,
            expense,
            netProfit,
          }),
        });
      }
    } catch (error) {
      console.error("Алдаа гарлаа:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const monthlyGroups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    filteredTransactions.forEach((tx) => {
      const key = getMonthKey(String(tx["Огноо"] ?? ""));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tx);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredTransactions]);

  const isAllMonths = monthIndex === -1;
  const currentMonthKey = isAllMonths
    ? ""
    : (monthlyGroups[monthIndex]?.[0] ?? "");
  const currentMonthTx = isAllMonths
    ? filteredTransactions
    : (monthlyGroups[monthIndex]?.[1] ?? []);
  const currentMonthLabel = isAllMonths
    ? "Бүх сар"
    : `${currentMonthKey.slice(0, 4)} оны ${MONTH_NAMES[Number(currentMonthKey.slice(5, 7)) - 1]}`;

  const currentMonthAiResult = useMemo(() => {
    if (!aiResult) return null;
    if (isAllMonths) return aiResult;
    const monthData = aiResult.monthly?.find(
      (m: any) => m.month === currentMonthKey,
    );
    if (!monthData) return aiResult;
    return {
      ...aiResult,
      income: monthData.income ?? aiResult.income,
      expenses: monthData.expenses ?? aiResult.expenses,
    };
  }, [aiResult, currentMonthKey, isAllMonths]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-6 mt-10 items-start">
        <Card className="w-full shrink-0 self-stretch shadow-sm rounded-2xl border-slate-100 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
              Дансны хуулга оруулах
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drag & drop upload zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all py-10 px-6 text-center
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isDragging ? "bg-blue-100 dark:bg-blue-800" : "bg-slate-100 dark:bg-slate-700"}`}
              >
                <UploadCloud
                  className={`w-7 h-7 transition-colors ${isDragging ? "text-blue-500" : "text-slate-400 dark:text-slate-400"}`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {isDragging
                    ? "Файлыг энд тавина уу"
                    : "Файлаа энд чирж тавь эсвэл сонго"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Excel (.xlsx, .xls) болон CSV файл дэмжинэ
                </p>
              </div>
              <button
                type="button"
                className="mt-1 px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Файл сонгох
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="flex flex-col items-start gap-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center justify-between p-2 border dark:border-slate-700 rounded-md w-full dark:bg-slate-800"
                  >
                    <div className="flex flex-row items-center gap-2 overflow-hidden">
                      <FileSpreadsheet className="h-4 w-4 shrink-0 dark:text-slate-300" />
                      <span
                        className="text-sm truncate dark:text-slate-200"
                        title={file.name}
                      >
                        {file.name} амжилттай нэмэгдлээ.
                      </span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        {file.data.length} гүйлгээ
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Бэлэн мөнгөний гүйлгээ нэмэх */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowManualForm((v) => !v)}
              className="flex items-center gap-2"
            >
              <PenLine className="h-4 w-4" />
              Бэлэн мөнгөний гүйлгээ нэмэх
            </Button>

            {showManualForm && (
              <FinanceForm
                onClose={() => setShowManualForm(false)}
                onAdd={({ date, type, description, amount }) => {
                  const tx: Transaction = {
                    Огноо: date,
                    "Гүйлгээний утга": description,
                    Орлого: type === "income" ? amount : "",
                    Зарлага: type === "expense" ? amount : "",
                    _manual: 1,
                  };
                  setManualTransactions((prev) => [...prev, tx]);
                }}
              />
            )}

            {duplicates.length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowDuplicates((v) => !v)}
                  className="w-full flex items-center justify-between text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-3 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>
                      {duplicates.length} давхардсан гүйлгээ илрэв — шинжилгээнд
                      оруулахгүй.
                    </span>
                  </div>
                  <span className="text-xs underline">
                    {showDuplicates ? "Хаах" : "Харах"}
                  </span>
                </button>

                {showDuplicates && (
                  <div className="border border-amber-200 dark:border-amber-700 rounded-md overflow-hidden text-xs">
                    {/* Header */}
                    <div className="grid grid-cols-[90px_1fr_100px] bg-amber-100 dark:bg-amber-900/30 px-3 py-2 font-semibold text-amber-800 dark:text-amber-300 border-b border-amber-200 dark:border-amber-700">
                      <span>Огноо</span>
                      <span>Гүйлгээний утга</span>
                      <span className="text-right">Дүн</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {duplicates.map(({ original, duplicate }, i) => {
                        const renderRow = (
                          tx: Transaction,
                          label: string,
                          bg: string,
                        ) => (
                          <div
                            className={`grid grid-cols-[90px_1fr_100px] px-3 py-2 gap-2 items-start ${bg}`}
                          >
                            <div className="flex flex-col gap-0.5">
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded w-fit ${label === "Анхны" ? "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300" : "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400"}`}
                              >
                                {label}
                              </span>
                              <span className="text-slate-500 dark:text-slate-400">
                                {String(tx["Огноо"]).slice(0, 10)}
                              </span>
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 break-words leading-relaxed">
                              {String(tx["Гүйлгээний утга"])}
                            </span>
                            <span
                              className={`text-right font-medium ${tx["Орлого"] ? "text-emerald-600" : "text-rose-600"}`}
                            >
                              {tx["Орлого"]
                                ? `+₮${Number(tx["Орлого"]).toLocaleString()}`
                                : `-₮${Number(tx["Зарлага"]).toLocaleString()}`}
                            </span>
                          </div>
                        );
                        return (
                          <div
                            key={i}
                            className={
                              i > 0 ? "border-t-2 border-amber-100" : ""
                            }
                          >
                            {renderRow(
                              original,
                              "Анхны",
                              "bg-white dark:bg-slate-800",
                            )}
                            {renderRow(
                              duplicate,
                              "Давхардсан",
                              "bg-rose-50 dark:bg-rose-900/20",
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {availableMonths.length > 0 && (
              <div className="space-y-2">
                <Label>Сар шүүх (сонгоогүй бол бүгд)</Label>
                <div className="flex flex-wrap gap-2">
                  {availableMonths.map((month) => (
                    <button
                      key={month}
                      onClick={() => toggleMonth(month)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedMonths.has(month)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-400"
                      }`}
                    >
                      {getMonthLabel(month)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedMonths.size === 0
                    ? `Нийт ${uniqueTransactions.length} гүйлгээ шинжлэгдэнэ`
                    : `${filteredTransactions.length} гүйлгээ шинжлэгдэнэ`}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button
                onClick={analyzeWithAI}
                disabled={isLoading || filteredTransactions.length === 0}
                variant={"outline"}
                className="w-fit bg-blue-600 text-white"
              >
                {isLoading ? "Шинжилж байна..." : "AI-аар шинжлүүлэх"}
              </Button>
              {aiResult && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPDF}
                  disabled={isPdfLoading}
                  className="w-fit flex items-center gap-2 dark:border-slate-600 dark:text-slate-300"
                >
                  <Download className="h-4 w-4" />
                  {isPdfLoading ? "Бэлдэж байна..." : "Тайлан татах"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <div>
          <div className="flex items-center justify-center gap-4 py-4">
            <button
              onClick={() => setMonthIndex((p) => Math.max(p - 1, -1))}
              disabled={monthIndex === -1}
              className="text-indigo-600 disabled:text-gray-300 font-bold text-xl"
            >
              ←
            </button>
            <span className="font-semibold text-lg min-w-[180px] text-center">
              {currentMonthLabel}
            </span>
            <button
              onClick={() =>
                setMonthIndex((p) => Math.min(p + 1, monthlyGroups.length - 1))
              }
              disabled={monthIndex === monthlyGroups.length - 1}
              className="text-indigo-600 disabled:text-gray-300 font-bold text-xl"
            >
              →
            </button>
          </div>

          <FinanceReport
            aiResult={currentMonthAiResult}
            transactions={currentMonthTx.map((tx) => ({
              date: String(tx["Огноо"] ?? ""),
              description: String(tx["Гүйлгээний утга"] ?? ""),
              amount: Number(tx["Зарлага"] || tx["Орлого"] || 0),
              type: Number(tx["Орлого"] || 0) > 0 ? "income" : "expense",
            }))}
          />
        </div>
      </div>
    </>
  );
}
