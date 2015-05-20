
var debug = require('debug')('friends-of-friends:tests');
var	mongoose = require('mongoose');
var should = require('should');

debug('mongoose', mongoose);

var FriendsOfFriends = require('../lib/');
var friendsOfFriends = new FriendsOfFriends(mongoose, {accountName: 'test-account'});

var tests = {
	friendship : require('./friendship'),
	plugin : require('./plugin')
}

describe('FriendsOfFriends', function () {
	it('should be a function called "FriendsOfFriends"', function (testComplete) {
		FriendsOfFriends.should.be.a.Function;
		FriendsOfFriends.should.have.a.property('name', 'FriendsOfFriends');
		testComplete();
	});
});

describe('friendOfFriends', function () {

	describe('#options', function () {
		var options = friendsOfFriends.options;

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
		var relationships = friendsOfFriends.relationships;

		var test = {
		    0:                  "NOT_FRIENDS",
		    1:                  "FRIENDS_OF_FRIENDS",
			2: 					"PENDING_FRIENDS",
			3: 					"FRIENDS",
		    NOT_FRIENDS:        0,
		    FRIENDS_OF_FRIENDS: 1,
		    PENDING_FRIENDS: 	2,
		    FRIENDS:            3
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

	describe('#Friendship', function (done) {
		var Friendship = friendsOfFriends.Friendship;

		it('should be a function named "model"', function (testComplete) {
	        Friendship.should.be.a.Function;
	        Friendship.should.have.a.property('name', 'model');

	        testComplete();

	    });
	})

	describe('#plugin', function (done) {
		it('should be a function called "friendshipPlugin"', function (testComplete) {
			Friendship.should.be.a.Function;
	        Friendship.should.have.a.property('name', 'model');

	        testComplete();	
		});
	})

	describe('#prototype', function () {
		describe('#get', function () {
			it('should get the given option from friendsOfFriends.options', function () {
				friendsOfFriends.get('accountName').should.equal(friendsOfFriends.options.accountName)				
			})
		})

		describe('#set', function () {

			it('should set the given option to friendsOfFriends.options', function () {
				var friendshipName = 'Friend-Records';

				friendsOfFriends.set('friendshipName', friendshipName)
				friendsOfFriends.options.friendshipName.should.equal(friendshipName)
			})
		})
	})
});

describe('Friendship', function () {
	tests.friendship(friendsOfFriends, mongoose)
});

describe('Account', function () {
	tests.plugin(friendsOfFriends, mongoose)
})
