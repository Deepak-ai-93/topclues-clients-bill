import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase';

// Secure invoice download: /invoice/{invoiceNumber-or-id}
// Redirects to a short-lived signed URL from Supabase Storage after verifying
// the session and document ownership.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL('/login', _req.url));
  }

  try {
    // Look up by UUID first, then by pdf_name / invoice number pattern
    let { data: docs, error } = await supabaseAdmin
      .from('billing_documents')
      .select('*')
      .limit(50);

    if (error || !docs) {
      return NextResponse.redirect(new URL('/client/invoices', _req.url));
    }

    const target = docs.find(d =>
      d.id === id ||
      d.pdf_name?.replace(/\.pdf$/, '').replace(/^invoice-/, '') === id ||
      d.title?.includes(id)
    );

    if (!target) {
      return NextResponse.redirect(new URL('/client/invoices', _req.url));
    }

    // Clients can only access their own invoices
    if (session.role === 'client' && target.client_id !== session.userId) {
      return NextResponse.redirect(new URL('/client/invoices', _req.url));
    }

    if (!target.pdf_url) {
      return NextResponse.redirect(new URL('/client/invoices', _req.url));
    }

    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from('billing-documents')
      .createSignedUrl(target.pdf_url, 300);

    if (signedError || !signedData?.signedUrl) {
      return NextResponse.redirect(new URL('/client/invoices', _req.url));
    }

    return NextResponse.redirect(signedData.signedUrl);
  } catch {
    return NextResponse.redirect(new URL('/client/invoices', _req.url));
  }
}
