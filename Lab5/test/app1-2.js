//Source:  https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/
var supertest = require("supertest");
var express = require('express')
const assert = require('assert');

const app = require('../app1.js');
const agent = supertest.agent('localhost:3000');
// This agent refers to PORT where program is runninng.

// UNIT test begin
describe('GET /', function() {
      
      it('should add 1+2', (done) => {
            agent.get('/').send().expect(200).end((err, res) => {
                  if (err) {
                        return done(err);
                  }
                  assert.equal(res.text, '<h2>1 + 2 = 3</h2>');
                  return done();
            })
      })

      it('should add x+y', (done) => {
            agent.get('/add/10/5').send().expect(200).end((err, res) => {
                  if (err) {
                        return done(err);
                  }
                  assert.equal(res.text, '<h2>10 + 5 = 15</h2>');
                  return done();
            })
      })
});

