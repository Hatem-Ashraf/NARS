const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Please provide a course code']
  },
  courseTitle: {
    type: String,
    required: [true, 'Please provide a course title']
  },
  courseAims: {
    type: String,
    required: [true, 'Please provide course aims']
  },
  courseInformation: {
    type: String
  },
  competences: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competences' }]
    // Assuming 'Competences' is the model defined in the provided code
  },
  learningOutcomes: {
    type: [{
      code: { type: String, required: true },
      name: { type: String, required: true }
    }]
  }
});

module.exports = mongoose.model('Topic', topicSchema);
