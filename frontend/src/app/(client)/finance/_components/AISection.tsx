"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';


export const AISection = () => {
    return (
        <div className="bg-gray-100 w-screen flex flex-row gap-10 p-5 flex-wrap">
            <div className="bg-blue-500 w-full h-40 rounded-3xl flex flex-row items-center p-10 gap-5">
                <Button
                    variant="outline"
                    className="bg-blue-600 text-white w-12 h-12 border-none"
                >
                    <Lightbulb strokeWidth={4} />
                </Button>
                <div className="flex flex-col flex-1">
                    <p className="text-white text-[24px] font-bold">AI Санхүүгийн дүн шинжилгээ</p>
                    <p className="text-white text-[18px]">Урьдчилсан байдлаар ₮1,200,000 хэмнэх боломжтой байна.</p>
                </div>
                <Button
                    variant="outline"
                    className="bg-white text-blue-500 w-50 h-10 border-none"
                >
                    Шинжилгээ хийх
                </Button>
            </div>

        </div>
    );
};
