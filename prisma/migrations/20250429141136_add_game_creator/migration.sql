/*
  Warnings:

  - Added the required column `creatorId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Get or create an admin user
INSERT OR IGNORE INTO "User" (id, name, email, password, "createdAt", "updatedAt")
SELECT 
    'admin',
    'Admin',
    'admin@example.com',
    'password',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "User" LIMIT 1);

-- Create new Game table with the creator column
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Game_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy existing data
INSERT INTO "new_Game" ("id", "title", "description", "imageUrl", "rating", "createdAt", "updatedAt", "creatorId")
SELECT "id", "title", "description", "imageUrl", "rating", "createdAt", "updatedAt",
    (SELECT id FROM "User" ORDER BY "createdAt" LIMIT 1) as "creatorId"
FROM "Game";

-- Drop the old table
DROP TABLE "Game";

-- Rename the new table to the old name
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTable
CREATE TABLE "_GameCreator" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GameCreator_A_fkey" FOREIGN KEY ("A") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GameCreator_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameCreator_AB_unique" ON "_GameCreator"("A", "B");

-- CreateIndex
CREATE INDEX "_GameCreator_B_index" ON "_GameCreator"("B");
