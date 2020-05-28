// No use of any template system
var express = require('express'),
    logger = require('morgan');
var app = express();
const bodyParser = require('body-parser')

// Determining the contents of the middleware stack
app.use(logger('dev'));                         // Place an HTTP request recorder on the stack — each request will be logged in the console in 'dev' format
app.use(express.static(__dirname + '/public')); // Place the built-in middleware 'express.static' — static content (files .css, .js, .jpg, etc.) will be provided from the 'public' directory

app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  
app.use(bodyParser.json())


app.post('/num', (req, res) => {
    console.log(req.body)

    for (i in req.body) {
        const json = req.body[i]
        if (json['operation'] === '+') {
            res.write('<h2>'+String(json['x'])+' + '+String(json['y'])+' = '+ String(json['x']+json['y'])+'</h2>');
        } else if (json['operation'] === '-') {
            res.write('<h2>'+String(json['x'])+' - '+String(json['y'])+' = '+ String(json['x']-json['y'])+'</h2>');
        } else if (json['operation'] === '*') {
            res.write('<h2>'+String(json['x'])+' * '+String(json['y'])+' = '+ String(json['x']*json['y'])+'</h2>');
        } else if (json['operation'] === '/') {
            res.write('<h2>'+String(json['x'])+' / '+String(json['y'])+' = '+ String(json['x']/json['y'])+'</h2>');
        } else {
            console.log(json['operation'] + 'is not defined.');
        }
    }
    res.send()
    
})

// The application is to listen on port number 3001
app.listen(3001, function () {
    console.log('The application is available on port 3001');
});

exports.app = app