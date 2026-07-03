"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoUploadProps {
  onUpload: (file: File) => void;
  currentLogo?: string;
  className?: string;
}

export function LogoUpload({ onUpload, currentLogo, className }: LogoUploadProps) {
  const [preview, setPreview] = useState<string>(currentLogo || "");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onUpload(file);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleRemove = () => {
    setPreview("");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className="relative inline-block">
          <div className="relative h-32 w-32 overflow-hidden rounded-xl border">
            <Image
              src={preview}
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow-sm"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
        >
          <input {...getInputProps()} />
          <div className="rounded-full bg-muted p-3">
            {isDragActive ? (
              <Upload className="h-6 w-6 text-primary" />
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <p className="mt-3 text-sm font-medium">
            {isDragActive ? "Drop logo here" : "Upload Logo"}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, SVG, WEBP (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
}
