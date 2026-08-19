import { NextRequest, NextResponse } from 'next/server';
import { getAll, createItem } from '@/lib/dataStore';
import { uploadVideo } from '@/lib/cloudinary';

export async function GET() {
  const items = getAll('masterclasses') as Array<Record<string, unknown>>;
  return NextResponse.json(items.map((mc) => ({
    ...mc,
    lessons: typeof mc.lessons === 'string' ? JSON.parse(mc.lessons as string) : (mc.lessons as unknown[] | undefined) || []
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

    if (!title || !maestro) {
      return NextResponse.json({ error: 'Title and maestro are required' }, { status: 400 });
    }

    let previewVideoUrl = '';
    if (videoFile) {
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      previewVideoUrl = await uploadVideo(buffer, 'masterclasses');
    }

    const newItem = createItem('masterclasses', {
      title,
      maestro,
      about,
      price,
      duration,
      previewVideoUrl,
      thumbnailUrl: '',
      lessons, // store as array, will be stringified when writing to JSON
      isPublished: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}