CREATE SCHEMA IF NOT EXISTS timetrack;

-- Create time_records table with String IDs
CREATE TABLE IF NOT EXISTS timetrack.time_records (
                                                      id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    employee_id VARCHAR(36) NOT NULL REFERENCES personnel.employees(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    record_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    record_type VARCHAR(20) NOT NULL,
    location_type VARCHAR(20) NOT NULL DEFAULT 'OFFICE',
    notes TEXT,
    is_manual BOOLEAN NOT NULL DEFAULT false,
    approved_by VARCHAR(36) REFERENCES personnel.employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Add constraints
ALTER TABLE timetrack.time_records
    ADD CONSTRAINT check_record_type
        CHECK (record_type IN ('CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END'));

ALTER TABLE timetrack.time_records
    ADD CONSTRAINT check_location_type
        CHECK (location_type IN ('OFFICE', 'HOME', 'BUSINESS_TRIP', 'CLIENT_SITE'));

ALTER TABLE timetrack.time_records
    ADD CONSTRAINT check_record_date_not_future
        CHECK (record_date <= CURRENT_DATE);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_time_records_employee_id ON timetrack.time_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_records_record_date ON timetrack.time_records(record_date);
CREATE INDEX IF NOT EXISTS idx_time_records_record_time ON timetrack.time_records(record_time);
CREATE INDEX IF NOT EXISTS idx_time_records_record_type ON timetrack.time_records(record_type);
CREATE INDEX IF NOT EXISTS idx_time_records_location_type ON timetrack.time_records(location_type);
CREATE INDEX IF NOT EXISTS idx_time_records_is_manual ON timetrack.time_records(is_manual);
CREATE INDEX IF NOT EXISTS idx_time_records_approved_by ON timetrack.time_records(approved_by);
CREATE INDEX IF NOT EXISTS idx_time_records_created_at ON timetrack.time_records(created_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_time_records_employee_date ON timetrack.time_records(employee_id, record_date);
CREATE INDEX IF NOT EXISTS idx_time_records_employee_type ON timetrack.time_records(employee_id, record_type);
CREATE INDEX IF NOT EXISTS idx_time_records_date_type ON timetrack.time_records(record_date, record_type);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_time_records_updated_at
    BEFORE UPDATE ON timetrack.time_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- (validation check will be implemented in the service layer)
-- Create function to validate time record sequences
-- CREATE
-- OR REPLACE FUNCTION validate_time_record_sequence()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     -- Prevent duplicate CLOCK_IN without CLOCK_OUT
--     IF
-- NEW.record_type = 'CLOCK_IN' THEN
--         IF EXISTS (
--             SELECT 1 FROM timetrack.time_records tr1
--             WHERE tr1.employee_id = NEW.employee_id
--             AND tr1.record_date = NEW.record_date
--             AND tr1.record_type = 'CLOCK_IN'
--             AND tr1.id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
--             AND NOT EXISTS (
--                 SELECT 1 FROM timetrack.time_records tr2
--                 WHERE tr2.employee_id = NEW.employee_id
--                 AND tr2.record_date = NEW.record_date
--                 AND tr2.record_type = 'CLOCK_OUT'
--                 AND tr2.record_time > tr1.record_time
--             )
--         ) THEN
--             RAISE EXCEPTION 'Cannot clock in - employee already clocked in without clocking out';
-- END IF;
-- END IF;
--
-- RETURN NEW;
-- END;
-- $$
-- LANGUAGE plpgsql;

-- (validation check will be implemented in the service layer)
-- (database trigger is not needed any more)
-- Create trigger for time record validation
-- CREATE TRIGGER validate_time_record_sequence_trigger
--     BEFORE INSERT OR
-- UPDATE ON timetrack.time_records
--     FOR EACH ROW
--     EXECUTE FUNCTION validate_time_record_sequence();

-- Add comments for documentation
COMMENT
ON TABLE timetrack.time_records IS 'Employee time tracking records (clock in/out, breaks)';
COMMENT
ON COLUMN timetrack.time_records.id IS 'Unique identifier for the time record';
COMMENT
ON COLUMN timetrack.time_records.employee_id IS 'Reference to the employee who created this record';
COMMENT
ON COLUMN timetrack.time_records.record_date IS 'Date of the time record';
COMMENT
ON COLUMN timetrack.time_records.record_time IS 'Exact timestamp of the time record';
COMMENT
ON COLUMN timetrack.time_records.record_type IS 'Type of time record (CLOCK_IN, CLOCK_OUT, BREAK_START, BREAK_END)';
COMMENT
ON COLUMN timetrack.time_records.location_type IS 'Location where the time was recorded';
COMMENT
ON COLUMN timetrack.time_records.notes IS 'Optional notes about the time record';
COMMENT
ON COLUMN timetrack.time_records.is_manual IS 'Whether this record was manually entered (true) or system generated (false)';
COMMENT
ON COLUMN timetrack.time_records.approved_by IS 'Employee who approved this time record (if required)';
COMMENT
ON COLUMN timetrack.time_records.approved_at IS 'Timestamp when the time record was approved';
COMMENT
ON COLUMN timetrack.time_records.created_at IS 'Timestamp when the time record was created';
COMMENT
ON COLUMN timetrack.time_records.updated_at IS 'Timestamp when the time record was last updated';
-- COMMENT
-- ON FUNCTION validate_time_record_sequence() IS 'Validates time record business logic to prevent invalid sequences';
