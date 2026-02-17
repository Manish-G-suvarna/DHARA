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
('Ashwagandha', 'Vata, Kapha', 'Reduces stress, improves vitality, boosts immunity, enhances muscle strength.', 'Avoid in pregnancy. May cause drowsiness. Use caution with thyroid medication.'),
('Tulsi', 'Vata, Kapha', 'Respiratory health, stress relief, antimicrobial, boosts immunity.', 'May have blood-thinning effects. Avoid if trying to conceive.'),
('Brahmi', 'Pitta, Kapha', 'Improves memory, reduces anxiety, promotes hair growth.', 'May cause stomach upset on empty stomach. Safe for long-term use in moderation.'),
('Turmeric (Haridra)', 'Vata, Kapha', 'Anti-inflammatory, antimicrobial, improves skin health, supports digestion.', 'High doses may cause stomach upset. Caution with blood thinners.'),
('Ginger (Adrak)', 'Vata, Kapha', 'Aids digestion, reduces nausea, anti-inflammatory.', 'Avoid in high Pitta (acidity, ulcers). May thin blood.'),
('Triphala', 'Tridoshic', 'Gentle laxative, detoxifies, supports eye health, antioxidant rich.', 'Safe for most. Avoid during pregnancy due to downward energy (Apana Vayu).'),
('Guduchi (Giloy)', 'Pitta, Kapha', 'Immunomodulator, reduces fever, supports liver function.', 'Generally safe. Caution in autoimmune conditions due to immune boosting.'),
('Shatavari', 'Vata, Pitta', 'Supports female reproductive health, cools body, reduces acidity.', 'Avoid if there is high Kapha (congestion, weight gain).'),
('Neem', 'Pitta, Kapha', 'Purifies blood, supports skin health, antimicrobial.', 'Very cooling. Avoid in high Vata (dryness, cold). Not for pregnancy.'),
('Amla (Amalaki)', 'Tridoshic', 'Rich in Vitamin C, anti-aging, supports immunity and digestion.', 'Generally safe. Can increase cooling in body.'),
('Licorice (Yashtimadhu)', 'Vata, Pitta', 'Soothes throat, supports adrenals, heals ulcers.', 'Avoid in high blood pressure and pregnancy. Can cause potassium loss.'),
('Arjuna', 'Pitta, Kapha', 'Supports heart health, reduces blood pressure, emotionally grounding.', 'Consult physician if on heart medication.');

INSERT INTO medicines (name, drug_class) VALUES
('Aspirin', 'NSAID / Blood Thinner'),
('Warfarin', 'Anticoagulant'),
('Diazepam', 'Benzodiazepine / Sedative'),
('Metformin', 'Antidiabetic'),
('Atorvastatin', 'Statin (Cholesterol)'),
('Omeprazole', 'Proton Pump Inhibitor (Acid Reflux)'),
('Ibuprofen', 'NSAID (Pain Reliever)'),
('Levothyroxine', 'Thyroid Hormone'),
('Amlodipine', 'Calcium Channel Blocker (Blood Pressure)'),
('Insulin', 'Antidiabetic Hormone');

INSERT INTO interactions (herb_id, medicine_id, risk_level, explanation) VALUES
(1, 3, 'CAUTION', 'Ashwagandha may increase the sedative effects of Diazepam and other sedatives.'),
(1, 8, 'CAUTION', 'Ashwagandha may stimulate thyroid function; monitor TSH levels if on Levothyroxine.'),
(2, 2, 'AVOID', 'Tulsi may enhance the blood-thinning effect of Warfarin, increasing bleeding risk.'),
(2, 1, 'CAUTION', 'Combined use may increase risk of bleeding due to additive antiplatelet effects.'),
(4, 2, 'AVOID', 'Turmeric (Curcumin) enhances anti-coagulant effects of Warfarin. High bleeding risk.'),
(4, 1, 'CAUTION', 'Turmeric may increase bleeding risk when taken with Aspirin.'),
(4, 6, 'BENEFICIAL', 'Turmeric may heal gut lining, complementing Omeprazoles ulcer treatment, but consult doctor.'),
(5, 2, 'CAUTION', 'Ginger has mild blood-thinning properties. Monitor INR if on Warfarin.'),
(5, 4, 'beneficial', 'Ginger may help lower blood sugar, potentially enhancing Metformin effects. Monitor glucose.'),
(7, 10, 'CAUTION', 'Guduchi seeds may lower blood sugar additives to Insulin. Monitor for hypoglycemia.'),
(9, 4, 'CAUTION', 'Neem may lower blood sugar. Combined with Metformin, it could cause hypoglycemia.'),
(9, 10, 'CAUTION', 'Neem enhances insulin sensitivity. Dose adjustment for Insulin may be needed.'),
(11, 9, 'AVOID', 'Licorice can raise blood pressure and counteract Amlodipine effects.'),
(11, 8, 'CAUTION', 'Licorice may lower potassium levels, which can be risky if on certain heart/BP meds.');
