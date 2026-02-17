const Herb = require('../models/Herb');

// @desc    Get all herbs
// @route   GET /api/herbs
// @access  Public
const getHerbs = async (req, res) => {
    try {
        const herbs = await Herb.findAll();
        res.json(herbs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get herb by ID
// @route   GET /api/herbs/:id
// @access  Public
const getHerbById = async (req, res) => {
    try {
        const herb = await Herb.findByPk(req.params.id);

        if (herb) {
            res.json(herb);
        } else {
            res.status(404).json({ message: 'Herb not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getHerbs, getHerbById };
