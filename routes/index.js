const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const Answer = mongoose.model('Answer');
const async = require('async');

function getWeekNumber() {
  var tdt = new Date();
  var dayn = (tdt.getDay() + 6) % 7;
  tdt.setDate(tdt.getDate() - dayn + 3);
  var firstThursday = tdt.valueOf();
  tdt.setMonth(0, 1);
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

  
router.get('/', (req, res) => {
  Question.find({
    week: getWeekNumber()
  }, (err, docs) => {
    if (!err && docs[0]) {
      res.render("quiz", {
        layout: 'home-default',
        questions: docs[0].questions,
        title: 'Heisenbergs Corner - Build Your Curiosity @ Shiv Nadar School Noida',
        theme: {
          title: "Chandrayan II",
          text: "Chandrayaan 2 is an Indian lunar mission that will boldly go where no country has ever gone before — the Moon's south polar region. Through this effort, the aim is to improve our understanding of the Moon — discoveries that will benefit India and humanity as a whole. These insights and experiences aim at a paradigm shift in how lunar expeditions are approached for years to come — propelling further voyages into the farthest frontiers."
        },
        week: getWeekNumber()
      });
      req.session.questionID = docs[0]._id;
    } else {
      res.render("quiz-error", {
        layout: 'home-default',
        title: 'Heisenbergs Corner - Build Your Curiosity @ Shiv Nadar School Noida',
        theme: {
          title: "Chandrayan II",
          text: "Chandrayaan 2 is an Indian lunar mission that will boldly go where no country has ever gone before — the Moon's south polar region. Through this effort, the aim is to improve our understanding of the Moon — discoveries that will benefit India and humanity as a whole. These insights and experiences aim at a paradigm shift in how lunar expeditions are approached for years to come — propelling further voyages into the farthest frontiers."
        },
        week: getWeekNumber()
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
    week: getWeekNumber(),
    state: null
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
  });
});

router.get('/submit-answer/user-data', (req, res) => {
  res.redirect('/')
});

router.get('/submit-answer', (req, res) => {
  res.redirect("/")
});

router.get('/submit-question', (req, res) => {
  if (!req.session.userValidate) {
    res.render('validation-form', {
      layout: 'default-nos',
      title: "Login - Heisenberg's Corner",
      link: "submit-question"
    });
  } else {
    Question.findOne().sort('-week').exec((err, doc) => {
      if (!err && doc.week >= getWeekNumber()) {
        lastWeek = doc.week + 1;
      } else if (!err) {
        lastweek = doc.week
      } else {
        console.log(err);
      }
      res.render('question-form', {
        layout: 'default-nos',
        title: "Submit Questions - Heisenberg's Corner",
        week: lastWeek
      });
    });
  }
});

router.post('/submit-question', async (req, res) => {
  if (req.body.question1) {
    Question.findOne().sort('-week').exec((err, doc) => {
      if (err) {
        console.log(err)
      } else {
        if (!err && doc.week >= getWeekNumber()) {
          lastWeek = doc.week + 1;
        } else {
          lastweek = doc.week
        }
        questionSubmission = {
          questions: [req.body.question1, req.body.question2],
          answers: [req.body.qanswer1, req.body.qanswer2],
          week: lastWeek
        }
        Question.create(questionSubmission, function (err, obj) {
          if (err) {
            console.log(err);
            res.render('form-submission', {
              layout: 'default-nos',
              status: {
                message: "Questions Couldn't be Submitted",
                image: "cross"
              },
              title: "Questions Couldn't be Submitted - Heisenberg's Corner"
            });
          } else {
            console.log(obj.id);
            res.render('form-submission', {
              layout: 'default-nos',
              status: {
                message: "Questions Successfully Submitted",
                image: "check"
              },
              title: "Questions Successfully Submitted - Heisenberg's Corner"
            });
          }
        });
      }
    });
  } else {
    if (req.body.quespass != 'snsnsteam.edu') {
      res.render('validation-form', {
        layout: 'default-nos',
        title: "Login - Heisenberg's Corner",
        invalid: "invalid",
        link: "submit-question"
      });
    } else {
      Question.findOne().sort('-week').exec((err, doc) => {
        if (!err && doc.week >= getWeekNumber()) {
          lastWeek = doc.week + 1;
        } else if (!err) {
          lastweek = doc.week
        } else {
          console.log(err);
        }
        res.render('question-form', {
          layout: 'default-nos',
          title: "Submit Questions - Heisenberg's Corner",
          week: lastWeek
        });
        req.session.userValidate = true
      });
    }
  }
});

router.get('/check-answers', (req, res) => {
  if (!req.session.userValidate) {
    res.render('validation-form', {
      layout: 'default-nos',
      title: "Login - Heisenberg's Corner",
      link: "check-answers"
    });
  } else {
    Question.findOne().sort('-week').exec((err, doc) => {
      if (!err && doc.week >= getWeekNumber()) {
        lastWeek = doc.week + 1;
      } else if (!err) {
        lastweek = doc.week
      } else {
        console.log(err);
      }
      res.render('answers-dashboard', {
        layout: 'default-nos',
        title: "Answers Dashboard - Heisenberg's Corner",
        week: lastWeek
      });
    });
  }
});

router.post('/check-answers', async (req, res) => {
  if (req.body.question1) {
    Question.findOne().sort('-week').exec((err, doc) => {
      if (err) {
        console.log(err)
      } else {
        if (!err && doc.week >= getWeekNumber()) {
          lastWeek = doc.week + 1;
        } else {
          lastweek = doc.week
        }
        questionSubmission = {
          questions: [req.body.question1, req.body.question2],
          answers: [req.body.qanswer1, req.body.qanswer2],
          week: lastWeek
        }
        Question.create(questionSubmission, function (err, obj) {
          if (err) {
            console.log(err);
            res.render('form-submission', {
              layout: 'default-nos',
              status: {
                message: "Questions Couldn't be Submitted",
                image: "cross"
              },
              title: "Questions Couldn't be Submitted - Heisenberg's Corner"
            });
          } else {
            console.log(obj.id);
            res.render('form-submission', {
              layout: 'default-nos',
              status: {
                message: "Questions Successfully Submitted",
                image: "check"
              },
              title: "Questions Successfully Submitted - Heisenberg's Corner"
            });
          }
        });
      }
    });
  } else {
    if (req.body.quespass != 'snsnsteam.edu') {
      res.render('validation-form', {
        layout: 'default-nos',
        title: "Login - Heisenberg's Corner",
        invalid: "invalid",
        link: "check-answers"
      });
    } else {
      Question.findOne().sort('-week').exec((err, doc) => {
        if (!err && doc.week >= getWeekNumber()) {
          lastWeek = doc.week + 1;
        } else if (!err) {
          lastweek = doc.week
        } else {
          console.log(err);
        }
        res.render('answers-dashboard', {
          layout: 'default-nos',
          title: "Answers Dashboard - Heisenberg's Corner",
          week: lastWeek
        });
        req.session.userValidate = true
      });
    }
  }
});

module.exports = router;