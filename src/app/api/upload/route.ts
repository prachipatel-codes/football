import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { cloudinary, validateImageUpload } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    validateImageUpload(file.type, file.size);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'offside/payments', resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
        (err, res) => err ? reject(err) : resolve(res)
      );
      stream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}
