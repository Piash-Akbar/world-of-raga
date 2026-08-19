import { NextRequest, NextResponse } from 'next/server';
import { uploadVideo, uploadLargeVideo } from '@/lib/cloudinary';

// Node.js runtime is required for file system and buffer operations
export const runtime = 'nodejs';
// Increase timeout for large uploads (Vercel hobby: 10s, pro: 15min)
export const maxDuration = 300; // 5 minutes

const MAX_5GB = 5 * 1024 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('video') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_5GB) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 ** 3).toFixed(2)} GB). Max 5GB.`,
        },
        { status: 413 }
      );
    }

    console.log(`Uploading ${file.name} (${(file.size / 1024 ** 2).toFixed(2)} MB) to ${folder}`);

    const buffer = Buffer.from(await file.arrayBuffer());

    // Choose upload method based on file size
    let result;
    if (file.size > 100 * 1024 * 1024) {
      // Use chunked upload for large files
      result = await uploadLargeVideo(buffer, folder);
      console.log('Chunked upload completed');
    } else {
      // Regular upload for small files
      result = await uploadVideo(buffer, folder);
      console.log('Regular upload completed');
    }

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      duration: result.duration || 0,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Optional: Handle OPTIONS for CORS preflight (though Next.js handles this)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}