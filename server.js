require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const employeeController = require('./controllers/employeeController');
const indexRouter = require('./routes/index');

var app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/', indexRouter);