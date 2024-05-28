const LO = require("../models/los");

const mongoose = require('mongoose');

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
        res.status(500).json({ error: 'An error occurred while creating the Learning Objective' });
    }

};


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
            return res.status(404).json({ error: 'Learning Objective not found' });
        }

        res.status(200).json(updatedLO);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating the Learning Objective' });
    }
};


exports.deleteLos = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLO = await LO.findByIdAndDelete(id);

        if (!deletedLO) {
            return res.status(404).json({ error: 'Learning Objective not found' });
        }

        res.status(200).json({ message: 'Learning Objective deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the Learning Objective' });
    }
};

exports.getAllLos = async (req, res) => {
    try {
        const los = await LO.find();
        res.status(200).json(los);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the Learning Objectives' });
    }
};

exports.getLosById = async (req, res) => {
    try {
      const {id} = req.params;
      const lo = await LO.findById(id);
  
      if (!lo) {
        return res.status(404).json({ error: 'lo not found' });
      }
  
      res.status(200).json({ lo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  
exports.getMulLoById = async (req, res) => {
     const loIds = req.body.ids;
  
      try {
          const loObjectIds = loIds.map(id => mongoose.Types.ObjectId(id));
          const los = await LO.find({ _id: { $in: loObjectIds } });
          if (!los || los.length === 0) {
              return res.status(404).json({ message: 'No learning objectives found for the specified IDs.' });
          }

          res.json(los);
      } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal Server Error' });
      }
  };
  

  


// m4 sha8aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal 
//zozzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
exports.getAllLosByDomain = async (req, res) => {
    const domain = req.params.domain;
    const los = await LO.find({ domain: domain });
    try {
       
        
        if (!los || los.length === 0) {
            return res.status(404).json({ message: 'No learning objectives found for the specified domain.' });
        }

        // If LOs are found, send them in the response
        res.json(los);
    } catch (err) {
        // If an error occurs, send a 500 response with the error message
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};