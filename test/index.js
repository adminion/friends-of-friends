
var assert = require('assert'),
	FriendsOfFriends = require('../lib/')();

describe('FriendsOfFriends', function () {

	describe('.options', function () {
		var options = FriendsOfFriends.options;

		it('is a plain object', function () {
			assert.equal("[object Object]", Object.prototype.toString.call(options))
		})

		describe('.accountName', function () {
			var accountName = options.accountName;

			it('is a String', function () {
				assert.equal('string', typeof accountName)
			})

			it('is not null', function () {
				assert.notEqual(null, accountName)
			})
		})

		describe('.friendshipName', function () {
			var friendshipName = options.friendshipName;

			it('is a String', function () {
				assert.equal('string', typeof friendshipName)
			})

			it('is not null', function () {
				assert.notEqual(null, friendshipName)
			})
		})
	})

	// check to see if friendship is a model
	describe('.friendship', function () {

		var friendship = FriendsOfFriends.friendship;

		it('is a function', function () {
			assert.equal('function', typeof friendship);
		})

		it("who's name is 'model'", function () {
			assert.equal('model', friendship.name)
		})

	})

	describe('.plugin', function () {
		var plugin = FriendsOfFriends.plugin,
			name = 'friendshipPlugin';

		it('is a function', function () {
			assert.equal('function', typeof plugin)
		})

		it("who's name is '" + name + "'", function () {
			assert.equal(name, plugin.name);
		})

	});

	describe('.relationships', function () {
		var relationships = FriendsOfFriends.relationships;

		it('is a plain object', function () {
			assert.equal("[object Object]", Object.prototype.toString.call(relationships))
		})

		describe('.names', function () {
			var names = relationships.names;

			var test = [
			    "NOT_FRIENDS",
			    "FRIENDS_OF_FRIENDS",
			    "FRIENDS"
			];

			names.forEach(function (name, index) {

				it(index + ' should equal "' + test[index] + '"', function () {
					assert.equal(test[index], name);
				})
			});
		})

		describe('.values', function () {
			var values = relationships.values;

			var test = {
			    NOT_FRIENDS:            0,
			    FRIENDS_OF_FRIENDS:     1,
			    FRIENDS:                2
			};

			for (index in values) {
				it(index + ' should equal "' + test[index] + '"', function () {
					assert.equal(test[index], values[index]);
				})
			}
		})
	})
});

// var 