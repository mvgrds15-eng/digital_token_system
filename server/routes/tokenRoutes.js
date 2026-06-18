const express = require('express');
const router = express.Router();
const Token = require('../models/token');

const racks = [
  "A1","A2","A3","A4","A5",
  "B1","B2","B3","B4","B5",
  "C1","C2","C3","C4","C5",
  "D1","D2","D3","D4","D5",
  "E1","E2","E3","E4","E5",
  "F1","F2","F3","F4","F5",
  "G1","G2","G3","G4","G5",
  "H1","H2","H3","H4","H5",
  "I1","I2","I3","I4","I5",
  "J1","J2","J3","J4","J5"
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
