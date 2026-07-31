import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { requireAuth } from "@/lib/auth";
import { getCloudinaryConfig } from "@/lib/env";

export async function POST() {
  try {
    await requireAuth();

    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "arni-photography",
      },
      apiSecret
    );

    return NextResponse.json({
      timestamp,
      signature,
      cloudName,
      apiKey,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate signature";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
