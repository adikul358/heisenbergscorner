const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/hc-main', { useNewUrlParser: true }, (err) => {
//     if (!err) { console.log('MongoDB Connection Succeeded.') }
//     else { console.log('Error in DB connection : ' + err) }
// });
// mongoose.connect('mongodb://admin:adminsnsnsteam@153.92.5.101/hc-main?authSource=admin', {
mongoose.connect('mongodb://localhost:27017/hc-main', {
    useNewUrlParser: true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')

    } else {
        console.log('Error in DB connection : ' + err)
    }
});

require('./question.model');
require('./answer.model');