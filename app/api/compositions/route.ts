import { NextRequest, NextResponse } from 'next/server';
import { getAll, createItem } from '@/lib/dataStore';
import { uploadVideo, uploadLargeVideo, uploadRaw, getVideoThumbnail } from '@/lib/cloudinary';

export const runtime = 'nodejs';

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024 * 1024;

export async function GET() {
  const items = getAll('compositions');
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const level = formData.get('level') as string;
    const price = parseFloat(formData.get('price') as string) || 0;
    const duration = parseInt(formData.get('duration') as string) || 0;
    const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()) || [];
    const videoFile = formData.get('video') as File | null;
    const pdfFile = formData.get('pdf') as File | null;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let videoUrl = '';
    let pdfUrl = '';
    let previewVideoUrl = '';
    let thumbnailUrl = '';

    if (videoFile && videoFile.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Video is too large. Please upload a file smaller than ${(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024 * 1024)).toFixed(0)}GB.` },
        { status: 413 }
      );
    }

    if (pdfFile && pdfFile.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { error: `PDF is too large. Please upload a file smaller than ${(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024 * 1024)).toFixed(0)}GB.` },
        { status: 413 }
      );
    }


    // let videoUrl = '';
    if (videoFile) {
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      let uploadResult;
      if (videoFile.size > 100 * 1024 * 1024) {
        uploadResult = await uploadLargeVideo(buffer, 'compositions');
      } else {
        uploadResult = await uploadVideo(buffer, 'compositions');
      }
      videoUrl = uploadResult.secure_url;
      previewVideoUrl = uploadResult.secure_url;
      thumbnailUrl = getVideoThumbnail(uploadResult.public_id);
    }

    if (pdfFile) {
      try {
        const buffer = Buffer.from(await pdfFile.arrayBuffer());
        const pdfResult = await uploadRaw(buffer, 'compositions');
        pdfUrl = pdfResult.secure_url;
      } catch (pdfError) {
        console.warn('PDF upload failed; continuing without PDF attachment.', pdfError);
        pdfUrl = '';
      }
    }

    // Generate preview from video URL (Cloudinary can generate thumbnail)
    if (videoUrl) {
      // Extract public ID and generate preview URL
      // For simplicity, we'll store the video URL as preview as well.
      previewVideoUrl = videoUrl;
    }

    const newItem = createItem('compositions', {
      title,
      description,
      level,
      price,
      duration,
      videoUrl,
      pdfUrl,
      previewVideoUrl,
      thumbnailUrl,
      tags,
      isPublished: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Composition upload failed:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

