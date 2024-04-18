const catchAsync = require("../shared/utils/catchAsync");
const AppError = require("./../shared/utils/appError");
const Course = require("../models/courseModel");
const Topic = require("../models/topicsModel");
// Function to retrieve all topics for a given course

exports.createTopic = async (req, res) => {
  try {
    const { title, week, plannedHours, learningOutcomes } = req.body;
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const newTopic = new Topic({
      title,
      week,
      plannedHours,
      learningOutcomes,
      course: courseId 
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
    const { title, week, plannedHours, learningOutcomes } = req.body;
    const topicId = req.params.topicId;

    const updatedTopic = await Topic.findByIdAndUpdate(topicId, {
      title,
      week,
      plannedHours,
      learningOutcomes
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
