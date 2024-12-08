# REST API FOR ASSIGNMENT API PROGRAMMER at NUTECH
## Deskripsi
Nutech-API adalah aplikasi berbasis Node.js (Express.js) yang menyediakan layanan untuk:
1. Registrasi dan login pengguna
2. Manajemen saldo pengguna (cek saldo dan top-up)
3. Layanan transaksi pembayaran
API ini menggunakan JWT untuk autentikasi dan MySQL sebagai database.

## Endpoint API
1. Registrasi
Endpoint: POST /auth/registration
Deskripsi: Registrasi pengguna baru.

Request:
Body (JSON):
  ```bash
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "password123"
}

Response:
200 OK:

json
Copy code
{
  "status": 0,
  "message": "Registrasi berhasil silahkan login",
  "data": null
}
400 Bad Request: Jika email sudah digunakan:

json
Copy code
{
  "status": 104,
  "message": "Email sudah terdaftar",
  "data": null
}
2. Login
Endpoint: POST /auth/login
Deskripsi: Login pengguna untuk mendapatkan token JWT.

Request:
Body (JSON):
json
Copy code
{
  "email": "user@example.com",
  "password": "password123"
}
Response:
200 OK:

json
Copy code
{
  "status": 0,
  "message": "Login Sukses",
  "data": {
    "token": "jwt_token_here"
  }
}
401 Unauthorized: Jika username atau password salah:

json
Copy code
{
  "status": 103,
  "message": "Username atau password salah",
  "data": null
}
3. Cek Saldo
Endpoint: GET /balance/balance
Deskripsi: Mendapatkan saldo terakhir pengguna.
Header:

Authorization: Bearer <JWT_Token>
Response:
200 OK:

json
Copy code
{
  "status": 0,
  "message": "Get Balance Berhasil",
  "data": {
    "balance": 1000000
  }
}
401 Unauthorized: Jika token tidak valid atau kadaluwarsa:

json
Copy code
{
  "status": 108,
  "message": "Token tidak valid atau kadaluwarsa",
  "data": null
}
4. Top-up Saldo
Endpoint: POST /balance/topup
Deskripsi: Menambah saldo pengguna.
Header:

Authorization: Bearer <JWT_Token>
Request:
Body (JSON):
json
Copy code
{
  "top_up_amount": 50000
}
Response:
200 OK:

json
Copy code
{
  "status": 0,
  "message": "Top-up berhasil",
  "data": {
    "balance": 1050000
  }
}
400 Bad Request: Jika jumlah top-up kurang dari 0:

json
Copy code
{
  "status": 109,
  "message": "Amount harus berupa angka positif dan lebih besar dari 0",
  "data": null
}
5. Transaksi
Endpoint: POST /transaction/transaction
Deskripsi: Melakukan transaksi layanan.
Header:

Authorization: Bearer <JWT_Token>
Request:
Body (JSON):
json
Copy code
{
  "service_code": "PULSA"
}
Response:
200 OK:

json
Copy code
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
400 Bad Request: Jika layanan tidak ditemukan:

json
Copy code
{
  "status": 102,
  "message": "Service atau Layanan tidak ditemukan",
  "data": null
}

## Setup Database

1. Pastikan Anda sudah memiliki MySQL atau MariaDB terinstal.
2. Jalankan file `schema.sql` untuk membuat database dan tabel yang diperlukan.

   ```bash
   mysql -u root -p < schema.sql
