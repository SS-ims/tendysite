-- ================================================
-- Tendy Woodlands Services Database Schema
-- ================================================

-- Create database
CREATE DATABASE IF NOT EXISTS tendy_db;
USE tendy_db;

-- ================================================
-- ADMINS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- CATEGORIES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- PRODUCTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT,
  name VARCHAR(255) NOT NULL,
  short_description TEXT,
  description TEXT,
  price DECIMAL(10, 2),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ================================================
-- PRODUCT ENQUIRIES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS product_enquiries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ================================================
-- CONTACT REQUESTS TABLE
-- ================================================
-- Clients table to store customer records
CREATE TABLE IF NOT EXISTS clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- ================================================
-- SAMPLE DATA - CATEGORIES
-- ================================================
INSERT INTO categories (name, description) VALUES
  ('Consultation', 'Professional consulting services'),
  ('Training', 'Professional training programs'),
  ('Audit', 'System audit and assessment');

-- ================================================
-- SAMPLE DATA - PRODUCTS
-- ================================================
INSERT INTO products (category_id, name, short_description, description, price, image) VALUES
  (1, 'HACCP System Implementation', 'Complete HACCP system design and implementation', 
   'We help establish comprehensive HACCP systems tailored to your operations.', 5000.00, 'haccp.jpg'),
  (2, 'Food Safety Training', 'Comprehensive food safety training for your team',
   'Customized training programs covering food safety best practices and compliance.', 2000.00, 'training.jpg'),
  (3, 'Risk Assessment Audit', 'Detailed risk assessment of your food safety systems',
   'Professional audit to identify gaps and recommend improvements.', 3000.00, 'audit.jpg'),
  (1, 'Process Optimization', 'Optimize your food safety processes',
   'Streamline your processes for better efficiency and safety.', 4000.00, 'process.jpg');

-- ================================================
-- SAMPLE DATA - ADMINS
-- ================================================
-- Password: admin123 (hashed with bcryptjs)
INSERT INTO admins (email, password_hash, name) VALUES
  ('admin@tendywoodlands.com', '$2a$10$Y9Q0sIlUX3p.CVQvQ2R5N.eWf8xfHnLJydzkKJZkfL2H1dHpvU/tC', 'Admin User');
