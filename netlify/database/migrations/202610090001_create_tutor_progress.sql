CREATE TABLE IF NOT EXISTS maths_tutor_progress (
  session_id UUID NOT NULL,
  storage_key TEXT NOT NULL,
  storage_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (session_id, storage_key)
);
CREATE INDEX IF NOT EXISTS maths_tutor_progress_updated_at ON maths_tutor_progress (updated_at);

CREATE TABLE IF NOT EXISTS maths_tutor_usage (
  usage_key TEXT PRIMARY KEY,
  requests INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL
);
