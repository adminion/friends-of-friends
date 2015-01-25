
var debug = require('debug')('friends-of-friends:tests'),
	mongoose = require('mongoose'),
	should = require('should');

var FriendsOfFriends = require('../lib/')();

var friendship = require('./friendship'),
	plugin = require('./plugin');

describe('FriendsOfFriends', function () {

	describe('#options', function () {
		var options = FriendsOfFriends.options;

		it('should be an object', function () {
			options.should.be.an.Object;
		});

		describe('#accountName', function () {
			var accountName = options.accountName;

			it('should a non-empty String', function () {
				accountName.should.be.a.String.and.not.be.empty;
			})
		})

		describe('#friendshipName', function () {
			var friendshipName = options.friendshipName;

			it('should be a non-empty String', function () {
				friendshipName.should.be.a.String.and.not.be.empty;
			})
		})
	})

	// check to see if friendship is a model
	describe('#friendship', function () {

		friendship()
	})

	describe('#plugin', function () {
		plugin()
	});

	describe('#relationships', function () {
		var relationships = FriendsOfFriends.relationships;

		var test = {
			0: 						"NOT_FRIENDS",
			1: 						"FRIENDS_OF_FRIENDS",
			2: 						"FRIENDS",
		    NOT_FRIENDS:            0,
		    FRIENDS_OF_FRIENDS:     1,
		    FRIENDS:                2
		};

		var testStr = '{ ';

		var whichValue = 0;

		for (value in test) {
			testStr += value + ': ' + test[value];
			
			if (whichValue < 5) {
				testStr += ', '
			}

			whichValue++;
		}

		testStr += '}';

		it('should eql ' + testStr, function () {
			relationships.should.eql(test);
		});
	})
});