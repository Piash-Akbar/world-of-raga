// src/app/api/practice-videos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAll, createItem } from '@/lib/dataStore';
import { uploadVideo } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_VIDEO_SIZE_BYTES = 4 * 1024 * 1024 * 1024;

export async function GET() {
  const videos = getAll('practiceVideos');
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const level = formData.get('level') as string;
    const category = formData.get('category') as string;
    const duration = Number.parseInt(formData.get('duration') as string, 10) || 0;
    const videoFile = formData.get('video') as File | null;

    if (!title || !videoFile) {
      return NextResponse.json({ error: 'Title and video are required' }, { status: 400 });
    }

    if (videoFile.size > MAX_VIDEO_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Video is too large. Please upload a file smaller than ${MAX_VIDEO_SIZE_BYTES / (1024 * 1024)}MB.`,
        },
        { status: 413 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret || cloudName === 'your-cloud-name' || apiKey === 'your-api-key' || apiSecret === 'your-api-secret') {
      return NextResponse.json(
        {
          error: 'Cloudinary credentials are not configured. Add your real CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET values.',
        },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await videoFile.arrayBuffer());
    const videoUrl = await uploadVideo(buffer, 'practice-videos');

    const newVideo = createItem('practiceVideos', {
      title,
      description,
      level,
      category,
      duration,
      videoUrl,
      thumbnailUrl: '',
      views: 0,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error('Practice video upload failed:', error);

    if (error instanceof Error && error.message.includes('413')) {
      return NextResponse.json({ error: 'Video upload failed because the file is too large.' }, { status: 413 });
    }

    return NextResponse.json({ error: 'Upload failed. Please try a smaller video file.' }, { status: 500 });
  }
}