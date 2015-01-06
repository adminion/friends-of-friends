
var FriendsOfFriends = require('../lib/')();

describe('FriendsOfFriends', function () {

	describe('.options', function () {
		var options = FriendsOfFriends.options;

		it('should be an object', function () {
			options.should.be.an.Object;
		});

		describe('.accountName', function () {
			var accountName = options.accountName;

			it('should a non-empty String', function () {
				accountName.should.be.a.String.and.not.be.empty;
			})
		})

		describe('.friendshipName', function () {
			var friendshipName = options.friendshipName;

			it('should be a non-empty String', function () {
				friendshipName.should.be.a.String.and.not.be.empty;
			})
		})
	})

	// check to see if friendship is a model
	describe('.friendship', function () {

		var Friendship = FriendsOfFriends.friendship;

		it('should be a function who\'s name is "model"', function () {
			Friendship.should.be.a.Function;
			Friendship.name.should.eql('model');
		})
	})

	describe('.plugin', function () {
		var plugin = FriendsOfFriends.plugin,
			name = 'friendshipPlugin';

		it('should be a function who\'s name is "' + name + '"', function () {
			plugin.should.be.a.Function.with.property('name', name);
		})
	});

	describe('.relationships', function () {
		var relationships = FriendsOfFriends.relationships;

		it('should an object', function () {
			relationships.should.be.an.Object;
		})

		describe('.names', function () {
			var names = relationships.names;

			var test = [
			    "NOT_FRIENDS",
			    "FRIENDS_OF_FRIENDS",
			    "FRIENDS"
			];

			var testStr = '[ ';

			test.forEach(function (testName, whichName) {
				testStr += testName 

				if (whichName < 2) {
					testStr += ', ';
				}
			});

			testStr += ']';

			it('should eql ' + testStr, function () {
				names.should.eql(test);
			});
		})

		describe('.values', function () {
			var values = relationships.values;

			var test = {
			    NOT_FRIENDS:            0,
			    FRIENDS_OF_FRIENDS:     1,
			    FRIENDS:                2
			};

			var testStr = '{ ';

			var whichValue = 0;

			for (value in test) {
				testStr += value + ': ' + test[value];
				
				if (whichValue < 2) {
					testStr += ', '
				}

				whichValue++;
			}

			testStr += '}';

			it('should eql ' + testStr, function () {
				values.should.eql(test);
			});
		})
	})
});