const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  coverage: Number // Assuming there's a coverage field
});

topicSchema.statics.calculateLearningOutcomeCoverage = async function(courseId) {
  // Find all topics for the given courseId
  const topics = await this.find({ course: courseId });

  // Calculate the total coverage
  const totalCoverage = topics.reduce((acc, topic) => acc + topic.coverage, 0);

  // Calculate the coverage percentage
  const coveragePercentage = topics.length ? (totalCoverage / topics.length) : 0;

  return coveragePercentage;
};

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
