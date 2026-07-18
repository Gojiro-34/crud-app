-- ============================================================
-- Task Manager — Database Initialization
-- ============================================================
-- This script runs once when the MySQL container starts with an
-- empty data volume.  It is typically bind-mounted into
-- /docker-entrypoint-initdb.d/ in the official mysql image.
--
-- For schema changes AFTER the first boot you will need a
-- migration tool (knex, flyway, etc.) — init scripts are
-- skipped when the data directory already exists.
-- ============================================================

CREATE DATABASE IF NOT EXISTS taskmanager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE taskmanager;

-- ---- Tasks table ----

CREATE TABLE IF NOT EXISTS tasks (
  id          INT           AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  description TEXT,
  status      ENUM('todo', 'in-progress', 'done') NOT NULL DEFAULT 'todo',
  due_date    DATE,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_due_date (due_date)
) ENGINE=InnoDB;

-- ---- Seed data ----

INSERT INTO tasks (title, description, status, due_date) VALUES
  (
    'Set up project repository',
    'Initialize Git repo, add .gitignore, and push initial commit to GitHub.',
    'done',
    '2026-07-15'
  ),
  (
    'Design database schema',
    'Define tables, relationships, and indexes for the Task Manager application.',
    'done',
    '2026-07-16'
  ),
  (
    'Build REST API endpoints',
    'Implement CRUD routes for tasks in Express with input validation and error handling.',
    'in-progress',
    '2026-07-20'
  ),
  (
    'Create React frontend',
    'Build task list, create/edit form, status filter, and delete confirmation dialog.',
    'in-progress',
    '2026-07-22'
  ),
  (
    'Write Dockerfiles',
    'Create multi-stage Dockerfiles for frontend and backend services.',
    'todo',
    '2026-07-25'
  ),
  (
    'Configure CI/CD pipeline',
    'Set up GitHub Actions workflow for automated testing, building, and deployment to EKS.',
    'todo',
    '2026-07-30'
  );
