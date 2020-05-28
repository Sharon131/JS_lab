//Source:  https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/
var supertest = require("supertest");
var express = require('express')
const assert = require('assert');

const app = require('../app3.js');
const agent = supertest.agent('localhost:3001');
// This agent refers to PORT where program is runninng.

// UNIT test begin
describe('POST /num', function () {

    it('should add 1+2', (done) => {
        agent.post('/num').send([{ operation: '+', x: 1, y: 2 }]).expect(200).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.text, '<h2>1 + 2 = 3</h2>');
            return done();
        })
    })
    it('should multiply 1*2', (done) => {
        agent.post('/num').send([{ operation: '*', x: 1, y: 2 }]).expect(200).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.text, '<h2>1 * 2 = 2</h2>');
            return done();
        })
    })
    it('should div 2/1', (done) => {
        agent.post('/num').send([{ operation: '/', x: 2, y: 1 }]).expect(200).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.text, '<h2>2 / 1 = 2</h2>');
            return done();
        })
    })
    it('should substract 2-1', (done) => {
        agent.post('/num').send([{ operation: '-', x: 2, y: 1 }]).expect(200).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.text, '<h2>2 - 1 = 1</h2>');
            return done();
        })
    })

    it('should add, subtract, multiply and div 2 and 1', (done) => {
        agent.post('/num').send([{ operation: '+', x: 2, y: 1 }, {operation: '-', x:2, y:1}, {operation: '*', x:2, y:1}, {operation: '/', x:2, y:1}])
        .expect(200).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.text, '<h2>2 + 1 = 3</h2><h2>2 - 1 = 1</h2><h2>2 * 1 = 2</h2><h2>2 / 1 = 2</h2>');
        })
        return done();
    })

});

