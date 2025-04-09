/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

"use client";

import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface FileUploadProps {
  value?: string | File | (string | File)[];
  onChange?: (files: (string | File)[]) => void;
  disabled?: boolean;
  maxSizeInMB?: number;
  multiple?: boolean;
}

export function FileUpload({
  value,
  onChange,
  disabled,
  maxSizeInMB = 50,
  multiple = false,
}: FileUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!value) {
      setPreviews([]);
      return;
    }

    if (Array.isArray(value)) {
      const urls = value.map(item => {
        if (typeof item === "string") return item;
        return URL.createObjectURL(item);
      });
      setPreviews(urls);
      return () => urls.forEach(url => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    } else {
      const url = typeof value === "string" ? value : URL.createObjectURL(value);
      setPreviews([url]);
      return () => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      };
    }
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      const oversizedFiles = acceptedFiles.filter(
        file => file.size > maxSizeInMB * 1024 * 1024
      );

      if (oversizedFiles.length > 0) {
        toast.error(`All files must be less than ${maxSizeInMB}MB`);
        return;
      }

      const currentFiles = Array.isArray(value) ? value : value ? [value] : [];
      const newFiles = multiple
        ? [...currentFiles, ...acceptedFiles] as (string | File)[]
        : [acceptedFiles[0]] as (string | File)[];
      onChange?.(newFiles);
    },
    [onChange, maxSizeInMB, multiple, value],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      const newPreviews = previews.filter((_, i) => i !== index);
      setPreviews(newPreviews);
      const newValue = Array.isArray(value) ? value.filter((_, i) => i !== index) : [];
      onChange?.(newValue);
    },
    [onChange, previews, value],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: multiple ? undefined : 1,
    disabled: disabled,
  });

  const { ref, ...rootProps } = getRootProps();

  return (
    <div
      {...rootProps}
      ref={ref}
      className={cn(
        "group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 transition-colors",
        isDragActive
          ? "border-primary/50 bg-primary/5"
          : "hover:border-primary/50",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input {...getInputProps()} />
      {previews.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={preview}
                alt={`Upload preview ${index + 1}`}
                fill
                className="object-cover"
              />
              {!disabled && (
                <button
                  onClick={(e) => handleRemove(e, index)}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <UploadCloud className="h-8 w-8" />
          <div className="text-center">
            {isDragActive ? (
              <p>Drop the image here</p>
            ) : (
              <>
                <p>Drag & drop an image here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Max file size: {maxSizeInMB}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
