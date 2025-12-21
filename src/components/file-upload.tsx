"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

type FileUploadProps = {
  onChange: (url?: string, fileName?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
  fileName?: string; // Original filename with extension
};

const FileUpload = ({ onChange, value, endpoint, fileName }: FileUploadProps) => {
    // Determine file type from filename (more reliable than URL)
    const getFileExtension = (name: string | undefined) => {
        if (!name) return null;
        return name.split(".").pop()?.toLowerCase();
    };
    
    const fileExtension = getFileExtension(fileName);
    
    // Check for PDF using filename extension
    const isPdf = fileExtension === "pdf";
    
    // Check for image using filename extension
    const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"];
    const isImage = fileExtension && imageExtensions.includes(fileExtension);
    
    // Show image preview
    if (value && isImage) {
        return (
            <div className="relative h-20 w-20">
                <Image fill src={value} alt="Upload" className="rounded-full" unoptimized/>
                <button onClick={() => onChange("", "")} className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" type="button">
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }
    
    // Show PDF preview
    if (value && isPdf) {
        return (
            <div className="relative flex items-center p-3 mt-2 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-800 max-w-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-500/20 dark:bg-indigo-500/30 flex-shrink-0">
                    <FileIcon className="h-7 w-7 fill-indigo-200 stroke-indigo-500 dark:stroke-indigo-400" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 truncate">
                        {fileName || "PDF Document"}
                    </p>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400">
                        PDF Document
                    </p>
                </div>
                <button
                    onClick={() => onChange("", "")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm hover:bg-rose-600 transition"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }
    
    // Fallback: If we have a value but couldn't determine type, show as image (legacy behavior)
    if (value && !isPdf && !isImage) {
        return (
            <div className="relative h-20 w-20">
                <Image fill src={value} alt="Upload" className="rounded-full" unoptimized/>
                <button onClick={() => onChange("", "")} className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" type="button">
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }
    
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                // Pass both URL and original filename
                const file = res?.[0];
                onChange(file?.url, file?.name);
            }}
            onUploadError={(error: Error) => {
                console.log(error);
            }}
        />
    );
};

export default FileUpload;
