const express = require("express");
const router = express.Router();
const { processTransaction } = require("../controllers/transactionController");
const { verifyToken } = require("../middleware/authJwt");

// Rute untuk melakukan transaksi (Private, membutuhkan token JWT)
router.post("/transaction", verifyToken, processTransaction);

module.exports = router;
