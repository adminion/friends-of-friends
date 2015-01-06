
var mongoose = require('mongoose'),
	should = require('should');

var tests = ['main', 'friendship', 'plugin'];

tests.forEach(function (test) {
	require('./' + test);
})