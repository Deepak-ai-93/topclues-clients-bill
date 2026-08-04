-- Link profiles to their commercial package and store key professional info
-- used by the client portal. packages() already exists at this point.
ALTER TABLE profiles
  ADD COLUMN package_id UUID REFERENCES packages(id),
  ADD COLUMN clinic_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN specialization TEXT NOT NULL DEFAULT '';