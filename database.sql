-- ================================================================
-- ប្រព័ន្ធគ្រប់គ្រងស្ថិតិភ្ញៀវទេសចរ
-- មជ្ឈមណ្ឌលប្រល័យពូជសាសន៍ជើងឯក
-- Database Schema - MySQL 8.0+
-- ================================================================

-- Create and select database
CREATE DATABASE IF NOT EXISTS choeungek_tourists
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE choeungek_tourists;

-- ── users ──────────────────────────────────────────────────────
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  full_name   VARCHAR(100) CHARACTER SET utf8mb4,
  role        ENUM('admin','staff','viewer') NOT NULL DEFAULT 'staff',
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  last_login  DATETIME,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin (password: admin123)
INSERT INTO users (username, password, full_name, role) VALUES
  ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'អ្នកគ្រប់គ្រង', 'admin'),
  ('staff1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'បុគ្គលិក ១', 'staff');

-- ── foreign_visitors ───────────────────────────────────────────
DROP TABLE IF EXISTS foreign_visitors;
CREATE TABLE foreign_visitors (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  visit_date      DATE         NOT NULL,
  country_name    VARCHAR(100) NOT NULL,
  total_visitors  INT UNSIGNED NOT NULL DEFAULT 0,
  female_visitors INT UNSIGNED NOT NULL DEFAULT 0,
  note            TEXT CHARACTER SET utf8mb4,
  created_by      INT UNSIGNED,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_visit_date (visit_date),
  INDEX idx_country (country_name),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── local_visitors ─────────────────────────────────────────────
DROP TABLE IF EXISTS local_visitors;
CREATE TABLE local_visitors (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  visit_date      DATE         NOT NULL,
  province_name   VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
  total_visitors  INT UNSIGNED NOT NULL DEFAULT 0,
  female_visitors INT UNSIGNED NOT NULL DEFAULT 0,
  note            TEXT CHARACTER SET utf8mb4,
  created_by      INT UNSIGNED,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_visit_date (visit_date),
  INDEX idx_province (province_name),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── activity_logs ──────────────────────────────────────────────
DROP TABLE IF EXISTS activity_logs;
CREATE TABLE activity_logs (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED,
  action      VARCHAR(50) NOT NULL,
  details     TEXT,
  ip_address  VARCHAR(45),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Sample Data: Foreign Visitors ──────────────────────────────
INSERT INTO foreign_visitors (visit_date, country_name, total_visitors, female_visitors, note, created_by) VALUES
  ('2026-05-09', 'Japan',        45, 22, 'Tour group',        1),
  ('2026-05-09', 'South Korea',  38, 19, '',                  1),
  ('2026-05-09', 'United States',62, 30, 'Educational visit', 1),
  ('2026-05-08', 'France',       27, 15, '',                  1),
  ('2026-05-08', 'Germany',      33, 18, '',                  1),
  ('2026-05-07', 'China',        88, 40, 'Group tour',        1),
  ('2026-05-07', 'Australia',    41, 21, '',                  1),
  ('2026-05-06', 'Vietnam',      55, 28, '',                  1),
  ('2026-05-06', 'Thailand',     49, 26, '',                  1),
  ('2026-05-05', 'United Kingdom',36, 20, '',                 1),
  ('2026-05-05', 'Canada',       28, 14, '',                  1),
  ('2026-05-04', 'Netherlands',  22, 12, '',                  1),
  ('2026-05-03', 'Singapore',    67, 35, '',                  1),
  ('2026-05-02', 'Malaysia',     74, 38, '',                  1),
  ('2026-05-01', 'India',        42, 18, '',                  1);

-- ── Sample Data: Local Visitors ────────────────────────────────
INSERT INTO local_visitors (visit_date, province_name, total_visitors, female_visitors, note, created_by) VALUES
  ('2026-05-09', 'ភ្នំពេញ',    120, 65, 'សាលារៀន',   1),
  ('2026-05-09', 'សៀមរាប',     85,  42, '',           1),
  ('2026-05-08', 'កណ្ដាល',     95,  50, '',           1),
  ('2026-05-08', 'បាត់ដំបង',   60,  32, '',           1),
  ('2026-05-07', 'កំពត',       45,  24, '',           1),
  ('2026-05-07', 'ព្រះសីហនុ',  38,  20, '',           1),
  ('2026-05-06', 'ក្រចេះ',     28,  15, '',           1),
  ('2026-05-06', 'ស្ទឹងត្រែង', 22,  12, '',           1),
  ('2026-05-05', 'ភ្នំពេញ',    145, 78, 'ថ្ងៃឈប់',   1),
  ('2026-05-05', 'កំពង់ចាម',   55,  29, '',           1),
  ('2026-05-04', 'ព្រះវិហារ',  33,  17, '',           1),
  ('2026-05-03', 'ពោធិ៍សាត់',  40,  21, '',           1),
  ('2026-05-02', 'ភ្នំពេញ',    188, 95, '',           1),
  ('2026-05-01', 'តាកែវ',      48,  25, '',           1);

-- ── Useful Views ───────────────────────────────────────────────
CREATE OR REPLACE VIEW v_daily_summary AS
SELECT
  visit_date,
  'foreign' AS type,
  country_name AS location,
  total_visitors,
  female_visitors,
  (total_visitors - female_visitors) AS male_visitors
FROM foreign_visitors
UNION ALL
SELECT
  visit_date,
  'local' AS type,
  province_name AS location,
  total_visitors,
  female_visitors,
  (total_visitors - female_visitors) AS male_visitors
FROM local_visitors;

CREATE OR REPLACE VIEW v_monthly_stats AS
SELECT
  YEAR(visit_date)  AS year,
  MONTH(visit_date) AS month,
  SUM(total_visitors)  AS total,
  SUM(female_visitors) AS female,
  SUM(total_visitors - female_visitors) AS male,
  COUNT(*) AS records
FROM (
  SELECT visit_date, total_visitors, female_visitors FROM foreign_visitors
  UNION ALL
  SELECT visit_date, total_visitors, female_visitors FROM local_visitors
) combined
GROUP BY YEAR(visit_date), MONTH(visit_date)
ORDER BY year DESC, month DESC;

-- ================================================================
-- DONE - Import with: mysql -u root -p < database.sql
-- ================================================================
