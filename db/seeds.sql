-- Add departments to the departments table
INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Marketing');

-- Add roles to the roles table
INSERT INTO roles (title, salary, department_id) VALUES
  ('Sales Lead', 100000.00, 1),
  ('Salesperson', 80000.00, 1),
  ('Lead Engineer', 150000.00, 2),
  ('Software Engineer', 120000.00, 2),
  ('Accountant', 125000.00, 3),
  ('Marketing Manager', 100000.00, 4);

-- Add employees to the employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Bob', 'Johnson', 3, NULL),
  ('Alice', 'Williams', 4, 3),
  ('Mike', 'Brown', 5, 3),
  ('Sarah', 'Lee', 6, NULL);
