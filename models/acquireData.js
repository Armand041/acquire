const mongoose = require('mongoose');

const AcquireSchema = new mongoose.Schema({
    features: [Number],
    scalerVersion: { type: String, default: "v1" },
    createdAt: { type: Date, default: Date.now },
    rawSource: String
});

module.exports = mongoose.model('AcquireData', AcquireSchema);