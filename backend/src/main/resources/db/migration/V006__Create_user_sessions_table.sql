CREATE SCHEMA IF NOT EXISTS auth;

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS auth.user_sessions (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                                    refresh_token VARCHAR(512) UNIQUE NOT NULL,
                                    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                                    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON auth.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token ON auth.user_sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON auth.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON auth.user_sessions(created_at);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
deleted_count INTEGER;
BEGIN
DELETE FROM auth.user_sessions
WHERE expires_at < CURRENT_TIMESTAMP;

GET DIAGNOSTICS deleted_count = ROW_COUNT;
RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE auth.user_sessions IS 'Active user sessions for JWT refresh token management';
COMMENT ON COLUMN auth.user_sessions.id IS 'Unique identifier for the session';
COMMENT ON COLUMN auth.user_sessions.user_id IS 'Reference to the user who owns this session';
COMMENT ON COLUMN auth.user_sessions.refresh_token IS 'JWT refresh token for session renewal';
COMMENT ON COLUMN auth.user_sessions.expires_at IS 'When this session expires';
COMMENT ON COLUMN auth.user_sessions.created_at IS 'When this session was created';
COMMENT ON FUNCTION cleanup_expired_sessions() IS 'Function to remove expired sessions - can be called by scheduled job';