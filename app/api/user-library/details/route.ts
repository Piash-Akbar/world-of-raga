// src/app/api/user-library/details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAll, getById } from '@/lib/dataStore';

export async function GET() {
  const library = getAll<Record<string, unknown>>('userLibrary').filter((item) => (item.userId as string) === 'demo-user');
  const compositions = getAll<Record<string, unknown>>('compositions');
  const masterclasses = getAll<Record<string, unknown>>('masterclasses');

  const enriched = library
    .map((lib) => {
      let content = null;
      const itemType = lib.itemType as string;
      const itemId = lib.itemId as string;

      if (itemType === 'composition') {
        content = compositions.find((c) => (c.id as string) === itemId) ?? null;
      } else if (itemType === 'masterclass') {
        content = masterclasses.find((m) => (m.id as string) === itemId) ?? null;
      }

      return { ...lib, content };
    })
    .filter((item) => item.content !== null);

  return NextResponse.json(enriched);
}