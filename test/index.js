
var assert = require('assert'),
	FriendsOfFriends = require('../lib/')();

describe('FriendsOfFriends', function () {
	describe('#options', function () {
		it('should be an object with 2 string properties: accountName and friendshipName', function () {
			assert.equal('string', typeof FriendsOfFriends.options.accountName)
			assert.equal('string', typeof FriendsOfFriends.options.friendshipName)
		})
	})
	// @TODO: more stuff
})