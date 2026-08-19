import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const folder = body.folder || 'compositions';
    const eager_async = body.eager_async ?? true;

    const timestamp = Math.round(Date.now() / 1000);

    // Sign timestamp, folder and eager_async to allow direct browser uploads
    // @ts-expect-error – cloudinary typings may not expose utils in older versions
    const signature = cloudinary.utils.api_sign_request({ timestamp, folder, eager_async }, process.env.CLOUDINARY_API_SECRET || '');

    return NextResponse.json({
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      timestamp,
      signature,
      folder,
    });
  } catch (error) {
    console.error('Sign upload failed', error);
    return NextResponse.json({ error: 'Failed to sign upload' }, { status: 500 });
  }
}
