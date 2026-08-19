import { NextRequest, NextResponse } from 'next/server';
import { getAll, createItem } from '@/lib/dataStore';
import { uploadVideo, uploadLargeVideo, getVideoThumbnail } from '@/lib/cloudinary';

export const runtime = 'nodejs';

const MAX_5GB = 5 * 1024 * 1024 * 1024;

export async function GET() {
  return NextResponse.json(getAll('practiceVideos'));
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const level = formData.get('level') as string;
    const duration = Number(formData.get('duration') || 0);
    const videoFile = formData.get('video') as File | null;

    if (!title || !videoFile) {
      return NextResponse.json({ error: 'Title and video are required' }, { status: 400 });
    }

    if (videoFile.size > MAX_5GB) {
      return NextResponse.json({ error: 'Video must be under 5GB' }, { status: 413 });
    }

    const buffer = Buffer.from(await videoFile.arrayBuffer());
    const uploadResult = videoFile.size > 100 * 1024 * 1024
      ? await uploadLargeVideo(buffer, 'practice-videos')
      : await uploadVideo(buffer, 'practice-videos');
    const videoUrl = uploadResult.secure_url;
    const thumbnailUrl = getVideoThumbnail(uploadResult.public_id);

    const newItem = createItem('practiceVideos', {
      title,
      description,
      level,
      duration,
      videoUrl,
      thumbnailUrl,
      isPublished: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Practice video upload failed:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}