"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function FinanceForm({ onClose }: { onClose: () => void }) {
  const { getToken } = useAuth();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "income",
    category: "",
    date: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date) return;
    setSaving(true);
    try {
      const token = await getToken();
      const isIncome = form.type === "income";
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          month: new Date(form.date).toISOString(),
          revenue: isIncome ? Number(form.amount) : 0,
          expense: !isIncome ? Number(form.amount) : 0,
        }),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const incomeCategories = [
    { value: "sales", label: "Борлуулалтын орлого" },
    { value: "service", label: "Үйлчилгээний орлого" },
    { value: "other_income", label: "Бусад орлого" },
  ];

  const expenseCategories = [
    { value: "operating", label: "Урсгал зардал" },
    { value: "inventory", label: "Бараа материал" },
    { value: "marketing", label: "Маркетинг" },
    { value: "transport", label: "Тээвэр" },
    { value: "other_expense", label: "Бусад зардал" },
  ];

  const categories =
    form.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">Санхүүгийн мэдээлэл нэмэх</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="income">Орлого</option>
            <option value="expense">Зарлага</option>
          </select>

          <input
            name="title"
            placeholder="Тайлбар"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="amount"
            type="number"
            placeholder="Дүн"
            value={form.amount}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Ангилал сонгох</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <div className="flex gap-2 justify-end mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Болих
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-60"
            >
              {saving ? "Хадгалж байна..." : "Хадгалах"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}