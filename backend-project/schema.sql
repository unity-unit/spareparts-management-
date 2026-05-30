CREATE DATABASE IF NOT EXISTS PSSMS;
USE PSSMS;

CREATE TABLE IF NOT EXISTS car (
  plate_number VARCHAR(20) PRIMARY KEY,
  driver_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS parking_slot (
  slot_number VARCHAR(20) PRIMARY KEY,
  slot_status ENUM('available', 'occupied', 'unavailable') NOT NULL DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS parking_record (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plate_number VARCHAR(20) NOT NULL,
  slot_number VARCHAR(20) NOT NULL,
  entry_time DATETIME NOT NULL,
  exit_time DATETIME NULL,
  duration INT NULL,
  FOREIGN KEY (plate_number) REFERENCES car(plate_number) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (slot_number) REFERENCES parking_slot(slot_number) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS payment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parking_record_id INT NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  FOREIGN KEY (parking_record_id) REFERENCES parking_record(id) ON DELETE CASCADE ON UPDATE CASCADE
);
