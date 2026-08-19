// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadVideo(fileBuffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: `world-of-raag/${folder}`,
        eager: [
          { quality: 'auto', fetch_format: 'auto' },
        ],
        eager_async: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        const transformedUrl = result?.eager?.[0]?.secure_url || result?.secure_url || '';
        resolve(transformedUrl);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteVideo(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
}