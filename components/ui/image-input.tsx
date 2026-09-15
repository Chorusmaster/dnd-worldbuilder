"use client";

import { ImageIcon, X } from "lucide-react";
import { useRef } from "react";
import { uploadImageAction, deleteImageAction } from "@/features/files/file-upload.action";

type ImageInputProps = {
  value?: string;
  className?: string;
  onChange: (value: string) => void;
  accept?: string;
};

export function ImageInput({
  value,
  className,
  onChange,
  accept,
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file?: File) {
    if (!file) return;

    const url = await uploadImageAction(file);

    onChange(url);
  }

  async function handleRemove() {
    await deleteImageAction(value);

    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={`group relative flex cursor-pointer overflow-hidden rounded-lg border bg-muted/30 transition-colors hover:bg-muted/50 ${className ?? ""}`}
    >
      {value ? (
        <>
          <img
            src={value}
            alt="Character preview"
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleRemove();
            }}
            className="absolute right-2 top-2 rounded-md bg-background/80 p-1.5 opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100"
          >
            <X className="size-4" />
          </button>
        </>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <div className="rounded-full bg-background p-3 shadow-sm">
            <ImageIcon className="size-5" />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Add image
            </p>
            <p className="text-xs">
              Click to upload an image
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
        }}
      />
    </div>
  );
}