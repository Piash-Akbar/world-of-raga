import { NextRequest, NextResponse } from 'next/server';
import { getAll, createItem } from '@/lib/dataStore';
import { uploadVideo } from '@/lib/cloudinary';

export async function GET() {
  return NextResponse.json(getAll('reels'));
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const duration = parseInt(formData.get('duration') as string) || 0;
    const videoFile = formData.get('video') as File | null;

    if (!title || !videoFile) {
      return NextResponse.json({ error: 'Title and video are required' }, { status: 400 });
    }

    const buffer = Buffer.from(await videoFile.arrayBuffer());
    const videoUrl = await uploadVideo(buffer, 'reels');

    const newItem = createItem('reels', {
      title,
      description,
      type,
      duration,
      videoUrl,
      thumbnailUrl: '',
      views: 0,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}