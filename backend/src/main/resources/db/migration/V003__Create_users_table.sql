CREATE SCHEMA IF NOT EXISTS auth;

CREATE EXTENSION IF NOT EXISTS citext;

-- CREATE TYPE user_role AS ENUM ('EMPLOYEE', 'ADMIN', 'MANAGER');

-- Create users table
CREATE TABLE IF NOT EXISTS auth.users (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            email VARCHAR(255) UNIQUE NOT NULL,
                            first_name VARCHAR(255) NOT NULL,
                            last_name VARCHAR(255) NOT NULL,
                            password_hash VARCHAR(255) NOT NULL,
                            role VARCHAR(255) NOT NULL DEFAULT 'EMPLOYEE',
                            enabled BOOLEAN NOT NULL DEFAULT true,
                            created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- constraint for role enum
-- ALTER TABLE auth.users
--     ADD CONSTRAINT check_role
--         CHECK (role IN ('EMPLOYEE', 'ADMIN', 'MANAGER'));

-- indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON auth.users(role);
CREATE INDEX IF NOT EXISTS idx_users_enabled ON auth.users(enabled);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON auth.users(created_at);

-- Add comments for documentation
COMMENT ON TABLE auth.users IS 'User accounts for authentication and authorization';
COMMENT ON COLUMN auth.users.id IS 'Unique identifier for the user';
COMMENT ON COLUMN auth.users.email IS 'User email address (used as username)';
COMMENT ON COLUMN auth.users.first_name IS 'User first name';
COMMENT ON COLUMN auth.users.last_name IS 'User last name';
COMMENT ON COLUMN auth.users.password_hash IS 'Hashed password using BCrypt';
COMMENT ON COLUMN auth.users.role IS 'User role (EMPLOYEE, ADMIN, MANAGER)';
COMMENT ON COLUMN auth.users.enabled IS 'Whether the user account is active';
COMMENT ON COLUMN auth.users.created_at IS 'Timestamp when the user was created';

