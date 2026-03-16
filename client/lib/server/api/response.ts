import { NextResponse } from "next/server";

type SuccessMeta = {
  requestId?: string;
};

type ErrorMeta = SuccessMeta & {
  details?: unknown;
};

export function successResponse<T>(data: T, status = 200, meta?: SuccessMeta) {
  return NextResponse.json(
    {
      ok: true,
      data,
      meta: {
        requestId: meta?.requestId,
      },
    },
    { status }
  );
}

export function errorResponse(
  code: string,
  message: string,
  status = 500,
  meta?: ErrorMeta
) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        details: meta?.details,
      },
      meta: {
        requestId: meta?.requestId,
      },
    },
    { status }
  );
}
