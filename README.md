# REST API FOR ASSIGNMENT API PROGRAMMER at NUTECH
## Deskripsi
Nutech-API adalah aplikasi berbasis Node.js (Express.js) yang menyediakan layanan untuk:
1. Registrasi dan login pengguna
2. Manajemen saldo pengguna / cek saldo
3. Layanan top-up dan transaksi pembayaran

API ini menggunakan JWT untuk autentikasi dan MySQL sebagai database.


## **Daftar Isi**
1. [Setup Aplikasi](#setup-aplikasi)
2. [Konfigurasi Database](#konfigurasi-database)
3. [Endpoint API](#endpoint-api)
   - [Registrasi](#1-registrasi)
   - [Login](#2-login)
   - [Cek Saldo](#3-cek-saldo)
   - [Top-up Saldo](#4-top-up-saldo)
   - [Transaksi](#5-transaksi)
4. [Struktur Database](#struktur-database)
5. [Teknologi yang Digunakan](#teknologi-yang-digunakan)

---

## **Setup Aplikasi**

1. **Clone Repository**
   ```bash
   git clone https://github.com/irfannugroho/nutech-api.git
   cd nutech-api
   ```

2. **Install Dependencies**
   Pastikan sudah memiliki **Node.js** dan **npm** terinstal, lalu jalankan:
   ```bash
   npm install
   ```

3. **Setup Database**
   - Import file `schema.sql` untuk membuat database dan tabel:
     ```bash
     mysql -u root -p < schema.sql
     ```

4. **Jalankan Server**
   ```bash
   npm start
   ```
   Server akan berjalan di `http://localhost:3000`.

---

## **Konfigurasi Database**

Struktur database didefinisikan dalam file [schema.sql]. Berikut adalah detailnya:

### Tabel `users`
Menyimpan data pengguna.
| Kolom       | Tipe Data      | Keterangan                        |
|-------------|----------------|------------------------------------|
| id          | INT            | Primary Key, Auto Increment       |
| email       | VARCHAR(100)   | Unique, Email pengguna            |
| first_name  | VARCHAR(50)    | Nama depan                        |
| last_name   | VARCHAR(50)    | Nama belakang                     |
| password    | VARCHAR(255)   | Password pengguna                 |
| balance     | DECIMAL(10, 2) | Saldo pengguna (default 0)        |
| created_at  | TIMESTAMP      | Waktu pembuatan akun              |

### Tabel `transactions`
Menyimpan data transaksi pengguna.
| Kolom           | Tipe Data             | Keterangan                                |
|------------------|-----------------------|-------------------------------------------|
| id              | INT                   | Primary Key, Auto Increment               |
| email           | VARCHAR(100)          | Relasi ke tabel `users`                   |
| transaction_type| ENUM('TOPUP', 'PAYMENT') | Jenis transaksi                           |
| service_code    | VARCHAR(100)          | Kode layanan                              |
| service_name    | VARCHAR(255)          | Nama layanan                              |
| amount          | DECIMAL(10, 2)        | Jumlah transaksi                          |
| invoice_number  | VARCHAR(50)           | Nomor invoice                             |
| created_at      | TIMESTAMP             | Waktu transaksi                           |

---

## **Endpoint API**

### **1. Registrasi**
**Endpoint**: `POST /auth/registration`  
**Deskripsi**: Registrasi pengguna baru.

#### Request:
- **Body** (JSON):
  
  ```json
{
  "email": "user@nutech-integrasi.com",
  "first_name": "User",
  "last_name": "Nutech",
  "password": "abcdef1234"
}
```

#### Response:
- **200 OK**:
  ```json
  {
    "status": 0,
    "message": "Registrasi berhasil silahkan login",
    "data": null
  }
  ```

- **400 Bad Request**:
  Jika email sudah digunakan:
  ```json
  {
    "status": 104,
    "message": "Email sudah terdaftar",
    "data": null
  }
  ```

---

### **2. Login**
**Endpoint**: `POST /auth/login`  
**Deskripsi**: Login pengguna untuk mendapatkan token JWT.

#### Request:
- **Body** (JSON):
  ```json{
  "email": "user@nutech-integrasi.com",
  "password": "abcdef1234"
}
  ```

#### Response:
- **200 OK**:
  ```json
  {
    "status": 0,
    "message": "Login Sukses",
    "data": {
      "token": "jwt_token_here"
    }
  }
  ```

- **401 Unauthorized**:
  Jika username atau password salah:
  ```json
  {
    "status": 103,
    "message": "Username atau password salah",
    "data": null
  }
  ```

---

### **3. Cek Saldo**
**Endpoint**: `GET /balance/balance`  
**Deskripsi**: Mendapatkan saldo terakhir pengguna.  
**Header**:
- **Authorization**: `Bearer <JWT_Token>`

#### Response:
- **200 OK**:
  ```json
  {
    "status": 0,
    "message": "Get Balance Berhasil",
    "data": {
      "balance": 1000000
    }
  }
  ```

- **401 Unauthorized**:
  Jika token tidak valid atau kadaluwarsa:
  ```json
  {
    "status": 108,
    "message": "Token tidak valid atau kadaluwarsa",
    "data": null
  }
  ```

---

### **4. Top-up Saldo**
**Endpoint**: `POST /balance/topup`  
**Deskripsi**: Menambah saldo pengguna.  
**Header**:
- **Authorization**: `Bearer <JWT_Token>`

#### Request:
- **Body** (JSON):
  ```json
  {
    "top_up_amount": 50000
  }
  ```

#### Response:
- **200 OK**:
  ```json
  {
    "status": 0,
    "message": "Top-up berhasil",
    "data": {
      "balance": 1050000
    }
  }
  ```

- **400 Bad Request**:
  Jika jumlah top-up kurang dari 0:
  ```json
  {
    "status": 109,
    "message": "Amount harus berupa angka positif dan lebih besar dari 0",
    "data": null
  }
  ```

---

### **5. Transaksi**
**Endpoint**: `POST /transaction/transaction`  
**Deskripsi**: Melakukan transaksi layanan.  
**Header**:
- **Authorization**: `Bearer <JWT_Token>`

#### Request:
- **Body** (JSON):
  ```json
  {
    "service_code": "PULSA"
  }
  ```

#### Response:
- **200 OK**:
  ```json
  {
    "status": 0,
    "message": "Transaksi berhasil",
    "data": {
      "invoice_number": "INV08122024-001",
      "service_code": "PULSA",
      "service_name": "Layanan PULSA",
      "transaction_type": "PAYMENT",
      "total_amount": 10000,
      "created_on": "2024-12-08T10:10:10.000Z"
    }
  }
  ```

- **400 Bad Request**:
  Jika layanan tidak ditemukan:
  ```json
  {
    "status": 102,
    "message": "Service atau Layanan tidak ditemukan",
    "data": null
  }
  ```

---

