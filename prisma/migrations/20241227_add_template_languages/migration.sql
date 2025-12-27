-- Migration: Add Template Languages Support
-- This migration converts the single edgeCode field to a JSON edgeCodes field
-- and adds defaultLanguage and availableLanguages fields

-- Step 1: Add new columns to Template with defaults
ALTER TABLE "Template" ADD COLUMN IF NOT EXISTS "edgeCodes" JSONB DEFAULT '{}';
ALTER TABLE "Template" ADD COLUMN IF NOT EXISTS "defaultLanguage" TEXT NOT NULL DEFAULT 'fr';
ALTER TABLE "Template" ADD COLUMN IF NOT EXISTS "availableLanguages" TEXT[] DEFAULT ARRAY['fr']::TEXT[];

-- Step 2: Migrate existing edgeCode data to edgeCodes JSON format (if edgeCode column exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Template' AND column_name = 'edgeCode') THEN
        UPDATE "Template"
        SET "edgeCodes" = jsonb_build_object('default', COALESCE("edgeCode", ''), 'fr', COALESCE("edgeCode", ''))
        WHERE "edgeCodes" = '{}' OR "edgeCodes" IS NULL;

        -- Drop the old edgeCode column
        ALTER TABLE "Template" DROP COLUMN "edgeCode";
    END IF;
END $$;

-- Step 3: Ensure edgeCodes has a default for existing rows with empty JSON
UPDATE "Template"
SET "edgeCodes" = '{"default": "", "fr": ""}'
WHERE "edgeCodes" = '{}' OR "edgeCodes" IS NULL;

-- Step 4: Add templateLanguage to CV
ALTER TABLE "CV" ADD COLUMN IF NOT EXISTS "templateLanguage" TEXT NOT NULL DEFAULT 'fr';
