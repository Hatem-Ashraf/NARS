const mongoose = require('mongoose');

const LOSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    domain: {
        type: String,
        enum: ['Cognitive', 'Psychomotor', 'Affective'],
        required: true
    },
    competencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competency'
    }],
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Assuming you have a Course model
        required: true
    },

    target: { 
        type: Number,
        required: false 
    }
});

const LO = mongoose.model('LO', LOSchema);

module.exports = LO;
