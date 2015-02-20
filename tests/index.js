
var debug = require('debug')('friends-of-friends:tests'),
	mongoose = require('mongoose'),
	should = require('should');

var FriendsOfFriends = require('../lib/')();

var tests = {
	friendship : require('./friendship'),
	plugin : require('./plugin')
}

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

	describe('#relationships', function () {
		var relationships = FriendsOfFriends.relationships;

		var test = {
		    0:                      "NOT_FRIENDS",
		    1:                      "FRIENDS_OF_FRIENDS",
			1.5: 					"PENDING_FRIENDS",
			2: 						"FRIENDS",
		    NOT_FRIENDS:            0,
		    FRIENDS_OF_FRIENDS:     1,
		    PENDING_FRIENDS: 		1.5,
		    FRIENDS:                2
		};

		var testStr = '{ ';

		var whichValue = 0;

		for (value in test) {
			testStr += value + ': ' + test[value];
			
			if (whichValue < 7) {
				testStr += ', '
			}

			whichValue++;
		}

		testStr += '}';

		it('should eql ' + testStr, function () {
			relationships.should.eql(test);
		});
	})


	// check to see if friendship is a model
	describe('#friendship', function (done) {

		tests.friendship()
	})

	describe('#plugin', function (done) {
		tests.plugin()
	})

	describe('#prototype', function () {
		describe('#get', function () {
			it('should get the given option from FriendsOfFriends.options', function () {
				FriendsOfFriends.get('accountName').should.equal(FriendsOfFriends.options.accountName)				
			})
		})

		describe('#set', function () {

			it('should set the given option to FriendsOfFriends.options', function () {
				var friendshipName = 'Friend-Records';

				FriendsOfFriends.set('friendshipName', friendshipName)
				FriendsOfFriends.options.friendshipName.should.equal(friendshipName)
			})
		})
	})
});