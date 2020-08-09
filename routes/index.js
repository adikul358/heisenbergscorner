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

const groupBy = (key, array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

function getDaysValues(doc) {
  dateValues = {}
  for (var currWeek in doc) {
    weekAnswers = doc[currWeek];
    weekAnswersValue = [0,0,0,0,0,0,0];
    for (var currAns in weekAnswers) {
      timestamp = weekAnswers[currAns]['_id'].toString().substring(0,8);
      day = new Date( parseInt( timestamp, 16 ) * 1000 )
      // day = globalWeekDays[day.getDay()];
      weekAnswersValue[day.getDay()]++;
    }
    sunElement = weekAnswersValue.shift();
    weekAnswersValue.push(sunElement)
    dateValues[currWeek] = weekAnswersValue;
 }
 return dateValues
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
    title: "Enter Your Details - Heisenberg's Corner",
    scripts: ["/js/notAStudent.js"]
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
        lastWeek = getWeekNumber();
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
          lastWeek = getWeekNumber();
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
          lastWeek = getWeekNumber()
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
  if (!req.session.userValidate && process.env.NODE_ENV == 'production') {
    res.render('validation-form', {
      layout: 'default-nos',
      title: "Login - Heisenberg's Corner",
      link: "check-answers"
    });
  } else {
    Answer.find({
      state: null
    }).sort('-week').exec((err, doc) => {
      Question.find({}).select('week answers').exec((err2, doc2) => {
        ansData = groupBy('week', doc);
        quesData = groupBy('week', doc2);
        for (var i in ansData) {
          ansData[i]['qanswers'] = quesData[i][0]['answers'];
        }
        res.render('answers-dashboard', {
          layout: 'default-nos-admin',
          title: "Answers Dashboard - Heisenberg's Corner",
          data: ansData,
          scripts: ['/js/answerCheck.js']
        });
        req.session.userValidate = true
      });
    });
  }
});

router.post('/check-answers', async (req, res) => {
  if (req.body.quespass != 'snsnsteam.edu') {
    res.render('validation-form', {
      layout: 'default-nos',
      title: "Login - Heisenberg's Corner",
      invalid: "invalid",
      link: "check-answers"
    });
  } else {
    Answer.find({
      state: null
    }).sort('-week').exec((err, doc) => {
      Question.find({}).select('week answers').exec((err2, doc2) => {
        ansData = groupBy('week', doc);
        quesData = groupBy('week', doc2);
        for (var i in ansData) {
          ansData[i]['qanswers'] = quesData[i][0]['answers'];
        }
        res.render('answers-dashboard', {
          layout: 'default-nos-admin',
          title: "Answers Dashboard - Heisenberg's Corner",
          data: ansData,
          scripts: ['/js/answerCheck.js']
        });
        req.session.userValidate = true
      });
    });
  }
});

router.post('/check-answers/changes', async (req, res) => {
  res.send(req.body.changes);
});


router.get('/weekly-analysis', (req, res) => {
  if (!req.session.userValidate && process.env.NODE_ENV == 'production') {
    res.render('validation-form', {
      layout: 'default-nos',
      title: "Login - Heisenberg's Corner",
      link: "check-answers"
    });
  } else {
    Answer.find().exec((err, doc) => {
      res.render('weekly-analysis', {
        layout: 'default-nos-admin',
        title: "Weekly Analysis - Heisenberg's Corner",
        data: groupBy('week', doc),
        scripts: ['https://cdn.jsdelivr.net/npm/chart.js@2.8.0', '/js/weeklyCharts.js']
      });
      req.session.userValidate = true
    });
  }
});

router.post('/weekly-analysis', async (req, res) => {
  if (req.body.quespass != 'snsnsteam.edu') {
    res.render('validation-form', {
      layout: 'default-nos',
      title: "Login - Heisenberg's Corner",
      invalid: "invalid",
      link: "weekly-analysis"
    });
  } else {
    Answer.find().exec((err, doc) => {
      res.render('weekly-analysis', {
        layout: 'default-nos-admin',
        title: "Weekly Analysis - Heisenberg's Corner",
        data: groupBy('week', doc),
        scripts: ['https://cdn.jsdelivr.net/npm/chart.js@2.8.0', '/js/weeklyCharts.js']
      });
      req.session.userValidate = true
    });
  }
});

router.get('/weekly-analysis-data', (req, res) => {
  if (!req.session.userValidate && process.env.NODE_ENV == 'production') {
    res.send({error: "User not validated"});
  } else {
    Answer.find().sort('-week').exec((err, doc) => {
      if (err) {
        res.send(err);
      } else {
        // res.send(doc);
        res.send(getDaysValues(groupBy('week', doc)));
      }
    });
  }
});

module.exports = router;