import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export async function GET() {
  try {
    const result = await db.select().from(siteSettings);
    const settingsMap: Record<string, string> = {};
    for (const s of result) {
      settingsMap[s.key] = s.value;
    }
    return NextResponse.json(settingsMap);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
