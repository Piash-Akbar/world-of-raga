// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Regular upload for files up to 100MB
export async function uploadVideo(fileBuffer: Buffer, folder: string): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: `world-of-raag/${folder}`,
        eager: [{ transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }] }],
        eager_async: true,
      },
      (error, result) => {
        if (error) reject(error);
        else {
          const r = result as unknown as { secure_url?: string; public_id?: string };
          resolve({ secure_url: r.secure_url || '', public_id: r.public_id || '' });
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
}

// **NEW** – chunked upload for files > 100MB (supports up to 5GB+)
export async function uploadLargeVideo(
  fileBuffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{ secure_url: string; public_id: string }> {
  // Write buffer to a temporary file because upload_large expects a file path
  const tempFile = path.join(os.tmpdir(), `upload_${Date.now()}.mp4`);
  fs.writeFileSync(tempFile, fileBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      // @ts-expect-error – `upload_large` may not be in older Cloudinary typings
      cloudinary.uploader.upload_large(
        tempFile,
        {
          resource_type: 'video',
          folder: `world-of-raag/${folder}`,
          public_id: publicId,
          chunk_size: 20000000, // 20MB chunks – adjust as needed
          timeout: 600000,      // 10 minutes for large uploads
          eager: [{ transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }] }],
          eager_async: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    const r = result as unknown as { secure_url?: string; public_id?: string };
    return { secure_url: r.secure_url || '', public_id: r.public_id || '' };
  } finally {
    // Clean up temp file
    fs.unlinkSync(tempFile);
  }
}

// Upload raw files (PDFs, etc.)
export async function uploadRaw(fileBuffer: Buffer, folder: string): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: `world-of-raag/${folder}`,
      },
      (error, result) => {
        if (error) reject(error);
        else {
          const r = result as unknown as { secure_url?: string; public_id?: string };
          resolve({ secure_url: r.secure_url || '', public_id: r.public_id || '' });
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export function getVideoThumbnail(publicId: string, opts?: { width?: number; height?: number }) {
  if (!publicId) return '';
  const transformation = [{ quality: 'auto' }, { fetch_format: 'auto' }];
  if (opts?.width) transformation.push({ width: opts.width, crop: 'scale' });
  return cloudinary.url(publicId, { resource_type: 'video', format: 'jpg', transformation });
}