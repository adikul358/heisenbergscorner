const mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
    questions: {
        type: Array
    },
    answers: {
        type: Array
    },
    week: {
        type: Number
    }
});

mongoose.model('Question', questionSchema);