// src/app/api/practice-videos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getById, updateItem, deleteItem } from '@/lib/dataStore';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const updates = await req.json();
  const updated = updateItem('practiceVideos', id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const deleted = deleteItem('practiceVideos', id);
  if (!deleted) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}