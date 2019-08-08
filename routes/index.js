const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const Answer = mongoose.model('Answer');

function addZero(num) {
  return (num >= 0 && num < 10) ? "0" + num : num + "";
}

function getDBDate() {
  var now = new Date();
  var strDateTime = [
    [addZero(now.getDate()),
      addZero(now.getMonth() + 1),
      now.getFullYear()
    ].join("/")
  ].join(" ");
  return strDateTime;
};

router.get('/', (req, res) => {
  Question.find({
    date: getDBDate()
  }, (err, docs) => {
    if (!err) {
      res.render("homepage", {
        layout: 'home-default',
        questions: docs[0].questions
      });
    } else {
      console.log('Error in retrieving questions list :' + err);
    }
  });
});

router.post('/submit-answer/user-data', (req, res) => {
  res.render('user-form', {
    layout: 'default-nos',
  })
  answers = [req.body.answer1, req.body.answer2]
  req.session.answers = answers
});

router.post('/submit-answer', (req, res) => {
  user = req.body
  grade = user.grade || "NA"
  section = user.section || "NA"
  userResponse = {
    answers: req.session.answers,
    name: user.name,
    email: user.email,
    grade: grade,
    section: section
  }
  Answer.create(userResponse, function (err, obj) {
    if (err) {
      console.log(err);
      res.render('form-submission', {
        layout: 'default-nos',
        status: {
          message: "Answer Couldn't be Submitted",
          image: "cross"
        }
      });
    } else {
      console.log(obj.id);
      res.render('form-submission', {
        layout: 'default-nos',
        status: {
          message: "Answer Successfully Submitted",
          image: "check"
        }
      });
    }
  })
});

router.get('/submit-answer/user-data', (req, res) => {
  res.redirect('/')
});

router.get('/submit-answer', (req, res) => {
  res.redirect("/")
});

module.exports = router;