
CREATE SCHEMA IF NOT EXISTS app_timetrack;

-- Create work_schedules table with String IDs
CREATE TABLE IF NOT EXISTS app_timetrack.work_schedules (
                                                        id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    employee_id VARCHAR(36) NOT NULL REFERENCES app_personnel.employees(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    start_time TIME,
    end_time TIME,
    break_duration_minutes INTEGER NOT NULL DEFAULT 60,
    is_working_day BOOLEAN NOT NULL DEFAULT true,
    effective_from DATE NOT NULL,
    effective_until DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Add constraints
ALTER TABLE app_timetrack.work_schedules
    ADD CONSTRAINT check_day_of_week
        CHECK (day_of_week >= 1 AND day_of_week <= 7);

ALTER TABLE app_timetrack.work_schedules
    ADD CONSTRAINT check_effective_dates
        CHECK (effective_until >= effective_from);

ALTER TABLE app_timetrack.work_schedules
    ADD CONSTRAINT check_working_day_times
        CHECK ((is_working_day = false) OR
               (is_working_day = true AND start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time));

ALTER TABLE app_timetrack.work_schedules
    ADD CONSTRAINT check_break_duration
        CHECK (break_duration_minutes >= 0 AND break_duration_minutes <= 480);

-- Create unique constraint
CREATE UNIQUE INDEX idx_work_schedules_no_overlap
    ON app_timetrack.work_schedules (employee_id, day_of_week, effective_from, effective_until)
    WHERE is_active = true;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_work_schedules_employee_id ON app_timetrack.work_schedules(employee_id);
CREATE INDEX IF NOT EXISTS idx_work_schedules_day_of_week ON app_timetrack.work_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_work_schedules_effective_from ON app_timetrack.work_schedules(effective_from);
CREATE INDEX IF NOT EXISTS idx_work_schedules_effective_until ON app_timetrack.work_schedules(effective_until);
CREATE INDEX IF NOT EXISTS idx_work_schedules_is_active ON app_timetrack.work_schedules(is_active);
CREATE INDEX IF NOT EXISTS idx_work_schedules_is_working_day ON app_timetrack.work_schedules(is_working_day);
CREATE INDEX IF NOT EXISTS idx_work_schedules_created_at ON app_timetrack.work_schedules(created_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_work_schedules_employee_effective ON app_timetrack.work_schedules(employee_id, effective_from, effective_until);
CREATE INDEX IF NOT EXISTS idx_work_schedules_active_dates ON app_timetrack.work_schedules(is_active, effective_from, effective_until);

-- Drop trigger if exists before creating
-- DROP TRIGGER IF EXISTS update_work_schedules_updated_at ON app_timetrack.work_schedule;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_work_schedules_updated_at
    BEFORE UPDATE ON app_timetrack.work_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function with String ID parameter
CREATE OR REPLACE FUNCTION get_current_work_schedule(emp_id VARCHAR(36), schedule_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    schedule_id VARCHAR(36),
    day_of_week INTEGER,
    start_time TIME,
    end_time TIME,
    break_duration_minutes INTEGER,
    is_working_day BOOLEAN
) AS $$
BEGIN
RETURN QUERY
SELECT
    ws.id,
    ws.day_of_week,
    ws.start_time,
    ws.end_time,
    ws.break_duration_minutes,
    ws.is_working_day
FROM app_timetrack.work_schedules ws
WHERE ws.employee_id = emp_id
  AND ws.is_active = true
  AND ws.effective_from <= schedule_date
  AND ws.effective_until >= schedule_date
ORDER BY ws.effective_from DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert sample work schedule templates
INSERT INTO app_timetrack.work_schedules (employee_id, day_of_week, start_time, end_time, break_duration_minutes, is_working_day, effective_from, effective_until, is_active)
SELECT
    e.id,
    generate_series(1, 5) as day_of_week,  -- Monday to Friday
    '09:00:00'::TIME as start_time,
    '17:00:00'::TIME as end_time,
    60 as break_duration_minutes,
    true as is_working_day,
    CURRENT_DATE as effective_from,
    '2099-12-31'::DATE as effective_until,
    true as is_active
FROM app_personnel.employees e
WHERE e.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM app_timetrack.work_schedules ws
    WHERE ws.employee_id = e.id
);

-- Weekend schedules (non-working days)
INSERT INTO app_timetrack.work_schedules (employee_id, day_of_week, start_time, end_time, break_duration_minutes, is_working_day, effective_from, effective_until, is_active)
SELECT
    e.id,
    generate_series(6, 7) as day_of_week,  -- Saturday and Sunday
    NULL as start_time,
    NULL as end_time,
    0 as break_duration_minutes,
    false as is_working_day,
    CURRENT_DATE as effective_from,
    '2099-12-31'::DATE as effective_until,
    true as is_active
FROM app_personnel.employees e
WHERE e.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM app_timetrack.work_schedules ws
    WHERE ws.employee_id = e.id
      AND ws.day_of_week IN (6, 7)
);

-- Add comments for documentation
COMMENT ON TABLE app_timetrack.work_schedules IS 'Employee regular working hours and schedules';
COMMENT ON COLUMN app_timetrack.work_schedules.id IS 'Unique identifier for the work schedule';
COMMENT ON COLUMN app_timetrack.work_schedules.employee_id IS 'Reference to the employee this schedule belongs to';
COMMENT ON COLUMN app_timetrack.work_schedules.day_of_week IS 'Day of week (1=Monday, 2=Tuesday, ..., 7=Sunday)';
COMMENT ON COLUMN app_timetrack.work_schedules.start_time IS 'Start time for this day (null if non-working day)';
COMMENT ON COLUMN app_timetrack.work_schedules.end_time IS 'End time for this day (null if non-working day)';
COMMENT ON COLUMN app_timetrack.work_schedules.break_duration_minutes IS 'Total break time in minutes for this day';
COMMENT ON COLUMN app_timetrack.work_schedules.is_working_day IS 'Whether this is a working day for the employee';
COMMENT ON COLUMN app_timetrack.work_schedules.effective_from IS 'Date when this schedule becomes effective';
COMMENT ON COLUMN app_timetrack.work_schedules.effective_until IS 'Date when this schedule expires';
COMMENT ON COLUMN app_timetrack.work_schedules.is_active IS 'Whether this schedule is currently active';
COMMENT ON COLUMN app_timetrack.work_schedules.created_at IS 'Timestamp when the schedule was created';
COMMENT ON COLUMN app_timetrack.work_schedules.updated_at IS 'Timestamp when the schedule was last updated';
-- COMMENT ON FUNCTION get_current_work_schedule(UUID, DATE) IS 'Returns the current active work schedule for an employee on a given date';

