// apps/web/src/app/api/revalidate/route.ts

import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Check secret
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { message: 'No slug provided' },
        { status: 400 },
      );
    }

    // Revalidate the case study page
    revalidatePath(`/work/${slug}`);

    // Optional: also revalidate the work listing page
    revalidatePath('/work');

    return NextResponse.json({
      revalidated: true,
      slug,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 },
    );
  }
}
