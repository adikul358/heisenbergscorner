var express = require('express');
var router = express.Router();
// var questions = require('questionData')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage', {layout: 'home-default', question1: "ABCD", question2: "EFGH"});
});
router.post('/submit-answer/user-data', function(req, res, next) {
  res.render('user-form', {layout: 'default-nos'});
});
router.get('/', function(req, res, next) {
  res.render('homepage', {layout: 'home-default', question1: "ABCD", question2: "EFGH"});
});

module.exports = router;
