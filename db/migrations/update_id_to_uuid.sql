
-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Convert existing IDs to UUID
ALTER TABLE employees 
  ALTER COLUMN id TYPE text USING uuid_generate_v4()::text,
  ALTER COLUMN employee_id TYPE text USING uuid_generate_v4()::text;

ALTER TABLE compensation
  ALTER COLUMN id TYPE text USING uuid_generate_v4()::text,
  ALTER COLUMN employee_id TYPE text USING employees.id;
