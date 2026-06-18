const express = require('express');
const router = express.Router();
const Token = require('../models/token');

// Available racks
const racks = [
  "A1", "A2", "A3", "A4", "A5",
  "B1", "B2", "B3", "B4", "B5"
];

// --------------------
// Deposit Item
// --------------------
router.post('/store', async (req, res) => {

  try {

    // Find occupied racks
    const occupied = await Token.find({ status: "stored" });

    const occupiedRacks = occupied.map(
      item => item.rackNumber
    );

    // Find first available rack
    const availableRack = racks.find(
      rack => !occupiedRacks.includes(rack)
    );

    if (!availableRack) {
      return res.status(400).json({
        message: "No racks available"
      });
    }

    // Generate unique token
    const tokenId =
      "DT-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    const token = new Token({
      tokenId,
      rackNumber: availableRack
    });

    await token.save();

    res.json({
      tokenId
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

});

// --------------------
// Collect Item
// --------------------
router.post('/retrieve', async (req, res) => {

  try {

    const { tokenId } = req.body;

    const token = await Token.findOne({
      tokenId,
      status: "stored"
    });

    if (!token) {
      return res.status(400).json({
        message: "Invalid Token"
      });
    }

    const rackNumber = token.rackNumber;

    // Free the rack
    token.status = "retrieved";
    await token.save();

    res.json({
      rackNumber
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

});

module.exports = router;
