"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const data = [
    { огноо: "1-р сар", орлого: 4000, зарлага: 2400 },
    { огноо: "2-р сар", орлого: 3000, зарлага: 1398 },
    { огноо: "3-р сар", орлого: 2000, зарлага: 9800 },
    { огноо: "4-р сар", орлого: 2780, зарлага: 3908 },
    { огноо: "5-р сар", орлого: 1890, зарлага: 4800 },
    { огноо: "6-р сар", орлого: 2390, зарлага: 3800 },
];
const data2 = [{
    id: 1,
    name: "Хоол", value: 400
}, {
    id: 2,
    name: "Тээвэр", value: 300
}, {
    id: 3,
    name: "Үйлчилгээ", value: 200
}, {
    id: 4,
    name: "Бусад", value: 100
},]

const Colors = ["#10b981", "#3b82f6", "#f59e0b", "#f43f5e"];

export const GraphicSection = () => {
    return (
        <div className="bg-gray-100 w-full flex-1 flex flex-row gap-10 p-5">
            <div className="flex w-[50%] flex-col justify-between">
                <div className="flex flex-row justify-between w-full">
                    <p className="text-lg font-bold mb-4">Орлого & Зарлагын график</p>
                    <Button variant="outline" className="bg-white text-slate-900 hover:bg-gray-200 border-gray-300">
                        <ChevronDown />
                        Сүүлийн 6 сар
                    </Button>
                </div>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis dataKey="огноо" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="орлого" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="зарлага" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex w-[50%] flex-col justify-between items-center">
                <div className="w-full flex flex-row justify-between">
                    <p className="text-lg font-bold mb-4">Сүүлийн гүйлгээнүүд</p>
                    <Button variant="outline" className="bg-white text-slate-900 hover:bg-gray-200 border-gray-300">
                        Дэлгэрэнгүй харах
                    </Button>
                </div>
                <ResponsiveContainer width="100%" height={500}>
                    <PieChart>
                        <Pie
                            data={data2}
                            cx="50%"
                            cy="50%"
                            innerRadius={100}
                            outerRadius={160}
                            dataKey="value"
                            label
                        >
                            {data2.map((transaction) => (
                                <Cell key={`cell-${transaction.id}`} fill={Colors[transaction.id % Colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};