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
  value?: string | File;
  onChange?: (file: File | undefined) => void;
  disabled?: boolean;
  maxSizeInMB?: number;
}

export function FileUpload({
  value,
  onChange,
  disabled,
  maxSizeInMB = 50,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
      return;
    }

    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSizeInMB}MB`);
        return;
      }

      onChange?.(file);
    },
    [onChange, maxSizeInMB],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreview(undefined);
      onChange?.(undefined);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
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
      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className="object-cover"
          />
          {!disabled && (
            <button
              onClick={handleRemove}
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
