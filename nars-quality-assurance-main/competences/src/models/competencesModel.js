const mongoose = require("mongoose");
const validator = require("validator");

const competencesSchema = new mongoose.Schema({

code:{
    type:String,
    required: [true, "Competences must have a code"],
},
description:{
    type: String,
    required: [true, "Competences must have a description"],
},
level:{
    type: String,
    required: [true, "Competences must have a level"],
    enum: ['A', 'B', 'C','D'],
},
 faculty: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
 }
 
})

const competences = mongoose.model("competences", competencesSchema);

module.exports = competences;