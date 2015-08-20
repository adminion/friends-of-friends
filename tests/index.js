
var debug = require('debug')('friends-of-friends:tests');
var	mongoose = require('mongoose');
var should = require('should');

debug('mongoose', mongoose);

var FriendsOfFriends = require('../lib/');
var friendsOfFriends = new FriendsOfFriends(mongoose, {personModelName: 'test-person'});

var PersonSchema = new mongoose.Schema({
	username: String,
	created: { type: Date, default: Date.now() }
});

PersonSchema.plugin(friendsOfFriends.plugin, friendsOfFriends.options);

var PersonModel = mongoose.model(friendsOfFriends.get('personModelName'), PersonSchema);

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

	it('should work with or without new', function (testComplete) {
		var withoutNew = FriendsOfFriends(mongoose, {personModelName: 'test-person'});
		withoutNew.should.have.a.property('Friendship');

		var withNew = new FriendsOfFriends(mongoose, {personModelName: 'test-person'});
		withNew.should.have.a.property('Friendship');

		testComplete();
	});
});

describe('friendOfFriends', function () {

	describe('#options', function () {
		var options = friendsOfFriends.options;

		it('should be an object', function () {
			options.should.be.an.Object;
		});

		describe('#personModelName', function () {
			var personModelName = options.personModelName;

			it('should a non-empty String', function () {
				personModelName.should.be.a.String.and.not.be.empty;
			})
		})

		describe('#friendshipModelName', function () {
			var friendshipModelName = options.friendshipModelName;

			it('should be a non-empty String', function () {
				friendshipModelName.should.be.a.String.and.not.be.empty;
			})
		})

		describe('#friendshipCollectionName', function () {
			var friendshipCollectionName = options.friendshipCollectionName;

			it('should be a non-empty String or undefined', function () {

				if (!friendshipCollectionName) {
					(friendshipCollectionName === undefined).should.be.true;
				} else {
					friendshipCollectionName.should.be.a.String.and.not.be.empty;
				}
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
		var plugin = friendsOfFriends.plugin;

		it('should be a function named "friendshipPlugin"', function (testComplete) {
			plugin.should.be.a.Function;
	        plugin.should.have.a.property('name', 'friendshipPlugin');

	        testComplete();	
		});
	})

	describe('#prototype', function () {
		describe('#get', function () {
			it('should get the given option from friendsOfFriends.options', function () {
				friendsOfFriends.get('personModelName').should.equal(friendsOfFriends.options.personModelName)
			})
		})

		describe('#set', function () {

			it('should set the given option to friendsOfFriends.options', function () {
				var defaultModelName = friendsOfFriends.get('friendshipModelName')

				var modifiedModelName = 'Friend-Records';

				friendsOfFriends.set('friendshipModelName', modifiedModelName)
				friendsOfFriends.options.friendshipModelName.should.equal(modifiedModelName)

				friendsOfFriends.set('friendshipModelName', defaultModelName);
			})
		})
	})
});

describe('Friendship', function () {
	tests.friendship(friendsOfFriends, mongoose)
});

describe('Person', function () {
	tests.plugin(friendsOfFriends, mongoose)
})
