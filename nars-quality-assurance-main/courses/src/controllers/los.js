const LO = require("../models/los");
const mongoose = require('mongoose');

// Create a new Learning Outcome
exports.createLos = async (req, res) => {
    const { code, name, domain, competencies } = req.body;
    if (!code || !name || !domain || !competencies) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newLO = new LO({
            code,
            name,
            domain,
            competencies
        });
        const savedLO = await newLO.save();
        res.status(201).json(savedLO);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while creating the Learning Outcome' });
    }
};

// Update an existing Learning Outcome
exports.updateLos = async (req, res) => {
    const { id } = req.params;
    const { code, name, domain, competencies } = req.body;

    try {
        const updatedLO = await LO.findByIdAndUpdate(
            id,
            { code, name, domain, competencies },
            { new: true, runValidators: true }
        );

        if (!updatedLO) {
            return res.status(404).json({ error: 'Learning Outcome not found' });
        }

        res.status(200).json(updatedLO);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating the Learning Outcome' });
    }
};

// Delete a Learning Outcome
exports.deleteLos = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLO = await LO.findByIdAndDelete(id);

        if (!deletedLO) {
            return res.status(404).json({ error: 'Learning Outcome not found' });
        }

        res.status(200).json({ message: 'Learning Outcome deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the Learning Outcome' });
    }
};

// Get all Learning Outcomes
exports.getAllLos = async (req, res) => {
    try {
        const los = await LO.find().populate('competencies');
        res.status(200).json(los);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the Learning Outcomes' });
    }
};

// Get a Learning Outcome by ID
exports.getLosById = async (req, res) => {
    try {
        const { id } = req.params;
        const lo = await LO.findById(id).populate('competencies');

        if (!lo) {
            return res.status(404).json({ error: 'Learning Outcome not found' });
        }

        res.status(200).json(lo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get multiple Learning Outcomes by IDs
exports.getMulLoById = async (req, res) => {
    const loIds = req.body.ids;

    try {
        const loObjectIds = loIds.map(id => mongoose.Types.ObjectId(id));
        const los = await LO.find({ _id: { $in: loObjectIds } }).populate('competencies');

        if (!los || los.length === 0) {
            return res.status(404).json({ message: 'No Learning Outcomes found for the specified IDs.' });
        }

        res.status(200).json(los);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all Learning Outcomes by domain
exports.getAllLosByDomain = async (req, res) => {
    const { domain } = req.query;

    if (!domain) {
        return res.status(400).json({ message: 'Missing required query parameter: domain' });
    }

    try {
        const los = await LO.find({ domain }).populate('competencies');
        res.status(200).json(los);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error filtering Learning Outcomes' });
    }
};
