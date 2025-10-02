-- Add version column for optimistic locking to all tables

-- Users table
ALTER TABLE app_users.users
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

-- Employees table
ALTER TABLE app_personnel.employees
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

-- User roles table
ALTER TABLE app_users.user_roles
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

-- User sessions table
ALTER TABLE app_users.user_sessions
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

-- Absence types table
ALTER TABLE app_timetrack.absence_types
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

-- Absences table
ALTER TABLE app_timetrack.absences
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

-- Time records table
ALTER TABLE app_timetrack.time_records
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

-- Work schedules table
ALTER TABLE app_timetrack.work_schedules
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

-- Add comments
COMMENT ON COLUMN app_users.users.version IS 'Version number for optimistic locking';
COMMENT ON COLUMN app_personnel.employees.version IS 'Version number for optimistic locking';
COMMENT ON COLUMN app_users.user_roles.version IS 'Version number for optimistic locking';
COMMENT ON COLUMN app_users.user_sessions.version IS 'Version number for optimistic locking';
COMMENT ON COLUMN app_timetrack.absence_types.version IS 'Version number for optimistic locking';
COMMENT ON COLUMN app_timetrack.absences.version IS 'Version number for optimistic locking';
COMMENT ON COLUMN app_timetrack.time_records.version IS 'Version number for optimistic locking';
COMMENT ON COLUMN app_timetrack.work_schedules.version IS 'Version number for optimistic locking';