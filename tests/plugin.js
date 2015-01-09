var FriendsOfFriends = require('../lib/')(),
	dbURI    = 'mongodb://localhost/friends-of-friends-tests',
	should   = require('should'),
  	mongoose = require('mongoose'),
  	clearDB  = require('mocha-mongoose')(dbURI, { noClear: true });

var Account,
	AccountSchema = new mongoose.Schema({username: String});

AccountSchema.plugin(FriendsOfFriends.plugin);

try {
	Account = mongoose.model('Account', AccountSchema);
}
catch (error) {
	Account = mongoose.model('Account')
}

var jeff = new Account({username: 'Jeff'}),
	zane = new Account({username: 'Zane'})

var docDescriptor = {requester: jeff._id, requested: zane._id}

module.exports = function () {
	describe('model statics', function () {
		it('relationships - default relationship constants')
		it('friendRequest - send a friend request to a another user')
		it('getRequests - get all friend requests for a given user')
		it('getSentRequests - get requests the given user has sent')
		it('getReceivedRequests - get requests received by the given user')
		it('acceptRequest - accept a friend request ')
		it('denyRequest - deny a friend request')
		it('endFriendship - end a friendship between two accounts')
		it('getFriends - get all friends of an account')
		it('getFriendsOfFriends - get friends of this account\'s friends')
		it('getNonFriends - get all users that are not the given user\'s friends or friendsOfFriends')
		it('areFriends - determine if accountId2 is a friend of accountId1')
		it('areFriendsOfFriends - determine if accountId1 and accountId2 have any common friends')
		it('getFriendship - get the friendship document itself')
		it('getRelationship - get the numeric relationship between two users')
	})

	describe('document methods', function () {
		it('friendRequest - send a request to another account')
		it('getRequests - get friend requests')
		it('getSentRequests - get friend requests the user has sent')
		it('getReceivedRequests - get friend requests the user has received')
		it('acceptRequest - accept a friend request received from the specified user')
		it('denyRequest - deny a friend request received from the specified user')
		it('endFriendship - end a friendship with the specified user')
		it('getFriends - get this user\'s friends')
		it('getFriendsOfFriends - get friends of this user\'s friends')
		it('getNonFriends - get accounts which are not this user\'s friends')
		it('isFriend - determine if this document is friends with the specified account')
		it('isFriendOfFriends - determine if this document shares any friends with the specified account')
		it('getFriendship - get the friendship document of this document and the specified account')
		it('getRelationship - get the relationship of this document and the specified account')
	})
}
