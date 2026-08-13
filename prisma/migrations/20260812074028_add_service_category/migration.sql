-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_services" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'camera',
    "image_url" TEXT,
    "category" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_services" ("description", "icon", "id", "image_url", "order", "slug", "title") SELECT "description", "icon", "id", "image_url", "order", "slug", "title" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
