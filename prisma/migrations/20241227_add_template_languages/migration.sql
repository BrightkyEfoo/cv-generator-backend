-- Migration: Add Template Languages Support
-- This migration converts the single edgeCode field to a JSON edgeCodes field
-- and adds defaultLanguage and availableLanguages fields

-- Step 1: Add new columns to Template
ALTER TABLE "Template" ADD COLUMN "edgeCodes" JSONB;
ALTER TABLE "Template" ADD COLUMN "defaultLanguage" TEXT NOT NULL DEFAULT 'fr';
ALTER TABLE "Template" ADD COLUMN "availableLanguages" TEXT[] DEFAULT ARRAY['fr']::TEXT[];

-- Step 2: Migrate existing edgeCode data to edgeCodes JSON format
UPDATE "Template"
SET "edgeCodes" = jsonb_build_object('default', COALESCE("edgeCode", ''), 'fr', COALESCE("edgeCode", ''));

-- Step 3: Make edgeCodes non-nullable after migration
ALTER TABLE "Template" ALTER COLUMN "edgeCodes" SET NOT NULL;

-- Step 4: Drop the old edgeCode column
ALTER TABLE "Template" DROP COLUMN "edgeCode";

-- Step 5: Add templateLanguage to CV
ALTER TABLE "CV" ADD COLUMN "templateLanguage" TEXT NOT NULL DEFAULT 'fr';
