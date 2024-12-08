-- Membuat database dengan nama nutechtestdb
CREATE DATABASE IF NOT EXISTS nutechtestdb;

-- Menggunakan database
USE nutechtestdb;

-- Tabel pengguna (users)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel transaksi (transactions)
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  transaction_type ENUM('TOPUP', 'PAYMENT') NOT NULL,
  service_code VARCHAR(100) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  invoice_number VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (email) REFERENCES users(email)
);
