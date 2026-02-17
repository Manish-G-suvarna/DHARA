const express = require('express');
const router = express.Router();
const { getDietPlan, createOrUpdateDietPlan } = require('../controllers/dietController');
const { protect } = require('../middleware/authMiddleware');

router.get('/week', protect, getDietPlan);
router.post('/week', protect, createOrUpdateDietPlan);
router.put('/week', protect, createOrUpdateDietPlan); // Alias for convenience

module.exports = router;
