// src/components/CloudinaryUploadWidget.tsx
"use client";
import { useRef, useState } from "react";

export function CloudinaryUploadWidget({
  onUpload,
  onProgress,
  onError,
  folder = "masterclasses",
}: {
  onUpload?: (info: any) => void;
  onProgress?: (percent: number) => void;
  onError?: (message: string) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    
    // Validate file size (5GB max)
    const MAX_5GB = 5 * 1024 * 1024 * 1024;
    if (file.size > MAX_5GB) {
      const msg = `File too large (${(file.size / 1024 ** 3).toFixed(2)} GB). Max 5GB.`;
      if (onError) onError(msg);
      alert(msg);
      return;
    }

    setProgress(0);
    setUploading(true);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("folder", folder);

    try {
      // Upload to our Next.js API route instead of Cloudinary directly
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const p = Math.round((e.loaded / e.total) * 100);
          setProgress(p);
          if (onProgress) onProgress(p);
        }
      });

      xhr.addEventListener("load", () => {
        setUploading(false);
        setProgress(null);

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const resp = JSON.parse(xhr.responseText);
            console.log("Upload successful!", resp);
            if (onUpload) onUpload(resp);
            if (onProgress) onProgress(100);
          } catch (err) {
            console.error("Failed to parse response", err);
            if (onError) onError("Invalid response from server");
          }
        } else {
          console.error("Server returned error", xhr.status, xhr.responseText);
          let errorMsg = `Upload failed (${xhr.status})`;
          try {
            const resp = JSON.parse(xhr.responseText);
            if (resp.error) errorMsg = resp.error;
          } catch (e) {
            // ignore
          }
          if (onError) onError(errorMsg);
          alert(errorMsg);
        }
      });

      xhr.addEventListener("error", () => {
        setUploading(false);
        setProgress(null);
        console.error("Network error");
        const msg = "Network error – check console for details";
        if (onError) onError(msg);
        alert(msg);
      });

      xhr.addEventListener("timeout", () => {
        setUploading(false);
        setProgress(null);
        const msg = "Upload timed out – server took too long";
        if (onError) onError(msg);
        alert(msg);
      });

      // Increase timeout for large uploads (5 minutes)
      xhr.timeout = 300000; // 5 minutes
      xhr.send(formData);
    } catch (err: any) {
      setUploading(false);
      setProgress(null);
      console.error("Upload failed", err);
      const msg = err.message || "Upload failed";
      if (onError) onError(msg);
      alert(msg);
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            handleFile(f);
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            openFilePicker();
          }}
          disabled={uploading}
          className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded disabled:opacity-60 transition flex items-center gap-2"
        >
          {uploading ? (
            <>
              <span className="animate-spin">⏳</span>
              Uploading {progress ?? 0}%
            </>
          ) : (
            <>
              📤 Upload Video (up to 5GB)
            </>
          )}
        </button>
        {progress !== null && progress < 100 && (
          <div className="flex-1 min-w-[100px] bg-white/5 rounded overflow-hidden">
            <div
              className="h-2 bg-amber-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      {uploading && progress === 100 && (
        <div className="text-green-400 text-sm">Processing video... Almost done!</div>
      )}
    </div>
  );
}