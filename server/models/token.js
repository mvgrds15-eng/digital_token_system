const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenId: String,
  rackNumber: String,
  status: {
    type: String,
    default: "stored"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiry: Date
});

module.exports = mongoose.model('Token', tokenSchema);
