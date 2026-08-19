// src/app/api/masterclasses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAll, createItem } from '@/lib/dataStore';
import { uploadVideo, uploadLargeVideo, getVideoThumbnail } from '@/lib/cloudinary';

export const runtime = 'nodejs';

const MAX_5GB = 5 * 1024 * 1024 * 1024; // 5GB

export async function GET() {
  const items = getAll('masterclasses') as Array<Record<string, unknown>>;
  return NextResponse.json(items.map((mc) => ({
    ...(mc || {}),
    lessons: typeof mc.lessons === 'string' ? JSON.parse(mc.lessons) : (mc.lessons as unknown[] | undefined) || []
  })));
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const maestro = formData.get('maestro') as string;
    const about = formData.get('about') as string;
    const price = parseFloat(formData.get('price') as string) || 0;
    const duration = parseInt(formData.get('duration') as string) || 0;
    const lessons = JSON.parse(formData.get('lessons') as string || '[]');
    const videoFile = formData.get('video') as File | null;
    const videoUrlField = formData.get('videoUrl') as string | null;
    const publicIdField = formData.get('publicId') as string | null;

    if (!title || !maestro) {
      return NextResponse.json({ error: 'Title and maestro are required' }, { status: 400 });
    }

    if (videoFile && videoFile.size > MAX_5GB) {
      return NextResponse.json(
        { error: 'Video must be under 5GB' },
        { status: 413 }
      );
    }

    let previewVideoUrl = '';
    let thumbnailUrl = '';

    // If client uploaded directly to Cloudinary, accept the returned URL and public ID
    if (videoUrlField) {
      previewVideoUrl = videoUrlField;
      if (publicIdField) thumbnailUrl = getVideoThumbnail(publicIdField);
    } else if (videoFile) {
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      
      // Choose upload method based on file size
      let uploadResult;
      if (videoFile.size > 100 * 1024 * 1024) {
        uploadResult = await uploadLargeVideo(buffer, 'masterclasses');
      } else {
        uploadResult = await uploadVideo(buffer, 'masterclasses');
      }
      previewVideoUrl = uploadResult.secure_url;
      thumbnailUrl = getVideoThumbnail(uploadResult.public_id);
    }

    const newItem = createItem('masterclasses', {
      title,
      maestro,
      about,
      price,
      duration,
      previewVideoUrl,
      thumbnailUrl,
      lessons,
      isPublished: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Masterclass upload failed:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}