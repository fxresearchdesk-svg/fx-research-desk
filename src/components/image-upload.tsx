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
        <div className="relative w-24 h-24 overflow-hidden border border-[#1F1F1F]">
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
            "border border-[#1F1F1F] text-[#B8956A] text-sm px-4 py-2 ut-ready:text-[#B8956A] ut-uploading:text-[#6B6B6B]",
          allowedContent: "text-[#6B6B6B] text-xs",
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
