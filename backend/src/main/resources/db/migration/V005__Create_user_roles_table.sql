CREATE SCHEMA IF NOT EXISTS auth;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS auth.user_roles (
                                 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                 name VARCHAR(50) UNIQUE NOT NULL,
                                 description TEXT,
                                 permissions JSONB,
                                 created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_name ON auth.user_roles(name);
CREATE INDEX IF NOT EXISTS idx_user_roles_created_at ON auth.user_roles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_roles_permissions ON auth.user_roles USING GIN(permissions);

-- Insert default roles
INSERT INTO auth.user_roles (id, name, description, permissions) VALUES
                                                                 (gen_random_uuid(),'ADMIN', 'System administrator with full access', '["USER_MANAGEMENT", "ROLE_MANAGEMENT", "SYSTEM_CONFIG", "REPORTS", "AUDIT"]'),
                                                                 (gen_random_uuid(),'MANAGER', 'Department manager with employee oversight', '["EMPLOYEE_MANAGEMENT", "TIME_APPROVAL", "REPORTS", "DEPARTMENT_VIEW"]'),
                                                                 (gen_random_uuid(),'EMPLOYEE', 'Standard employee with basic access', '["TIME_TRACKING", "PROFILE_VIEW", "ABSENCE_REQUEST"]');

-- Add comments for documentation
COMMENT ON TABLE auth.user_roles IS 'User roles for role-based access control';
COMMENT ON COLUMN auth.user_roles.id IS 'Unique identifier for the role';
COMMENT ON COLUMN auth.user_roles.name IS 'Unique role name (e.g., ADMIN, MANAGER, EMPLOYEE)';
COMMENT ON COLUMN auth.user_roles.description IS 'Human-readable description of the role';
COMMENT ON COLUMN auth.user_roles.permissions IS 'JSON array of permissions associated with this role';
COMMENT ON COLUMN auth.user_roles.created_at IS 'Timestamp when the role was created';
