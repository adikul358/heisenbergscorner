const mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
    questions: { type: Array },
    answers: { type: Array }
});

mongoose.model('Question', questionSchema);