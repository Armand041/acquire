const express = require('express');
const { acquireData } = require('../controllers/acquireController');

const router = express.Router();

// POST /acquire/data
router.post('/data', acquireData);

module.exports = router;