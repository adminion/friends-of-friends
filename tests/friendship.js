
var FriendsOfFriends = require('../lib/')(),
	dbURI    = 'mongodb://localhost/friends-of-friends-tests',
	should   = require('should'),
  	mongoose = require('mongoose'),
  	clearDB  = require('mocha-mongoose')(dbURI);

var Account,
	AccountSchema = new mongoose.Schema({username: String});

try {
	Account = mongoose.model('Account', AccountSchema);
}
catch (error) {
	Account = mongoose.model('Account')
}

var Friendship = FriendsOfFriends.friendship

var jeff = new Account({username: 'Jeff'}),
	zane = new Account({username: 'Zane'})

var docDescriptor = {requester: jeff._id, requested: zane._id}

describe('Friendship Model', function () {

	beforeEach(function(done) {
	    if (mongoose.connection.db) return done()

	    mongoose.connect(dbURI, done)

	})

	it('getRequests - get all requests involving a given user', function (done) {

		new Friendship(docDescriptor).save(function (err, friendship) {
			if (err) return done(err)
			friendship.should.be.ok

			Friendship.find(docDescriptor, function (err, friendship) {
				if (err) return done(err)

				friendship.should.be.ok

				Friendship.getRequests(jeff._id, function (err, friendships) {
					if (err) return done(err)

					friendships.sent.should.be.an.Array.with.length(1)
					friendships.received.should.be.an.Array.with.length(0)

					Friendship.getRequests(zane._id, function (err, friendships) {
						if (err) return done(err)

						friendships.sent.should.be.an.Array.with.length(0)
						friendships.received.should.be.an.Array.with.length(1)

						done()
					})
				})
			})
		})


	})

	it('getSentRequests - get requests the given user has sent', function (done) {

		new Friendship(docDescriptor).save(function (err, friendship) {
			if (err) return done(err)
			friendship.should.be.ok

			Friendship.getSentRequests(jeff._id, function (err, friendships) {
				if (err) return done(err)

				friendships.should.be.an.Array.with.length(1)

				Friendship.getSentRequests(zane._id, function (err, friendships) {
					if (err) return done(err)

					friendships.should.be.an.Array.with.length(0)

					done()
				})
			})
		})

	})

	it('getReceivedRequests - get requests received by the given user', function (done) {
		new Friendship(docDescriptor).save(function (err, friendship) {
			if (err) return done(err)
			friendship.should.be.ok

			Friendship.getReceivedRequests(jeff._id, function (err, friendships) {
				if (err) return done(err)

				friendships.should.be.an.Array.with.length(0)

				Friendship.getReceivedRequests(zane._id, function (err, friendships) {
					if (err) return done(err)

					friendships.should.be.an.Array.with.length(1)

					done()
				})
			})
		})
	})

	it('acceptRequest - accept a friend request', function (done) {

		new Friendship(docDescriptor).save(function (err, friendship) {
			if (err) return done(err)
			friendship.should.be.ok

			Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
				if (err) return done(err)

				done()
			})
		})

	})

	it('denyRequest - deny a friend request', function (done) {

		new Friendship(docDescriptor).save(function (err, friendship) {
			if (err) return done(err)
			friendship.should.be.ok

			Friendship.denyRequest(jeff._id, zane._id, function (err, deniedFriendship) {
				if (err) return done(err)

				done()
			})
		})
		
	})

	it('getFriends - get a list of ids of friends of an account', function (done) {
		new Friendship(docDescriptor).save(function (err, friendship) {
			if (err) return done(err)
			friendship.should.be.ok
	
			Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
				if (err) return done(err)

				Friendship.getFriends(jeff._id, function (err, friendIds) {
					if (err) return done(err)

					friendIds.should.be.an.Array.with.length(1)
					friendIds[0].toString().should.equal(zane._id.toString())

					Friendship.getFriends(zane._id, function (err, friendIds) {
						if (err) return done(err)

						friendIds.should.be.an.Array.with.length(1)
						friendIds[0].toString().should.equal(jeff._id.toString())
						
						done()	
					})
				})
			})
		})
	})

	it('getFriendsOfFriends - get a list of ids of this account\'s friends', function (done) {

		var sam = new Account({username: 'Sam'})

		// create jeff's request for zane's friendship
		new Friendship(docDescriptor).save(function (err, friendship) {
			if (err) return done(err)
			friendship.should.be.ok

			Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
				if (err) return done(err)
				acceptedFriendship.should.be.ok

				new Friendship({requester: zane._id, requested: sam._id}).save(function (err, sentRequest) {
					if (err) return done(err)
					sentRequest.should.be.ok

					Friendship.acceptRequest(zane._id, sam._id, function (err, acceptedFriendship) {
						if (err) return done(err)
						acceptedFriendship.should.be.ok

						Friendship.getFriendsOfFriends(jeff._id, function (err, friendsOfJeffsFriends) {
							if (err) return done(err)

							friendsOfJeffsFriends.should.be.an.Array.with.length(1);
							friendsOfJeffsFriends[0].toString().should.equal(sam._id.toString())

							Friendship.getFriendsOfFriends(sam._id, function (err, friendsOfSamsFriends) {
								if (err) return done(err)

								friendsOfSamsFriends.should.be.an.Array.with.length(1);
								friendsOfSamsFriends[0].toString().should.equal(jeff._id.toString())

								Friendship.getFriendsOfFriends(zane._id, function (err, friendsOfZanesFriends) {
									if (err) return done(err)

									friendsOfZanesFriends.should.be.an.Array.with.length(0);
									done();
								})
							})
						})
					})
				})
			})
		})
	})

})