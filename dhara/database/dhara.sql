-- Dhara - MySQL Database Schema
-- Run this in phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS dhara;
USE dhara;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  dosha VARCHAR(20),
  age INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS herbs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dosha VARCHAR(50),
  benefits TEXT,
  safety_notes TEXT
);

CREATE TABLE IF NOT EXISTS medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  drug_class VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS interactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  herb_id INT NOT NULL,
  medicine_id INT NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  explanation TEXT,
  FOREIGN KEY (herb_id) REFERENCES herbs(id),
  FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

CREATE TABLE IF NOT EXISTS diet_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  week_start DATE NOT NULL,
  plan JSON NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed Data
INSERT INTO herbs (name, dosha, benefits, safety_notes) VALUES
('Ashwagandha', 'Vata, Kapha', 'Reduces stress, improves vitality, boosts immunity.', 'Avoid in pregnancy. May cause drowsiness.'),
('Tulsi', 'Vata, Kapha', 'Respiratory health, stress relief, antimicrobial.', 'May have blood-thinning effects.'),
('Brahmi', 'Pitta, Kapha', 'Improves memory, reduces anxiety.', 'May cause stomach upset on empty stomach.');

INSERT INTO medicines (name, drug_class) VALUES
('Aspirin', 'NSAID / Blood Thinner'),
('Warfarin', 'Anticoagulant'),
('Diazepam', 'Benzodiazepine / Sedative');

INSERT INTO interactions (herb_id, medicine_id, risk_level, explanation) VALUES
(1, 3, 'CAUTION', 'Ashwagandha may increase the sedative effects of Diazepam.'),
(2, 2, 'AVOID', 'Tulsi may enhance the blood-thinning effect of Warfarin, increasing bleeding risk.'),
(2, 1, 'CAUTION', 'Combined use may increase risk of bleeding due to additive antiplatelet effects.');
