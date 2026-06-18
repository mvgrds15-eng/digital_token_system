const express = require('express');
const router = express.Router();
const Token = require('../models/token');

const racks = [
  "A1", "A2", "A3", "A4",
  "B1", "B2", "B3", "B4",
  "C1", "C2"
];

// Deposit
router.post('/store', async (req, res) => {
  try {

    const occupied = await Token.find({
      status: "stored"
    });

    const occupiedRacks =
      occupied.map(item => item.rackNumber);

    const availableRack =
      racks.find(
        rack => !occupiedRacks.includes(rack)
      );

    if (!availableRack) {
      return res.status(400).json({
        message: "Storage Full"
      });
    }

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
      tokenId,
      rackNumber: availableRack
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error"
    });
  }
});

// Check token (before collection)
router.post('/check-token', async (req, res) => {

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

    res.json({
      rackNumber: token.rackNumber
    });

  } catch (err) {

    res.status(500).json({
      message: "Server Error"
    });

  }

});

// Confirm collection
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

    token.status = "retrieved";

    await token.save();

    res.json({
      message: "Item Collected Successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: "Server Error"
    });

  }

});

module.exports = router;
