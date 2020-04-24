"use strict"
var expect = chai.expect;

function digits(text) {
    var i;
    var sum = 0;
    for (i=0;i<length(text);i++) {
        sum += parseInt(text[i]);
    }

    return sum;
}

function letters(text) {
    var i;
    var counter = 0;

    for  (i=0;i<length(text);i++) {
        if (typeof text[i] == char){
            counter++;
        }
    }

    return counter;
}

function sum(text, pr_nm) {
    return pr_sum+Number(text);
}

function sum(x,y) {
	return x+y;
}

var num = window.prompt("Podaj liczbę:");
var sum = 0;

while(num!=null){
    var digits = digits(num);
    var let = letters(num);
    sum = sum(num, sum);

    console.log('\t' + digits + '\t' + letters) + '\t' + sum;
}

describe('The sum() function', function() {
 it('Returns 4 for 2+2', function() {
   expect(sum(2,2)).to.equal(4);
 });
 it('Returns 0 for -2+2', function() {
   expect(sum(-2,2)).to.equal(0);
 });
});