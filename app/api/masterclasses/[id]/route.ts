// src/app/api/masterclasses/[id]/route.ts (PUT)
import { NextRequest, NextResponse } from 'next/server';
import { getById, updateItem, deleteItem } from '@/lib/dataStore';
import { uploadVideo, uploadLargeVideo, getVideoThumbnail } from '@/lib/cloudinary';

export const runtime = 'nodejs';

const MAX_5GB = 5 * 1024 * 1024 * 1024;

function normalizeMasterclassUpdates(input: Record<string, unknown>) {
  // ... same as before (parses lessons, tags)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const contentType = req.headers.get('content-type') || '';
    let updates: Record<string, unknown> = {};

    if (contentType.includes('application/json')) {
      updates = await req.json();
    } else {
      const formData = await req.formData();
      updates = Object.fromEntries(formData.entries());

      // Check if a new video is being uploaded
      const videoFile = formData.get('video') as File | null;
      if (videoFile) {
        if (videoFile.size > MAX_5GB) {
          return NextResponse.json(
            { error: 'Video must be under 5GB' },
            { status: 413 }
          );
        }
        const buffer = Buffer.from(await videoFile.arrayBuffer());
        let uploadResult;
        if (videoFile.size > 100 * 1024 * 1024) {
          uploadResult = await uploadLargeVideo(buffer, 'masterclasses');
        } else {
          uploadResult = await uploadVideo(buffer, 'masterclasses');
        }
        updates.previewVideoUrl = uploadResult.secure_url;
        updates.thumbnailUrl = getVideoThumbnail(uploadResult.public_id);
      }
    }

    const normalized = normalizeMasterclassUpdates(updates);
    const updated = updateItem('masterclasses', id, normalized as any);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update masterclass failed:', error);
    return NextResponse.json({ error: 'Failed to update masterclass' }, { status: 500 });
  }
}