const express = require('express');
const router = express.Router();
const { checkInteraction } = require('../controllers/interactionController');

router.get('/check', checkInteraction);

module.exports = router;
