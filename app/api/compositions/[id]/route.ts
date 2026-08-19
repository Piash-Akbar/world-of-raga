import { NextRequest, NextResponse } from 'next/server';
import { getById, updateItem, deleteItem } from '@/lib/dataStore';

export const runtime = 'nodejs';

const MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024 * 1024;

function normalizeCompositionUpdates(input: Record<string, unknown>) {
  const updates = { ...input };

  if (typeof updates.tags === 'string') {
    updates.tags = updates.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return updates;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const item = getById('compositions', id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
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
      const videoFile = formData.get('video') as File | null;
      const pdfFile = formData.get('pdf') as File | null;

      if (videoFile && videoFile.size > MAX_UPLOAD_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `Video is too large. Please upload a file smaller than ${(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024 * 1024)).toFixed(0)}GB.`,
          },
          { status: 413 }
        );
      }

      if (pdfFile && pdfFile.size > MAX_UPLOAD_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `PDF is too large. Please upload a file smaller than ${(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024 * 1024)).toFixed(0)}GB.`,
          },
          { status: 413 }
        );
      }
    }

    const normalized = normalizeCompositionUpdates(updates);
    const updated = updateItem('compositions', id, normalized as any);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update composition failed:', error);
    return NextResponse.json({ error: 'Failed to update composition' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PUT(req, context);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const deleted = deleteItem('compositions', id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}