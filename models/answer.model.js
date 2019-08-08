const mongoose = require('mongoose');

var answerSchema = new mongoose.Schema({
    answers: { type: Array },
    name: { type: String },
    email: { type: String },
    grade: { type: Number },
    section: { type: String }
});

mongoose.model('Answer', answerSchema);