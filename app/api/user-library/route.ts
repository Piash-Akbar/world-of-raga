// src/app/api/user-library/route.ts (GET, POST)
import { NextRequest, NextResponse } from 'next/server';
import { getAll, createItem, updateItem, deleteItem } from '@/lib/dataStore';

type UserLibraryItem = {
  id: string;
  userId: string;
  itemType: string;
  itemId: string;
  progress: number;
  lastAccessed: string;
  purchasedAt: string;
};

// GET all library items for the current user (demo user)
export async function GET() {
  const all = getAll<UserLibraryItem>('userLibrary');
  const userItems = all.filter((item) => item.userId === 'demo-user');
  return NextResponse.json(userItems);
}

// POST: Add an item to library (purchase)
export async function POST(req: NextRequest) {
  const { itemType, itemId, userId = 'demo-user' } = await req.json();
  if (!itemType || !itemId) {
    return NextResponse.json({ error: 'Missing itemType or itemId' }, { status: 400 });
  }

  const existing = getAll<UserLibraryItem>('userLibrary').find(
    (item) => item.userId === userId && item.itemType === itemType && item.itemId === itemId
  );
  if (existing) {
    return NextResponse.json(existing);
  }
  const newItem = createItem<UserLibraryItem>('userLibrary', {
    userId,
    itemType,
    itemId,
    progress: 0,
    lastAccessed: new Date().toISOString(),
    purchasedAt: new Date().toISOString(),
  });
  return NextResponse.json(newItem, { status: 201 });
}

// PATCH: Update progress
export async function PATCH(req: NextRequest) {
  const { id, progress } = await req.json();
  if (!id || progress === undefined) {
    return NextResponse.json({ error: 'Missing id or progress' }, { status: 400 });
  }
  const updated = updateItem<UserLibraryItem>('userLibrary', id, { progress, lastAccessed: new Date().toISOString() });
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}