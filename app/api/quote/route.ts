import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const name         = data.get('name');
    const company      = data.get('company');
    const project_type = data.get('project_type');
    const timeline     = data.get('timeline');
    const requirements = data.get('requirements');
    const file         = data.get('file') as File | null;

    if (!name || !company || !project_type || !timeline || !requirements) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: wire up email provider (Resend, SendGrid, etc.) and
    //       file storage (S3, Cloudinary, Vercel Blob, etc.)
    console.log('[Quote] New request:', {
      name,
      company,
      project_type,
      timeline,
      requirements,
      file: file?.name ?? 'none',
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
