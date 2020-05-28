const http = require('http');
const { parse } = require('querystring');
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

sequelize.sync()

const Teacher = sequelize.define('teacher', {
    id: { type: Sequelize.BIGINT, primaryKey: true },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING
    }
}, {
    // options
});

const Students = sequelize.define('students', {
    id: { type: Sequelize.BIGINT, primaryKey: true },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING
    }
}, {
    // options
});

const Subject = sequelize.define('subject', {
    id: { type: Sequelize.BIGINT, primaryKey: true },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    // options
});

const StudentSubject = sequelize.define('student_subject', {
    id: { type: Sequelize.BIGINT, primaryKey: true },
    studentId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    subjectId: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, {
    // options
});

const Mark = sequelize.define('mark', {
    id: { type: Sequelize.BIGINT, primaryKey: true },
    studentId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    mark: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    teacherId: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, {
    // options
});

const server = http.createServer(((req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
        if(body === ''){
            routes(req.method, req.url, {})(res)
        } else {
            routes(req.method, req.url, JSON.parse(body))(res)
        }
    });
}));

const routes = (method, url, body) => (response) => {
    //Queries specified in task
    console.log(url)
    if(method === "GET" && url.match("/students-by-subject/*") && url.split("/")[2]){
        console.log("studentsBySubjectHandler")
        studentsBySubjectHandler(url.split("/")[2])(response)
    } else if(method === "GET" && url.match("/marks-by-teacher/*") && url.split("/")[2]){
        console.log("marksByTeacherHandler")
        marksByTeacherHandler(url.split("/")[2])(response)
    }
    //crud routes
    else if(url.match("/teachers*")) {
        console.log("teachersRoutes")
        teachersRoutes(method, url, body)(response)
    }
    else if(url.match("/student_subject*")){
        console.log("studentSubjectRoutes")
        studentSubjectRoutes(method, url, body)(response)
    }
    else if(url.match("/students*")) {
        console.log("studentRoutes")
        studentRoutes(method, url, body)(response)
    }
    else if(url.match("/subjects*")){
        console.log("subjectRoutes")
        subjectRoutes(method, url, body)(response)
    }
    else if(url.match("/mark*")){
        console.log("markRoutes")
        markRoutes(method, url, body)(response)
    }
    else {
        response.write("Wrong routes")
        response.end()
    }
}

const studentsBySubjectHandler = (subjectId) => (response) => {
    StudentSubject.findAll({
        where: {
            subjectId: subjectId
        }
    }).then(e => {
        response.write(JSON.stringify(e))
        response.end()
    })
}

const marksByTeacherHandler = (teacherId) => (response) => {
    Mark.findAll({
        where: {
            teacherId: teacherId
        }
    }).then(e => {
        response.write(JSON.stringify(e))
        response.end()
    })
}

const teachersRoutes = (method, url, requestBody) => (response) => {
    crud(Teacher)(method, url, requestBody)(response)
}

const studentRoutes = (method, url, requestBody) => (response) => {
    crud(Students)(method, url, requestBody)(response)
}

const subjectRoutes = (method, url, requestBody) => (response) => {
    crud(Subject)(method, url, requestBody)(response)
}

const studentSubjectRoutes = (method, url, requestBody) => (response) => {
    crud(StudentSubject)(method, url, requestBody)(response)
}

const markRoutes = (method, url, requestBody) => (response) => {
    crud(Mark)(method, url, requestBody)(response)
}

const crud = (entity) => (method, url, requestBody) => (response) => {
    if(method === "GET" && url.split("/")[2]){
        const id = url.split("/")[2]
        entity.findByPk(id).then((e) => {
            response.write(JSON.stringify(e['dataValues']))
            response.end()
        })
    } else if(method === "GET"){
        entity.findAll().then((e) => {
            console.log(e)
            const x = e.map(s => s['dataValues'])
            console.log(x)
            response.write(JSON.stringify(x))
            response.end()
        })
    } else if(method === "PUT"){
        entity.create(requestBody).then(() => {
            entity.findByPk(requestBody['id']).then((e) => {
                response.write(JSON.stringify(e['dataValues']))
                response.end()
            })
        })
    } else if(method === "POST"){
        entity.update(requestBody, {
            where: {
                id: requestBody['id']
            }
        }).then(() => {
            entity.findByPk(requestBody['id']).then((e) => {
                response.write(JSON.stringify(e['dataValues']))
                response.end()
            })
        })
    } else if(method === "DELETE"){
        entity.destroy({
            where: {
                id: requestBody['id']
            }
        }).then(() => {
            response.end()
        })
    } else {
        response.write("Wrong method, expected: GET, PUT, POST, DELETE")
        response.end()
    }
}


server.listen(8080);
console.log("Server running")

module.exports = server;