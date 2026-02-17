const Interaction = require('../models/Interaction');

// @desc    Check interaction between herb and medicine
// @route   GET /api/interactions/check
// @access  Public
const checkInteraction = async (req, res) => {
    const { herbId, medicineId } = req.query;

    if (!herbId || !medicineId) {
        return res.status(400).json({ message: 'Please provide both herbId and medicineId' });
    }

    try {
        const interaction = await Interaction.findOne({
            where: {
                herb_id: herbId,
                medicine_id: medicineId,
            },
        });

        if (interaction) {
            res.json({
                found: true,
                risk_level: interaction.risk_level,
                explanation: interaction.explanation,
            });
        } else {
            res.json({
                found: false,
                message: 'No known interaction found',
                risk_level: 'SAFE', // Default assumption if no data
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { checkInteraction };
