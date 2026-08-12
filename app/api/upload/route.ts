import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api";
import { publicKeyToUrl, createPresignedUploadUrl } from "@/lib/r2";

const ALLOWED_TYPES: Record<"image" | "video", string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/heic", "image/heif"],
  video: ["video/mp4", "video/webm", "video/quicktime", "video/mov", "video/ogg"],
};

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/mov": "mov",
  "video/ogg": "ogg",
};

function getExtension(filename: string | undefined, contentType: string): string {
  const fromName = filename?.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  return EXT_BY_MIME[contentType] ?? "";
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const body = await request.json();
    const kind = body.kind === "video" ? "video" : "image";
    const contentType =
      typeof body.contentType === "string" ? body.contentType.toLowerCase() : "";
    const filename = typeof body.filename === "string" ? body.filename : "";

    if (!ALLOWED_TYPES[kind].includes(contentType)) {
      return NextResponse.json(
        { error: `Invalid content type. Allowed ${kind} types: ${ALLOWED_TYPES[kind].join(", ")}` },
        { status: 400 }
      );
    }

    const extension = getExtension(filename, contentType);
    const key = `arni/${kind === "video" ? "films" : "gallery"}/${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;

    const uploadUrl = await createPresignedUploadUrl({ key, contentType });
    const publicUrl = publicKeyToUrl(key);

    return NextResponse.json({ key, uploadUrl, publicUrl });
  } catch (err) {
    const message =
      err instanceof Error && err.message
        ? err.message
        : "Failed to create upload URL";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
