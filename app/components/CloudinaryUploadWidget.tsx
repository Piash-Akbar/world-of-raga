// src/components/CloudinaryUploadWidget.tsx
"use client";
import { CldUploadWidget } from "next-cloudinary";

export function CloudinaryUploadWidget() {
  return (
    <CldUploadWidget
      uploadPreset="your_unsigned_preset" // Create this in Cloudinary settings
      options={{
        maxChunkSize: 20000000, // 20MB chunks (default is 20MB)
        resourceType: "video",
        // You can also set: maxFileSize: 5000000000 // 5GB limit
      }}
      onSuccess={(result) => {
        console.log("Upload successful!", result.info);
        // Save the video URL to your database via your API
      }}
    >
      {({ open }) => (
        <button
          onClick={(event) => {
            event.preventDefault();
            open();
          }}
          className="bg-amber-400 text-black px-4 py-2 rounded"
        >
          Upload Video (up to 5GB+)
        </button>
      )}
    </CldUploadWidget>
  );
}