// No use of any template system
var express = require('express'),
    logger = require('morgan');
var app = express();
var x = 1;
var y = 2;

// Determining the contents of the middleware stack
app.use(logger('dev'));                         // Place an HTTP request recorder on the stack — each request will be logged in the console in 'dev' format
app.use(express.static(__dirname + '/public')); // Place the built-in middleware 'express.static' — static content (files .css, .js, .jpg, etc.) will be provided from the 'public' directory

app.get('/add/:x/:y', (req, res) => {
    res.send('<h2>' + req.params.x+' + '+req.params.y+' = '+String(parseInt(req.params.x)+parseInt(req.params.y))+'</h2>');
})

// Route definitions
app.get('/', function (req, res) {     // The first route
    res.send('<h2>' + String(x) + ' + ' + String(y) + ' = ' + String(eval(x+y)) + '</h2>'); // Send a response to the browser
    //res.send('<h2>' + String(x) + ' + ' + String(y) + ' = ' + String(eval(x+y)) + '</h2>');
})

// The application is to listen on port number 3000
app.listen(3000, function () {
    console.log('The application is available on port 3000');
});

exports.app = app