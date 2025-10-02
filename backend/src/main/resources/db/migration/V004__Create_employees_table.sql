CREATE SCHEMA IF NOT EXISTS app_personnel;

-- Create employees table with String IDs
CREATE TABLE IF NOT EXISTS app_personnel.employees (
                                                   id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) UNIQUE REFERENCES app_users.users(id) ON DELETE SET NULL,
    employee_number VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON app_personnel.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_employee_number ON app_personnel.employees(employee_number);
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON app_personnel.employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON app_personnel.employees(created_at);
CREATE INDEX IF NOT EXISTS idx_employees_full_name ON app_personnel.employees(first_name, last_name);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists before creating
DROP TRIGGER IF EXISTS update_employees_updated_at ON app_personnel.employees;

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON app_personnel.employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE app_personnel.employees IS 'Employee records linked to user accounts';
COMMENT ON COLUMN app_personnel.employees.id IS 'Unique identifier for the employee';
COMMENT ON COLUMN app_personnel.employees.user_id IS 'Reference to the user account (nullable for employees without system access)';
COMMENT ON COLUMN app_personnel.employees.employee_number IS 'Unique employee identifier/badge number';
COMMENT ON COLUMN app_personnel.employees.first_name IS 'Employee first name';
COMMENT ON COLUMN app_personnel.employees.last_name IS 'Employee last name';
COMMENT ON COLUMN app_personnel.employees.is_active IS 'Whether the employee is currently active';
COMMENT ON COLUMN app_personnel.employees.created_at IS 'Timestamp when the employee record was created';
COMMENT ON COLUMN app_personnel.employees.updated_at IS 'Timestamp when the employee record was last updated';

