
CREATE SCHEMA IF NOT EXISTS app_users;
CREATE EXTENSION IF NOT EXISTS citext;

-- Create users table with String IDs
CREATE TABLE IF NOT EXISTS app_users.users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'EMPLOYEE',
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON app_users.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON app_users.users(role);
CREATE INDEX IF NOT EXISTS idx_users_enabled ON app_users.users(enabled);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON app_users.users(created_at);

-- constraint for role enum
-- ALTER TABLE app_users.users
--     ADD CONSTRAINT check_role
--         CHECK (role IN ('EMPLOYEE', 'ADMIN', 'MANAGER'));

-- Add comments for documentation
COMMENT ON TABLE app_users.users IS 'User accounts for authentication and authorization';
COMMENT ON COLUMN app_users.users.id IS 'Unique identifier for the user';
COMMENT ON COLUMN app_users.users.email IS 'User email address (used as username)';
COMMENT ON COLUMN app_users.users.first_name IS 'User first name';
COMMENT ON COLUMN app_users.users.last_name IS 'User last name';
COMMENT ON COLUMN app_users.users.password_hash IS 'Hashed password using BCrypt';
COMMENT ON COLUMN app_users.users.role IS 'User role (EMPLOYEE, ADMIN, MANAGER)';
COMMENT ON COLUMN app_users.users.enabled IS 'Whether the user account is active';
COMMENT ON COLUMN app_users.users.created_at IS 'Timestamp when the user was created';

