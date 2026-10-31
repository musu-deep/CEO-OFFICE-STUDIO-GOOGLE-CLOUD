-- Empty production schema. No demo accounts or operational data.
CREATE TABLE app_revision (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  version INTEGER NOT NULL DEFAULT 0
);
INSERT INTO app_revision (id, version) VALUES (1, 0);

CREATE TABLE app_records (
  kind TEXT NOT NULL,
  id TEXT NOT NULL,
  value TEXT NOT NULL CHECK (json_valid(value)),
  PRIMARY KEY (kind, id)
);

CREATE TABLE auth_rate_limits (
  key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX auth_rate_limits_expiry ON auth_rate_limits(expires_at);
