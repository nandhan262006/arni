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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = Array.isArray(body) ? body : [body];

    for (const setting of settings) {
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
