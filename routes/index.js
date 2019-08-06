var express = require('express');
var router = express.Router();
var questions = require('questionData')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage', {layout: 'default', question1: "ABCD", question2: "EFGH"});
});

module.exports = router;
