"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
};

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className={cn("space-y-3", className)}>
      {value ? (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
        </div>
      ) : null}

      <UploadButton
        endpoint="imageUploader"
        onUploadBegin={() => setUploading(true)}
        onClientUploadComplete={(res) => {
          setUploading(false);
          const url = res?.[0]?.ufsUrl ?? res?.[0]?.url;
          if (url) onChange(url);
        }}
        onUploadError={() => setUploading(false)}
        appearance={{
          button:
            "bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold px-4 py-2 rounded-lg ut-ready:bg-emerald-500 ut-uploading:bg-emerald-600",
          allowedContent: "text-slate-500 text-xs",
        }}
        content={{
          button({ ready }) {
            if (uploading) return "Uploading...";
            return ready ? "Upload Image" : "Preparing...";
          },
        }}
      />
    </div>
  );
}
