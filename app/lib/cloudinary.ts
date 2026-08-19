// src/lib/cloudinary.ts (excerpt)
export async function uploadVideo(
  fileBuffer: Buffer,
  folder: string
): Promise<{ secure_url: string; public_id: string; duration?: number }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: `world-of-raag/${folder}`,
        transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({
          secure_url: result?.secure_url || '',
          public_id: result?.public_id || '',
          duration: result?.duration || 0,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function uploadLargeVideo(
  fileBuffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{ secure_url: string; public_id: string; duration?: number }> {
  // ... same as before, but also return the full object
}