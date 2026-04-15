const express = require('express');
const router = express.Router();
const Token = require('../models/token');

// Store item
router.post('/store', async (req, res) => {
  const tokenId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const pin = Math.floor(1000 + Math.random() * 9000).toString();
  const rackNumber = Math.floor(Math.random() * 10) + 1;

  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 72);

  const token = new Token({ tokenId, pin, rackNumber, expiry });
  await token.save();

  res.json({ tokenId, pin, rackNumber });
});

// Retrieve item
router.post('/retrieve', async (req, res) => {
  const { tokenId, pin } = req.body;

  const token = await Token.findOne({ tokenId, pin });

  if (!token) return res.status(400).json({ message: "Invalid Token" });

  token.status = "retrieved";
  await token.save();

  res.json({ rackNumber: token.rackNumber });
});

module.exports = router;