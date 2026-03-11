"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { UploadCloud, FileSpreadsheet, Table2, Ghost, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Transaction {
    [key: string]: string | number;
}
interface UploadedFile {
    name:string;
    data:Transaction[];
}

export default function FileUpload() {
    const [uploadedFiles, setUploadeddFiles]=useState<UploadedFile[]>([])
    const [aiResult, setAiResult]=useState<any>(null);
    const [isLoading, setIsLoading] =useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList=e.target.files
    if (!filesList || filesList.length===0) return;

        const files = Array.from(filesList)

        const readFilesPromises=files.map(file=> {
            return new Promise<UploadedFile>((resolve, reject) =>{
                const reader =new FileReader()

                reader.onload = (event) => {
                    try {
                        const buffer = event.target?.result;
                        const workbook = XLSX.read(buffer, { type: "array" });
                        
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        
                        const jsonData = XLSX.utils.sheet_to_json<Transaction>(worksheet);
                        resolve({name: file.name, data:jsonData});
                    } catch (error) {
                        console.error(`${file.name} файлыг уншихад алдаа гарлаа.`, error);
                        resolve({name:file.name, data:[]});
                    }
        };
        reader.onerror =(error)=> {
            console.error("Файл унших алдаа:", error);
            reject(error);
        };
        reader.readAsArrayBuffer(file)
            })
        })

        try {
            const parsedFiles= await Promise.all(readFilesPromises);
            setUploadeddFiles(prev=>[...prev, ...parsedFiles])
        }catch(error){
            console.error("Өгөгдлүүдийг нэгтгэх үед алдаа гарлаа.", error);
        }
        e.target.value="";
    };

    const removeFile=(indexToRemove:number)=>{
        setUploadeddFiles(prev=> prev.filter((_, index)=>index !== indexToRemove))
    }

    const analyzeWithAI= async()=>{
        if(uploadedFiles.length ===0) return;
        setIsLoading(true);

        const allTransactions=uploadedFiles.flatMap(file=>file.data)

        try{
            const response =await fetch ("/api/finance-analyze", {
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({transactions: allTransactions})
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
        <div className="w-full flex-1 flex space-y-6 mt-10">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UploadCloud className="h-6 w-6 text-zinc-700" />
                        Дансны хуулга оруулах
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="statement-upload">Excel файл сонгоно уу</Label>
                        <Input
                            id="statement-upload"
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileUpload}
                            multiple
                        />
                    </div>

                    {uploadedFiles.length>0  && (
                        
                        <div className="flex  flex-col items-start gap-2">
                         {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex flex-row items-center justify-between p-2 border rounded-md">
                        <div className="flex flex-row items-center gap-2 overflow-hidden">
                        <FileSpreadsheet className="h-4 w-4" />
                        <span className="text-sm truncate" title={file.name}>
                        {file.name} амжилттай нэмэгдлээ.
                        </span>
                        </div>
                        <Button variant="ghost"
                        size="icon"
                        onClick={()=>removeFile(index)}>
                            <Trash className="h-4 w-4 text-red-500"/>
                        </Button>
                       
                    </div>
                ))}
                        </div>
                        
                    )}
                     <Button onClick={analyzeWithAI}
                        disabled={isLoading || uploadedFiles.length===0}
                        variant={"outline"}
                        className="w-fit bg-blue-600 text-white">
                            {isLoading ? "Шинжилж байна..." : " AI-аар шинжлүүлэх"}
                        </Button>
                </CardContent>
            </Card>
        </div>
    );
}