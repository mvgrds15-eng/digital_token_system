const express = require('express');
const router = express.Router();
const Token = require('../models/token');

// Available racks
const racks = [
  "A1", "A2", "A3", "A4",
  "B1", "B2", "B3", "B4",
  "C1", "C2"
];

// ====================
// Deposit Item
// ====================
router.post('/store', async (req, res) => {
  try {

    const tokenId =
      "DT-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    const rackNumber =
      racks[Math.floor(Math.random() * racks.length)];

    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 72);

    const token = new Token({
      tokenId,
      rackNumber,
      expiry
    });

    await token.save();

    res.json({
      tokenId,
      rackNumber
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ====================
// Collect Item
// ====================
router.post('/retrieve', async (req, res) => {
  try {

    const { tokenId } = req.body;

    const token = await Token.findOne({
      tokenId
    });

    if (!token) {
      return res.status(404).json({
        message: "Invalid Token"
      });
    }

    if (token.status === "retrieved") {
      return res.status(400).json({
        message: "Item already collected"
      });
    }

    token.status = "retrieved";
    await token.save();

    res.json({
      rackNumber: token.rackNumber
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
