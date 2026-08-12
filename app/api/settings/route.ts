import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError } from "@/lib/api";

export async function GET() {
  try {
    const result = await prisma.siteSetting.findMany();
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch settings");
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
  "hero_title",
  "hero_subtitle",
  "about_text",
  "about_tagline",
  "address",
  "phone",
  "email",
  "seo_title",
  "seo_description",
]);

export async function PUT(request: NextRequest) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const body = await request.json();
    const settings = Array.isArray(body) ? body : [body];

    for (const setting of settings) {
      if (!setting || typeof setting.key !== "string" || typeof setting.value !== "string") continue;
      if (!ALLOWED_KEYS.has(setting.key)) continue;

      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      });
    }

    const result = await prisma.siteSetting.findMany();
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to update settings");
  }
}
