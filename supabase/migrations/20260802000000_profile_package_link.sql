-- Link profiles to their commercial package and store key professional info
-- used by the client portal. packages() already exists at this point.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES packages(id),
  ADD COLUMN IF NOT EXISTS clinic_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS specialization TEXT NOT NULL DEFAULT '';