import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const idempotencyKey = request.headers.get('Idempotency-Key');
    if (!idempotencyKey || !idempotencyKey.trim()) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid Idempotency-Key header', data: null, errorCode: 'MISSING_IDEMPOTENCY_KEY' },
        { status: 400 }
      );
    }

    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Accepted',
      data: null,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON request body', data: null, errorCode: 'INVALID_JSON' },
      { status: 400 }
    );
  }
}

