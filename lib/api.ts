import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiResponse<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        fieldErrors?: Record<string, string[]>;
      };
    };

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data }, init);
}

export function fail(
  code: string,
  message: string,
  status = 400,
  fieldErrors?: Record<string, string[]>
) {
  return NextResponse.json<ApiResponse<never>>(
    { success: false, error: { code, message, fieldErrors } },
    { status }
  );
}

export function validationError(error: ZodError) {
  const fieldErrors = Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).filter((entry): entry is [string, string[]] =>
      Array.isArray(entry[1])
    )
  );
  return fail("VALIDATION_ERROR", "Please check the highlighted fields.", 422, fieldErrors);
}

export async function parseJson<T>(request: Request, schema: { parse: (value: unknown) => T }) {
  const payload = await request.json().catch(() => null);
  return schema.parse(payload);
}
