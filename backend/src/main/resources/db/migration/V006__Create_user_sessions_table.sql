CREATE SCHEMA IF NOT EXISTS app_users;

-- Create user_sessions table with String IDs
CREATE TABLE IF NOT EXISTS app_users.user_sessions (
                                                  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES app_users.users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(512) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON app_users.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token ON app_users.user_sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON app_users.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON app_users.user_sessions(created_at);

-- Cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
deleted_count INTEGER;
BEGIN
DELETE FROM app_users.user_sessions WHERE expires_at < CURRENT_TIMESTAMP;
GET DIAGNOSTICS deleted_count = ROW_COUNT;
RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE app_users.user_sessions IS 'Active user sessions for JWT refresh token management';
COMMENT ON COLUMN app_users.user_sessions.id IS 'Unique identifier for the session';
COMMENT ON COLUMN app_users.user_sessions.user_id IS 'Reference to the user who owns this session';
COMMENT ON COLUMN app_users.user_sessions.refresh_token IS 'JWT refresh token for session renewal';
COMMENT ON COLUMN app_users.user_sessions.expires_at IS 'When this session expires';
COMMENT ON COLUMN app_users.user_sessions.created_at IS 'When this session was created';
COMMENT ON FUNCTION cleanup_expired_sessions() IS 'Function to remove expired sessions - can be called by scheduled job';