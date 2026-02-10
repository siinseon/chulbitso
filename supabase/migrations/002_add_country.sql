-- 출판 국가 (ISO 3166-1 alpha-2: KR, US, JP 등)
ALTER TABLE books ADD COLUMN IF NOT EXISTS country TEXT;
