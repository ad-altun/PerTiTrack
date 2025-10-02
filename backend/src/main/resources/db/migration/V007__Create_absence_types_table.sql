
CREATE SCHEMA IF NOT EXISTS app_timetrack;

-- Create absence_types table with String IDs
CREATE TABLE IF NOT EXISTS app_timetrack.absence_types (
                                                       id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    requires_approval BOOLEAN NOT NULL DEFAULT false,
    affects_vacation_balance BOOLEAN NOT NULL DEFAULT false,
    is_paid BOOLEAN NOT NULL DEFAULT true,
    color_code VARCHAR(7),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Add constraints
ALTER TABLE app_timetrack.absence_types
    ADD CONSTRAINT check_color_code_format
        CHECK (color_code IS NULL OR color_code ~ '^#[0-9A-Fa-f]{6}$');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_absence_types_code ON app_timetrack.absence_types (code);
CREATE INDEX IF NOT EXISTS idx_absence_types_name ON app_timetrack.absence_types (name);
CREATE INDEX IF NOT EXISTS idx_absence_types_is_active ON app_timetrack.absence_types (is_active);

-- -- Create indexes for better performance
-- CREATE INDEX IF NOT EXISTS idx_absence_types_requires_approval ON app_timetrack.absence_types (requires_approval);
-- CREATE INDEX IF NOT EXISTS idx_absence_types_created_at ON app_timetrack.absence_types (created_at);

-- Insert default absence types
INSERT INTO app_timetrack.absence_types (id, name, code, description, requires_approval, affects_vacation_balance, is_paid,
                                     color_code)
VALUES (gen_random_uuid(),'Vacation', 'VAC', 'Annual vacation leave', true, true, true, '#4CAF50'),
       (gen_random_uuid(),'Sick Leave', 'SICK', 'Medical leave for illness', false, false, true, '#F44336'),
       (gen_random_uuid(),'Personal Day', 'PERS', 'Personal time off', true, true, true, '#2196F3'),
       (gen_random_uuid(),'Maternity Leave', 'MAT', 'Maternity/Paternity leave', true, false, true, '#E91E63'),
       (gen_random_uuid(),'Bereavement', 'BER', 'Bereavement leave', true, false, true, '#9C27B0'),
       (gen_random_uuid(),'Training', 'TRN', 'Training and development', false, false, true, '#FF9800'),
       (gen_random_uuid(),'Unpaid Leave', 'UNP', 'Unpaid time off', true, false, false, '#757575'),
       (gen_random_uuid(),'Compensatory Time', 'COMP', 'Compensatory time off', false, false, true, '#795548'),
       (gen_random_uuid(),'Jury Duty', 'JURY', 'Jury duty service', false, false, true, '#607D8B');

-- Add comments for documentation
COMMENT
ON TABLE app_timetrack.absence_types IS 'Types of absences available for employee requests';
COMMENT
ON COLUMN app_timetrack.absence_types.id IS 'Unique identifier for the absence type';
COMMENT
ON COLUMN app_timetrack.absence_types.name IS 'Display name of the absence type';
COMMENT
ON COLUMN app_timetrack.absence_types.code IS 'Unique short code for the absence type';
COMMENT
ON COLUMN app_timetrack.absence_types.description IS 'Detailed description of when this absence type applies';
COMMENT
ON COLUMN app_timetrack.absence_types.requires_approval IS 'Whether this absence type requires manager approval';
COMMENT
ON COLUMN app_timetrack.absence_types.affects_vacation_balance IS 'Whether this absence counts against vacation balance';
COMMENT
ON COLUMN app_timetrack.absence_types.is_paid IS 'Whether this absence type is paid time off';
COMMENT
ON COLUMN app_timetrack.absence_types.color_code IS 'Hex color code for UI display (e.g., #FF0000)';
COMMENT
ON COLUMN app_timetrack.absence_types.is_active IS 'Whether this absence type is currently available for use';
COMMENT
ON COLUMN app_timetrack.absence_types.created_at IS 'Timestamp when the absence type was created';
