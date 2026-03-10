"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { UploadCloud, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Transaction {
    [key: string]: string | number;
}

export default function FileUpload() {
    const [data, setData] = useState<Transaction[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [aiResult, setAiResult]=useState<any>(null);
    const [isLoading, setIsLoading] =useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();

        reader.onload = (event) => {
            const buffer = event.target?.result;
            const workbook = XLSX.read(buffer, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json<Transaction>(worksheet);
            setData(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };

    const analyzeWithAI= async()=>{
        if(data.length ===0) return;
        setIsLoading(true);

        try{
            const response =await fetch ("/api/finance-analyze", {
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({transactions:data})
            })
            const result= await response.json();
            setAiResult(result);
            console.log("AI Хариу:", result);
        } catch (error) {
            console.error("Алдаа гарлаа:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen flex space-y-6 mt-10">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UploadCloud className="h-6 w-6 text-zinc-700" />
                        Дансны хуулга оруулах
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="statement-upload">Excel файл сонгоно уу</Label>
                        <Input
                            id="statement-upload"
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileUpload}
                        />
                    </div>

                    {fileName && (
                        <div className="flex flex-col gap-4">

                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4" />
                            {fileName} амжилттай уншигдлаа.
                        </p>
                        <Button onClick={analyzeWithAI}
                        disabled={isLoading || data.length===0}
                        className="w-fit">
                            {isLoading ? "Шинжилж байна..." : " AI-аар шинжлүүлэх"}
                        </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}