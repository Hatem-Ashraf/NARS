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
    ref: 'LO', // Reference to the 'LO' schema
    required: true
  },
  isCovered: {
    type: Boolean,
    default: false
  },
  possibleCompensationActions: {
    type: String,
    default: ""
  }
});

topicSchema.statics.calculateCoveragePercentage = async function(courseId) {
  const totalTopics = await this.countDocuments({ course: courseId });
  const coveredTopics = await this.countDocuments({ course: courseId, isCovered: true });

  if (totalTopics === 0) {
    return 0;
  }

  return (coveredTopics / totalTopics) * 100;
};

topicSchema.statics.calculateLearningOutcomeCoverage = async function(courseId) {
  const topics = await this.find({ course: courseId });

  const learningOutcomeCounts = {};
  const coveredLearningOutcomes = {};

  topics.forEach(topic => {
    topic.learningOutcomes.forEach(loId => {
      if (!learningOutcomeCounts[loId]) {
        learningOutcomeCounts[loId] = { count: 0, coveredCount: 0 };
      }
      learningOutcomeCounts[loId].count++;

      if (topic.isCovered) {
        learningOutcomeCounts[loId].coveredCount++;
      }
    });
  });

  const coverageResults = [];
  Object.keys(learningOutcomeCounts).forEach(loId => {
    const coveragePercentage = (learningOutcomeCounts[loId].coveredCount / learningOutcomeCounts[loId].count) * 100;
    coverageResults.push({ id: loId, coverage: coveragePercentage.toFixed(2) });
  });

  return coverageResults; // Return the results instead of logging them
};


module.exports = mongoose.model('Topic', topicSchema);
