const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Fungsi validasi format email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Registrasi User
exports.register = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;

  console.log("Request body:", req.body); // Log request body untuk melihat data yang dikirim

  // Validasi input
  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({
      status: 101,
      message: "Parameter tidak lengkap",
      data: null,
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 102,
      message: "Parameter email tidak sesuai format",
      data: null,
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      status: 103,
      message: "Password harus minimal 8 karakter",
      data: null,
    });
  }

  try {
    // Enkripsi password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds

    // Simpan data user ke database
    const [result] = await pool.query(
      "INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)",
      [email, first_name, last_name, hashedPassword]
    );

    console.log("Database query result:", result); // Log hasil query

    res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null,
    });
  } catch (error) {
    console.error("Query error:", error); // Log error jika query gagal

    // Penanganan jika email sudah terdaftar
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        status: 104,
        message: "Email sudah terdaftar",
        data: null,
      });
    }

    // Untuk error lainnya
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({
      status: 101,
      message: "Parameter tidak lengkap",
      data: null,
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 102,
      message: "Parameter email tidak sesuai format",
      data: null,
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      status: 103,
      message: "Password harus minimal 8 karakter",
      data: null,
    });
  }

  try {
    // Cari pengguna berdasarkan email
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // Cek apakah pengguna ada
    if (rows.length === 0) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    // Verifikasi password menggunakan bcrypt
    const user = rows[0];
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    // Generate JWT token dengan payload email dan expiration 12 jam
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET, // Secret key untuk sign JWT
      { expiresIn: "12h" } // Set expiration selama 12 jam
    );

    // Kirim response dengan token
    res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: { token },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
};
