const DietPlan = require('../models/DietPlan');

// @desc    Get current week's diet plan
// @route   GET /api/diet/week
// @access  Private
const getDietPlan = async (req, res) => {
    try {
        // Logic to determine week start (e.g., last Sunday or Monday)
        // For simplicity, we just get the latest plan for now or filter by date
        const dietPlan = await DietPlan.findOne({
            where: { user_id: req.user.id },
            order: [['week_start', 'DESC']],
        });

        if (dietPlan) {
            res.json(dietPlan);
        } else {
            res.status(404).json({ message: 'No diet plan found for this week' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create or update diet plan
// @route   POST /api/diet/week
// @access  Private
const createOrUpdateDietPlan = async (req, res) => {
    const { week_start, plan } = req.body;

    try {
        // Check if plan exists for this week
        let dietPlan = await DietPlan.findOne({
            where: {
                user_id: req.user.id,
                week_start: week_start,
            },
        });

        if (dietPlan) {
            dietPlan.plan = plan;
            await dietPlan.save();
            return res.json(dietPlan);
        }

        dietPlan = await DietPlan.create({
            user_id: req.user.id,
            week_start,
            plan,
        });

        res.status(201).json(dietPlan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getDietPlan, createOrUpdateDietPlan };
