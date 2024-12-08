const pool = require("../config/db");
const moment = require("moment"); // Untuk menghasilkan invoice number dengan format tanggal

exports.processTransaction = async (req, res) => {
  const email = req.email; // Diperoleh dari payload JWT
  const { service_code } = req.body;

  // Validasi input
  if (!service_code) {
    return res.status(400).json({
      status: 102,
      message: "Service atau Layanan tidak ditemukan",
      data: null,
    });
  }

  try {
    // Cari saldo pengguna berdasarkan email
    const [userRows] = await pool.query(
      "SELECT balance FROM users WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak valid atau kadaluwarsa",
        data: null,
      });
    }

    const user = userRows[0];

    // Tentukan harga transaksi berdasarkan service_code (contoh)
    const servicePrices = {
      PULSA: 10000, // Misalnya harga pulsa
      PLN_PRABAYAR: 50000, // Misalnya harga PLN prabayar
    };

    // Pastikan service_code ada di layanan yang tersedia
    if (!servicePrices[service_code]) {
      return res.status(400).json({
        status: 102,
        message: "Service atau Layanan tidak ditemukan",
        data: null,
      });
    }

    const totalAmount = servicePrices[service_code];

    // Pastikan saldo mencukupi
    if (user.balance < totalAmount) {
      return res.status(400).json({
        status: 103,
        message: "Saldo tidak mencukupi",
        data: null,
      });
    }

    // Update saldo pengguna setelah transaksi
    const newBalance = user.balance - totalAmount;
    await pool.query("UPDATE users SET balance = ? WHERE email = ?", [
      newBalance,
      email,
    ]);

    // Simpan transaksi ke dalam tabel transaksi
    const invoiceNumber = `INV${moment().format("DDMMYYYY")}-${Math.floor(
      Math.random() * 1000
    )}`;
    await pool.query(
      "INSERT INTO transactions (email, transaction_type, service_code, service_name, amount, invoice_number) VALUES (?, ?, ?, ?, ?, ?)",
      [
        email,
        "PAYMENT",
        service_code,
        "Layanan " + service_code,
        totalAmount,
        invoiceNumber,
      ]
    );

    // Kirim response dengan detail transaksi
    res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number: invoiceNumber,
        service_code: service_code,
        service_name: "Layanan " + service_code,
        transaction_type: "PAYMENT",
        total_amount: totalAmount,
        created_on: moment().format(),
      },
    });
  } catch (error) {
    console.error("Error during transaction:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
};
