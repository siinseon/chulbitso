-- 소유 형태: OWNED(쌓인책), PASSED(스친책), EBOOK(빛으로 쓴 책)
-- 독서 상태: READING(펼침), FINISHED(끝냄), EXCERPT(추림), PAUSED(멈춤), WISH(아낌)
CREATE TYPE ownership_type AS ENUM ('OWNED', 'PASSED', 'EBOOK');
CREATE TYPE reading_status AS ENUM ('READING', 'FINISHED', 'EXCERPT', 'PAUSED', 'WISH');

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT,
  pub_date TEXT,
  cover TEXT,
  description TEXT,
  isbn TEXT,
  category TEXT,
  series TEXT,
  retail_price INTEGER DEFAULT 0,
  ownership_type ownership_type NOT NULL DEFAULT 'OWNED',
  reading_status reading_status NOT NULL DEFAULT 'WISH'
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_books_ownership_type ON books(ownership_type);
CREATE INDEX IF NOT EXISTS idx_books_reading_status ON books(reading_status);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
