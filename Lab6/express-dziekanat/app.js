var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/dziekant";
const client = new MongoClient(uri, { useNewUrlParser: true });

const ID = function () {
  return Math.random().toString(10).substr(2, 9);
};

function withMongo(body) {
  client.connect(err => {
    if(err) { throw err }
    const db = client.db('dziekant')
    body(db)
  });
}

/* students routes */
const studentRoutes = express.Router();
studentRoutes.post('/', function(req, res, next) {
  console.log('student by id', req.body)
  withMongo(db => {
    const collection = db.collection('students')
    authenticateStudent(req.body.id, req.body.password)(db).then(authSucces => {
      if(authSucces){
        return collection.findOne({id: req.body.id}).then(found => res.send(JSON.stringify(found)))
      } else {
        next(createError(400))
      }
    })
  })
}).put('/', function (req, res, next) {
  console.log('create student', req.body)
  withMongo(db => {
    const collection = db.collection('students')
    const entity = {
      id: ID(),
      ...req.body
    }
    collection.insertOne(entity).then(() => {
      res.send(JSON.stringify(entity))
    })
  })
}).post('/taken-logins', function (req, res, next) {
  withMongo(db => {
    const collection = db.collection('students')
    collection.find({}).toArray().then((entities) => {
      let phrase = '';
      if(req.body.search) {
        phrase = req.body.search
      }

      res.send(JSON.stringify(entities.map(e => e['login']).filter(e => e.startsWith(phrase))))
    })
  })
}).post('/by-name', function (req, res, next) {
  withMongo(db => {
    const collection = db.collection('students')
    collection.find({}).toArray().then((entities) => {
      let phrase = '';
      if(req.body.search) {
        phrase = req.body.search
      }

      console.log('search:', phrase, req.body)
      res.send(JSON.stringify(entities.filter(e => e['surname'].startsWith(phrase))))
    })
  })
});

/* teacher routes */
var teacherRoutes = express.Router();
teacherRoutes.post('/marksShow', function(req, res, next) {
  console.log('teacher: get student marks', req.body)
  withMongo(db => {
    const collection = db.collection('students')
    authenticateTeacher(req.body.id, req.body.password)(db).then(authSuccess => {
      if(authSuccess){
        collection.findOne({id: req.body.studentId}).then(found => res.send(JSON.stringify(found)))
      } else {
        next(createError(400))
      }
    })
  })
}).put('/marks', function(req, res, next){
  console.log('put on marks', req.body)
  withMongo(db => {
    const collection = db.collection('students')
    authenticateTeacher(req.body.id, req.body.password)(db).then(authSuccess => {
      if(authSuccess){
        collection.findOne({id: req.body.studentId}).then(found => {
          if(found[req.body.subject]){
            found[req.body.subject].push({id: ID(), mark: req.body.mark})
            collection.deleteOne({id : req.body.studentId}).then(() => {
              collection.insertOne(found).then(returned => {
                res.send(JSON.stringify(found))
              })
            })
          } else {
            found[req.body.subject] = [{id: ID(), mark: req.body.mark}]
            collection.deleteOne({ id: req.body.studentId }).then(() => {
              collection.insertOne(found).then(returned => {
                res.send(JSON.stringify(found))
              })
            })
          }
        })
      } else {
        next(createError(400));
      }
    })
  })
}).post('/marks', function(req, res, next){
  console.log('post on marks', req.body)
  withMongo(db => {
    const collection = db.collection('students')
    authenticateTeacher(req.body.id, req.body.password)(db).then(authSuccess => {
      if(authSuccess){
        collection.findOne({id: req.body.studentId}).then(found => {
          found[req.body.subject] = found[req.body.subject].filter(mark => mark.id !== req.body.markId)
          found[req.body.subject].push({id: req.body.markId, mark: req.body.mark})
          collection.deleteOne({id: req.body.studentId}).then(returned => {
            collection.insertOne(found).then(returned => {
              res.send(found)
            })
          })
        })
      } else {
        next(createError(400));
      }
    })
  })
}).delete('/marks', function(req, res, next){
  console.log('delete on marks', req.body)
  withMongo(db => {
    const collection = db.collection('students')
    authenticateTeacher(req.body.id, req.body.password)(db).then(authSuccess => {
      if(authSuccess){
        collection.findOne({id: req.body.studentId}).then(found => {
          found[req.body.subject] = found[req.body.subject].filter(mark => mark.id !== req.body.markId)
          collection.deleteOne({id: req.body.studentId}).then(returned => {
            collection.insertOne(found).then(returned => {
              res.send(found)
            })
          })
        })
      } else {
        next(createError(400));
      }
    })
  })
}).put('/', function (req, res, next) {
  withMongo(db => {
    const collection = db.collection('teachers')
    const entity = {
      id: ID(),
      ...req.body
    }
    collection.insertOne(entity).then(() => {
      res.send(JSON.stringify(entity))
    })
  })
})

const authenticateTeacher = (id, password) => (db) => {
  const collection = db.collection('teachers')
  return collection.findOne({id: id}).then(found => {
    return found && found.password === password
  })
}

const authenticateStudent = (id, password) => (db) => {
  const collection = db.collection('students')
  return collection.findOne({id: id}).then(found => {
    return found && found.password === password
  })
}

const formsRoutes = express.Router();
formsRoutes.get('/create-student', function (req, res, next) {
  res.sendFile('views/create-student.html', {root: __dirname })
}).get('/create-teacher', function (req, res, next) {
      res.sendFile('views/create-teacher.html', {root: __dirname })
}).get('/grade-student', function (req, res, next) {
    res.sendFile('views/grade-student.html', {root: __dirname })
}).get('/student-grades', function (req, res, next) {
      res.sendFile('views/student-grades.html', {root: __dirname })
    })
    .get('/teacher-see-grades', function (req, res, next) {
  res.sendFile('views/teacher-see-grades.html', {root: __dirname })
})
    .get('/teacher-update-grade', function (req, res, next) {
  res.sendFile('views/teacher-update-grade.html', {root: __dirname })
})
    .get('/teacher-delete-grade', function (req, res, next) {
      res.sendFile('views/teacher-delete-grade.html', {root: __dirname })
})

app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);
app.use('/forms', formsRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
