const LO = require("../models/los");

exports.getLosByProgramId = async (req, res) => {
    const { programId } = req.params;

    if (!programId) {
        return res.status(400).json({ error: 'Program ID is required' });
    }

    try {
        const los = await LO.find({ programId });

        if (los.length === 0) {
            return res.status(404).json({
                status: 'fail',
                error: 'No Learning Objectives found for this program ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: los
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            error: 'An error occurred while retrieving Learning Objectives'
        });
    }
};
