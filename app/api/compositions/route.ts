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
    // Debug: log incoming form fields and file info to help trace failures
    try {
      const keys: string[] = [];
      for (const entry of formData.entries()) {
        // collect keys only (values may be large binaries)
        keys.push(String(entry[0]));
      }
      console.log('Incoming composition POST fields:', Array.from(new Set(keys)).join(', '));
    } catch (e) {
      console.warn('Failed to enumerate formData keys for debug', e);
    }
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
      console.log(`Video file present: name=${videoFile.name} size=${(videoFile.size/1024/1024).toFixed(2)}MB type=${videoFile.type}`);
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
      console.log(`PDF file present: name=${pdfFile.name} size=${(pdfFile.size/1024/1024).toFixed(2)}MB type=${pdfFile.type}`);
      try {
        const buffer = Buffer.from(await pdfFile.arrayBuffer());
        console.log(`Starting PDF upload: name=${pdfFile.name} size=${(pdfFile.size / 1024 / 1024).toFixed(2)}MB`);
        const pdfResult = await uploadRaw(buffer, 'compositions');
        if (pdfResult && pdfResult.secure_url) {
          console.log('PDF upload succeeded:', pdfResult.public_id || pdfResult.secure_url);
          pdfUrl = pdfResult.secure_url;
        } else {
          console.error('PDF upload returned no secure_url, result:', pdfResult);
          pdfUrl = '';
        }
      } catch (pdfError) {
        console.error('PDF upload failed; continuing without PDF attachment. Error:', pdfError?.stack || pdfError);
        pdfUrl = '';
      }
    }

    // Generate preview from video URL (Cloudinary can generate thumbnail)
    if (videoUrl) {
      // Extract public ID and generate preview URL
      // For simplicity, we'll store the video URL as preview as well.
      previewVideoUrl = videoUrl;
    }

    let newItem;
    try {
      newItem = createItem('compositions', {
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
      console.log('Composition created:', newItem?.id);
    } catch (writeErr) {
      console.error('Failed to create composition item:', writeErr);
      throw writeErr;
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Composition upload failed:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

