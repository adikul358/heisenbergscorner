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
    if (!err && docs[0]) {
      res.render("quiz", {
        layout: 'home-default',
        questions: docs[0].questions,
        title: 'Heisenbergs Corner - Build Your Curiosity @ Shiv Nadar School Noida',
        theme: {
          title: "Chandrayan II",
          text: "Chandrayaan 2 is an Indian lunar mission that will boldly go where no country has ever gone before — the Moon's south polar region. Through this effort, the aim is to improve our understanding of the Moon — discoveries that will benefit India and humanity as a whole. These insights and experiences aim at a paradigm shift in how lunar expeditions are approached for years to come — propelling further voyages into the farthest frontiers."
        }
      });
      req.session.questionID = docs[0]._id;
    } else {
      res.render("quiz-error", {
        layout: 'home-default',
        title: 'Heisenbergs Corner - Build Your Curiosity @ Shiv Nadar School Noida',
        theme: {
          title: "Chandrayan II",
          text: "Chandrayaan 2 is an Indian lunar mission that will boldly go where no country has ever gone before — the Moon's south polar region. Through this effort, the aim is to improve our understanding of the Moon — discoveries that will benefit India and humanity as a whole. These insights and experiences aim at a paradigm shift in how lunar expeditions are approached for years to come — propelling further voyages into the farthest frontiers."
        }
      });
      console.log('Error in retrieving questions list :' + err);
    }
  });
});

router.post('/submit-answer/user-data', (req, res) => {
  res.render('user-form', {
    layout: 'default-nos',
    title: "Enter Your Details - Heisenberg's Corner"
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
    section: section,
    questionID: req.session.questionID
  }
  Answer.create(userResponse, function (err, obj) {
    if (err) {
      console.log(err);
      res.render('form-submission', {
        layout: 'default-nos',
        status: {
          message: "Answer Couldn't be Submitted",
          image: "cross"
        },
        title: "Answer Couldn't be Submitted - Heisenberg's Corner"
      });
    } else {
      console.log(obj.id);
      res.render('form-submission', {
        layout: 'default-nos',
        status: {
          message: "Answer Successfully Submitted",
          image: "check"
        },
        title: "Answer Successfully Submitted - Heisenberg's Corner"
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