import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, service, details } = body;

    if (!name || !company || !email || !service || !details) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: wire up email provider (Resend, SendGrid, Nodemailer, etc.)
    // Example: await sendEmail({ to: 'info@betavolt.com', ...body });

    console.log('[Contact] New inquiry:', { name, company, email, service });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
