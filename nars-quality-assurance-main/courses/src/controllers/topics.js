const catchAsync = require("../shared/utils/catchAsync");
const AppError = require("./../shared/utils/appError");
const Course = require("../models/newCourseModel");
const Topic = require("../models/topicsModel");
const mongoose = require('mongoose');

// Function to retrieve all topics for a given course

exports.createTopic = async (req, res) => {
  try {
    const { title, week, plannedHours, actualHours, learningOutcomes, isCovered, possibleCompensationActions } = req.body;
    const courseId = req.params.courseId;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const loIds = learningOutcomes.map(loId => mongoose.Types.ObjectId(loId));
    
    const newTopic = new Topic({
      title,
      week,
      plannedHours,
      actualHours,
      learningOutcomes: loIds,
      course: courseId,
      isCovered: isCovered || false, // Default to false if not provided
      possibleCompensationActions: isCovered ? "" : possibleCompensationActions
    });

    await newTopic.save();

    res.status(201).json({ message: 'Topic created successfully', topic: newTopic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.updateTopic = async (req, res) => {
  try {
    const { title, week, plannedHours, actualHours, learningOutcomes, isCovered, possibleCompensationActions } = req.body;
    const topicId = req.params.topicId;
    
    const loIds = learningOutcomes.map(loId => mongoose.Types.ObjectId(loId));

    const updatedTopic = await Topic.findByIdAndUpdate(topicId, {
      title,
      week,
      plannedHours,
      actualHours,
      learningOutcomes: loIds,
      isCovered,
      possibleCompensationActions: isCovered ? "" : possibleCompensationActions
    }, { new: true });

    if (!updatedTopic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.status(200).json({ message: 'Topic updated successfully', topic: updatedTopic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.deleteTopic = async (req, res) => {
  try {
    const topicId = req.params.topicId;
    const deletedTopic = await Topic.findByIdAndDelete(topicId);

    if (!deletedTopic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTopicById = async (req, res) => {
  try {
    const topicId = req.params.topicId;
    const topic = await Topic.findById(topicId);

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.status(200).json({ topic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTopicsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const topics = await Topic.find({ course: courseId });

    res.status(200).json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.calculateCoverage = async (req, res) => {
  try {
    const { courseId } = req.params;
    const percentage = await Topic.calculateCoveragePercentage(courseId);
    res.json({ coveragePercentage: percentage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.covered_nonCovered =  async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const coveredTopics = await Topic.find({ course: courseId, isCovered: true });
    const nonCoveredTopics = await Topic.find({ course: courseId, isCovered: false });

    res.status(200).json({
      coveredTopics,
      nonCoveredTopics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.lo_coverage =  async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const coverageResult = await Topic.calculateLearningOutcomeCoverage(courseId);
    res.json(coverageResult);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while calculating coverage.');
  }
};

exports.covered_nonCoveredByQuery = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { status } = req.query;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    let topics;
    if (status === 'covered') {
      topics = await Topic.find({ course: courseId, isCovered: true });
    } else if (status === 'non-covered') {
      topics = await Topic.find({ course: courseId, isCovered: false });
    } else {
      return res.status(400).json({ error: 'Invalid status parameter' });
    }

    res.status(200).json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
