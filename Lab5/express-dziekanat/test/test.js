const request = require('supertest')
const app = require('../app')

describe('This app', () => {
    var insertedStudent = {}
    var insertedTeacher = {}
    var insertedGrade = {}

    it('should create a new student', async () => {
        const res = await request(app).put('/students').send({name: "Student", surname: "Surname", password: "password"})
        expect(res.statusCode).toEqual(200)
        const got = JSON.parse(res.text)
        expect(got.name).toEqual("Student")
        insertedStudent = got
    })

    it('should create a teacher', async () => {
        const res = await request(app).put('/teachers').send({name: "Teacher", password: "password"})
        expect(res.statusCode).toEqual(200)
        const got = JSON.parse(res.text)
        expect(got.name).toEqual("Teacher")
        insertedTeacher = got
    })

    it('should allow teacher to grade student', async () => {
        const res = await request(app).put('/teachers/marks').send({
            id: insertedTeacher.id,
            password: insertedTeacher.password,
            studentId: insertedStudent.id,
            subject: "Maths",
            mark: 5
        })
        expect(res.statusCode).toEqual(200)
        const got = JSON.parse(res.text)
        expect(got["Maths"][0]["mark"]).toEqual(5)
        insertedGrade = got["Maths"][0]
    })

    it('should allow student to see marks', async () => {
        const res = await request(app).post('/students').send({
            id: insertedStudent.id,
            password: insertedStudent.password
        })
        expect(res.statusCode).toEqual(200)
        const got = JSON.parse(res.text)
        expect(got["Maths"][0]["mark"]).toEqual(5)
    })

    it('should allow teacher to see marks', async () => {
        const res = await request(app).post('/teachers/marksShow').send({
            id: insertedTeacher.id,
            password: insertedTeacher.password,
            studentId: insertedStudent.id
        })
        expect(res.statusCode).toEqual(200)
        const got = JSON.parse(res.text)
        expect(got["Maths"][0]["mark"]).toEqual(5)
    })

    it('should allow teacher to update a mark', async () => {
        const res = await request(app).post('/teachers/marks').send({
            id: insertedTeacher.id,
            password: insertedTeacher.password,
            studentId: insertedStudent.id,
            markId: insertedGrade.id,
            subject: "Maths",
            mark: 4
        })
        expect(res.statusCode).toEqual(200)
        const got = JSON.parse(res.text)
        expect(got["Maths"].length).toEqual(1)
        expect(got["Maths"][0]["mark"]).toEqual(4)
    })

    it('should allow teacher to see updated marks', async () => {
        const res = await request(app).post('/teachers/marksShow').send({
            id: insertedTeacher.id,
            password: insertedTeacher.password,
            studentId: insertedStudent.id
        })
        expect(res.statusCode).toEqual(200)
        const got = JSON.parse(res.text)
        expect(got["Maths"].length).toEqual(1)
        expect(got["Maths"][0]["mark"]).toEqual(4)
    })

    it('should allow teacher to delete a mark', async () => {
        const res = await request(app).delete('/teachers/marks').send({
            id: insertedTeacher.id,
            password: insertedTeacher.password,
            studentId: insertedStudent.id,
            markId: insertedGrade.id,
            subject: "Maths",
        })
        expect(res.statusCode).toEqual(200)
        const got = JSON.parse(res.text)
        expect(got["Maths"].length).toEqual(0)
    })

    it('should allow teacher to see that mark was deleted', async () => {
        const res = await request(app).post('/teachers/marksShow').send({
            id: insertedTeacher.id,
            password: insertedTeacher.password,
            studentId: insertedStudent.id
        })
        expect(res.statusCode).toEqual(200)
        const got = JSON.parse(res.text)
        expect(got["Maths"].length).toEqual(0)
    })

    it('should not allow for unauthenticated access', async () => {
        const res = await request(app).post('/students').send({
            id: insertedStudent.id,
            password: "wrong password"
        })
        expect(res.statusCode).toEqual(400)
    })
})