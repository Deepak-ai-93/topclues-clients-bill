import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  const { fileName } = await params;
  
  // Extract invoice number from fileName like invoice-INV-2026-001.pdf or INV-2026-001
  let invId = fileName.replace('.pdf', '');
  if (invId.startsWith('invoice-')) {
    invId = invId.substring(8);
  }

  // Redirect to the interactive beautiful invoice page
  const url = req.nextUrl.clone();
  url.pathname = `/invoice/${invId}`;
  return NextResponse.redirect(url);
}
