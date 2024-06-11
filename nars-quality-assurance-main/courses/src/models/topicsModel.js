const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to the 'Course' schema
    required: true
  },
  learningOutcomes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LO', // Reference to the 'LO' schema
    required: true
  }],
  isCovered: {
    type: Boolean,
    default: false
  }
});

// Static method to calculate learning outcome coverage by program
topicSchema.statics.calculateLearningOutcomeCoverageByProgram = async function(programId) {
  const courses = await mongoose.model('Course').find({ program: programId }).select('_id');
  const courseIds = courses.map(course => course._id);

  const topics = await this.find({ course: { $in: courseIds } });

  const learningOutcomeCounts = {};

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
  let totalCount = 0;
  let totalCoveredCount = 0;

  Object.keys(learningOutcomeCounts).forEach(loId => {
    const count = learningOutcomeCounts[loId].count;
    const coveredCount = learningOutcomeCounts[loId].coveredCount;
    const coveragePercentage = (coveredCount / count) * 100;
    coverageResults.push({ id: loId, coverage: parseFloat(coveragePercentage.toFixed(2)) });

    totalCount += count;
    totalCoveredCount += coveredCount;
  });

  const totalCoveragePercentage = (totalCoveredCount / totalCount) * 100;

  return { coverageResults, totalCoveragePercentage: parseFloat(totalCoveragePercentage.toFixed(2)) };
};

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
