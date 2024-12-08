const express = require("express");
const router = express.Router();
const { getBalance } = require("../controllers/balanceController");
const { topUpBalance } = require("../controllers/topupController");
const { verifyToken } = require("../middleware/authJwt"); // Middleware untuk verifikasi JWT

// Rute untuk cek saldo (Private, membutuhkan token JWT)
router.get("/balance", verifyToken, getBalance);

// Rute untuk top-up saldo (Private, membutuhkan token JWT)
router.post("/topup", verifyToken, topUpBalance);

module.exports = router;
