import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select().from(siteSettings);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

const ALLOWED_KEYS = new Set([
  "google_maps_embed",
  "contact_email",
  "contact_phone",
  "studio_address",
  "instagram_url",
  "facebook_url",
  "youtube_url",
  "site_title",
  "site_description",
]);

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = Array.isArray(body) ? body : [body];

    for (const setting of settings) {
      if (!setting || typeof setting.key !== "string" || typeof setting.value !== "string") continue;
      if (!ALLOWED_KEYS.has(setting.key)) continue;

      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, setting.key))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(siteSettings)
          .set({ value: setting.value })
          .where(eq(siteSettings.key, setting.key));
      } else {
        await db.insert(siteSettings).values(setting);
      }
    }

    const result = await db.select().from(siteSettings);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
