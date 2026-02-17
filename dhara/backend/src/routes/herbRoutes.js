const express = require('express');
const router = express.Router();
const { getHerbs, getHerbById } = require('../controllers/herbController');

router.get('/', getHerbs);
router.get('/:id', getHerbById);

module.exports = router;
