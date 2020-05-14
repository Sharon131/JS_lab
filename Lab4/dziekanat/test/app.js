let chai = require('chai');
let chaiHttp = require('chai-http');
let assert = require('assert')
let should = chai.should();
chai.use(chaiHttp)
const url = 'localhost:8080'

const people = ["students", "teachers"]

describe('CRUD tests', () => {
    for(let person of people){
        let personData = {
            id: 1,
            firstName: 'Jan',
            lastName: 'Kowalski'
        }
        it('/PUT ' + person, (done) => {
            chai.request(url).put('/' + person).send(personData).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                assert.equal(res.body["id"], personData.id)
                assert.equal(res.body["firstName"],personData.firstName)
                assert.equal(res.body["lastName"], personData.lastName)
                done()
            })
        })

        it('/GET ' + person, (done) => {
            chai.request(url).get('/' + person + '/' + personData.id).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                assert.equal(res.body["id"], personData.id)
                assert.equal(res.body["firstName"],personData.firstName)
                assert.equal(res.body["lastName"], personData.lastName)
                done()
            })
        })

        it('/POST ' + person, (done) => {
            let updatedPerson = {
                id: personData.id,
                firstName: personData.firstName,
                lastName: personData.lastName + " update"
            }
            chai.request(url).post('/' + person).send(updatedPerson).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                assert.equal(res.body["id"], updatedPerson.id)
                assert.equal(res.body["firstName"],updatedPerson.firstName)
                assert.equal(res.body["lastName"], updatedPerson.lastName)
                done()
            })
        })

        it('/DELETE ' + person, (done) => {
            chai.request(url).delete('/' + person ).send({id: personData.id}).end((err, res) => {
                res.should.have.status(200);
                done()
            })
        })
    }

    it('/PUT students_by_subject', (done) => {
        let student1 = {
            id: 1,
            firstName: 'Jan',
            lastName: 'Kowalski'
        }
        chai.request(url).put('/students').send(student1).end((err, res) => {
            res.should.have.status(200);
        });

        let subject1 = {
            id: 1,
            name: 'Science'
        }

        chai.request(url).put('/subject').send(subject1).end((err, res) => {
            res.should.have.status(200);
        });

        let student_subject1 = {
            id: 1,
            studentId: 1,
            subjectId: 1,
        }

        chai.request(url).put('/student_subject').send(student_subject1).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            assert.equal(res.body["id"], student_subject1.id)
            assert.equal(res.body["studentId"], student_subject1.studentId)
            assert.equal(res.body["subjectId"], student_subject1.subjectId)
            done();
        });

    })

    it ('/GET student-by-subject', (done) => {

        chai.request(url).get('/students-by-subject/1').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            assert.equal(res.body[0]["id"], 1)
            assert.equal(res.body[0]["studentId"],1)
            assert.equal(res.body[0]["subjectId"], 1)
            done()
        })
    })

    it('/POST student_subject', (done) => {
        let subject2 = {
            id: 2,
            name: 'Math'
        }

        chai.request(url).put('/subject').send(subject2).end((err, res) => {
            res.should.have.status(200);
        });

        let student_subject_updt = {
            id: 1,
            studentId: 1,
            subjectId: 2
        }

        chai.request(url).post('/student_subject').send(student_subject_updt).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            assert.equal(res.body["id"], student_subject_updt.id)
            assert.equal(res.body["studentId"], student_subject_updt.studentId)
            assert.equal(res.body["subjectId"], student_subject_updt.subjectId)
            done()
        })

    })

    it('/DELETE student_subject', (done) => {
        chai.request(url).delete('/student_subject' ).send({id: 1}).end((err, res) => {
            res.should.have.status(200);
            done()
        })

    })

    it('/PUT mark', (done) => {
        let teacher1 = {
            id: 1,
            firstName: "Jan",
            lastName: "Kowalski"
        }

        chai.request(url).put('/teachers' ).send(teacher1).end((err, res) => {
            res.should.have.status(200);
        })

        let mark1 = {
            id: 1,
            studentId: 1,
            mark: 3,
            teacherId: 1
        }

        chai.request(url).put('/mark' ).send(mark1).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            assert.equal(res.body["id"], mark1.id)
            assert.equal(res.body["studentId"], mark1.studentId)
            assert.equal(res.body["mark"], mark1.mark)
            assert.equal(res.body["teacherId"], mark1.teacherId)
            done();
        })

    })

    it('/GET mark-by-teacher', (done) => {
        chai.request(url).get('/marks-by-teacher/1' ).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            assert.equal(res.body[0]["id"], 1)
            assert.equal(res.body[0]["studentId"], 1)
            assert.equal(res.body[0]["mark"], 3)
            assert.equal(res.body[0]["teacherId"], 1)
            done();
        })
    })
})