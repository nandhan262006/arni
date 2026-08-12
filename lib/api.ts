import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function requireApiAuth(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function jsonError(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function isNotFoundError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "P2025"
  );
}
