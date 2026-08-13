import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError, isNotFoundError } from "@/lib/api";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const existing = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const name = typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : existing.name;
    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? slugify(body.slug)
        : slugify(name);

    if (slug !== existing.slug) {
      const duplicate = await prisma.category.findUnique({
        where: { type_slug: { type: existing.type, slug } },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "A category with this slug already exists." },
          { status: 409 }
        );
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      if (slug !== existing.slug) {
        if (existing.type === "gallery") {
          await tx.galleryImage.updateMany({ where: { category: existing.slug }, data: { category: slug } });
        } else if (existing.type === "films") {
          await tx.film.updateMany({ where: { category: existing.slug }, data: { category: slug } });
        } else if (existing.type === "services") {
          await tx.service.updateMany({ where: { category: existing.slug }, data: { category: slug } });
        }
      }

      return tx.category.update({
        where: { id: existing.id },
        data: {
          name,
          slug,
          order: typeof body.order === "number" ? body.order : existing.order,
        },
      });
    });
    return NextResponse.json(result);
  } catch (err) {
    if (isNotFoundError(err)) return jsonError("Not found", 404);
    return jsonError("Failed to update category");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const { id } = await params;
    const existing = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const fallback = await prisma.category.findFirst({
      where: { type: existing.type, slug: { not: existing.slug } },
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    if (!fallback) {
      return NextResponse.json(
        { error: "Create another category before deleting the last one." },
        { status: 400 }
      );
    }
    const replacement = fallback.slug;
    await prisma.$transaction(async (tx) => {
      if (existing.type === "gallery") {
        await tx.galleryImage.updateMany({ where: { category: existing.slug }, data: { category: replacement } });
      } else if (existing.type === "films") {
        await tx.film.updateMany({ where: { category: existing.slug }, data: { category: replacement } });
      } else if (existing.type === "services") {
        await tx.service.updateMany({ where: { category: existing.slug }, data: { category: replacement } });
      }
      await tx.category.delete({ where: { id: existing.id } });
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isNotFoundError(err)) return jsonError("Not found", 404);
    return jsonError("Failed to delete category");
  }
}
