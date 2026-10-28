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
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          data: null,
          errorCode: 'VALIDATION_FAILED',
          validationErrors: [
            ...(!body.email ? [{ field: 'email', message: 'Email or phone is required' }] : []),
            ...(!body.password ? [{ field: 'password', message: 'Password is required' }] : []),
          ],
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Accepted',
      data: {
        email: body.email,
        role: body.role ?? 'admin',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON request body', data: null, errorCode: 'INVALID_JSON' },
      { status: 400 }
    );
  }
}

