
CREATE SCHEMA IF NOT EXISTS app_timetrack;

-- Create absences table with String IDs
CREATE TABLE IF NOT EXISTS app_timetrack.absences (
                                                  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    employee_id VARCHAR(36) NOT NULL REFERENCES app_personnel.employees(id) ON DELETE CASCADE,
    absence_type_id VARCHAR(36) NOT NULL REFERENCES app_timetrack.absence_types(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reason TEXT,
    rejection_reason TEXT,
    approved_by VARCHAR(36) REFERENCES app_personnel.employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Add constraints
ALTER TABLE app_timetrack.absences
    ADD CONSTRAINT check_absence_status
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'));

ALTER TABLE app_timetrack.absences
    ADD CONSTRAINT check_absence_dates
        CHECK (end_date >= start_date);

ALTER TABLE app_timetrack.absences
    ADD CONSTRAINT check_absence_times
        CHECK ((start_time IS NULL AND end_time IS NULL) OR
               (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_absences_employee_id ON app_timetrack.absences(employee_id);
CREATE INDEX IF NOT EXISTS idx_absences_absence_type_id ON app_timetrack.absences(absence_type_id);
-- CREATE INDEX IF NOT EXISTS idx_absences_approved_by ON app_timetrack.absences(approved_by);
CREATE INDEX IF NOT EXISTS idx_absences_status ON app_timetrack.absences(status);
CREATE INDEX IF NOT EXISTS idx_absences_start_date ON app_timetrack.absences(start_date);
CREATE INDEX IF NOT EXISTS idx_absences_end_date ON app_timetrack.absences(end_date);
-- CREATE INDEX IF NOT EXISTS idx_absences_approved_by ON app_timetrack.absences(approved_by);
CREATE INDEX IF NOT EXISTS idx_absences_created_at ON app_timetrack.absences(created_at);
-- CREATE INDEX IF NOT EXISTS idx_absences_date_range ON app_timetrack.absences(start_date, end_date);

-- Drop trigger if exists before creating
DROP TRIGGER IF EXISTS update_absences_updated_at ON app_timetrack.absences;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_absences_updated_at
    BEFORE UPDATE ON app_timetrack.absences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE app_timetrack.absences IS 'Employee absence requests and records';
COMMENT ON COLUMN app_timetrack.absences.id IS 'Unique identifier for the absence';
COMMENT ON COLUMN app_timetrack.absences.employee_id IS 'Reference to the employee taking absence';
COMMENT ON COLUMN app_timetrack.absences.absence_type_id IS 'Reference to the type of absence (vacation, sick, etc.)';
COMMENT ON COLUMN app_timetrack.absences.start_date IS 'Start date of the absence';
COMMENT ON COLUMN app_timetrack.absences.end_date IS 'End date of the absence';
COMMENT ON COLUMN app_timetrack.absences.start_time IS 'Start time for partial day absences';
COMMENT ON COLUMN app_timetrack.absences.end_time IS 'End time for partial day absences';
COMMENT ON COLUMN app_timetrack.absences.status IS 'Current status of the absence request';
COMMENT ON COLUMN app_timetrack.absences.reason IS 'Reason provided by employee for the absence';
COMMENT ON COLUMN app_timetrack.absences.rejection_reason IS 'Reason for rejection if status is REJECTED';
COMMENT ON COLUMN app_timetrack.absences.approved_by IS 'Employee who approved/rejected the absence';
COMMENT ON COLUMN app_timetrack.absences.approved_at IS 'Timestamp when the absence was approved/rejected';
COMMENT ON COLUMN app_timetrack.absences.created_at IS 'Timestamp when the absence was created';
COMMENT ON COLUMN app_timetrack.absences.updated_at IS 'Timestamp when the absence was last updated';


