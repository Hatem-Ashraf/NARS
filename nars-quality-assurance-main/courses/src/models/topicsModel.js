const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  week: {
    type: Number,
    required: true
  },
  plannedHours: {
    type: Number,
    required: true
  },
  actualHours: {
    type: Number,
    required: true
  },
  learningOutcomes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LO'
  }],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', 
    required: true
  }
});

module.exports = mongoose.model('Topic', topicSchema);
