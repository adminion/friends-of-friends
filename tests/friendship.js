
var FriendsOfFriends = require('../lib/')(),
	dbURI    = 'mongodb://localhost/friends-of-friends-tests',
	should   = require('should'),
  	mongoose = require('mongoose'),
  	clearDB  = require('mocha-mongoose')(dbURI, { noClear: true });

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

module.exports = function () {

	describe('model statics', function () {

		beforeEach(function (done) {
		    if (mongoose.connection.db) return done()

		   	mongoose.connect(dbURI,done)

		})

		afterEach(function (done) {
			clearDB(done)
		})

		it('getRequests - get all requests involving a given user', function (done) {

			// create jeff's request for zane's frienship
			new Friendship(docDescriptor).save(function (err, pendingFriendship) {
				if (err) return done(err)

				pendingFriendship.should.have.a.property('requester', jeff._id)
				pendingFriendship.should.have.a.property('requested', zane._id)
				pendingFriendship.should.have.a.property('status', 'Pending');

				// get jeff's requests
				Friendship.getRequests(jeff._id, function (err, friendshipRequests) {
					if (err) return done(err)

					// jeff sent the request, and has received none
					friendshipRequests.sent.should.be.an.Array.with.length(1)
					friendshipRequests.received.should.be.an.Array.with.length(0)

					// get zane's requests
					Friendship.getRequests(zane._id, function (err, friendshipRequests) {
						if (err) return done(err)

						// zane received jeff's request and has sent none
						friendshipRequests.sent.should.be.an.Array.with.length(0)
						friendshipRequests.received.should.be.an.Array.with.length(1)

						done()
					})
				})
				
			})
		})

		it('getSentRequests - get requests the given user has sent', function (done) {

			// create jeff's request for zane's frienship
			new Friendship(docDescriptor).save(function (err, friendship) {
				if (err) return done(err)
				friendship.should.be.ok

				// get jeff's sent requests
				Friendship.getSentRequests(jeff._id, function (err, friendships) {
					if (err) return done(err)

					// jeff sent one to zane
					friendships.should.be.an.Array.with.length(1)

					// get zane's sent requests
					Friendship.getSentRequests(zane._id, function (err, friendships) {
						if (err) return done(err)

						// zane has sent none
						friendships.should.be.an.Array.with.length(0)

						done()
					})
				})
			})

		})

		it('getReceivedRequests - get requests received by the given user', function (done) {

			// create jeff's request for zane's friendship
			new Friendship(docDescriptor).save(function (err, friendship) {
				if (err) return done(err)
				friendship.should.be.ok

				// get jeff's received requests
				Friendship.getReceivedRequests(jeff._id, function (err, friendships) {
					if (err) return done(err)

					// jeff has received none
					friendships.should.be.an.Array.with.length(0)

					// get zane's received requests
					Friendship.getReceivedRequests(zane._id, function (err, friendships) {
						if (err) return done(err)

						// zane has received one from jeff
						friendships.should.be.an.Array.with.length(1)

						done()
					})
				})
			})
		})

		it('acceptRequest - accept a friend request', function (done) {

			// create jeff's request for zane's friendship
			new Friendship(docDescriptor).save(function (err, friendship) {
				if (err) return done(err)
				friendship.should.be.ok

				// accept jeff's request for zane's friendship
				Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
					if (err) return done(err)

					acceptedFriendship.status.should.equal('Accepted')

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

				// accept jeff's request
				Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
					if (err) return done(err)
					acceptedFriendship.should.be.ok

					// create zane's request for sam's friendship
					new Friendship({requester: zane._id, requested: sam._id}).save(function (err, sentRequest) {
						if (err) return done(err)
						sentRequest.should.be.ok

						// accept zane's request
						Friendship.acceptRequest(zane._id, sam._id, function (err, acceptedFriendship) {
							if (err) return done(err)
							acceptedFriendship.should.be.ok

							// get jeff's friendsOfFriends
							Friendship.getFriendsOfFriends(jeff._id, function (err, friendsOfJeffsFriends) {
								if (err) return done(err)

								friendsOfJeffsFriends.should.be.an.Array.with.length(1);
								friendsOfJeffsFriends[0].toString().should.equal(sam._id.toString())

								// get sam's friendsOfFriends
								Friendship.getFriendsOfFriends(sam._id, function (err, friendsOfSamsFriends) {
									if (err) return done(err)

									friendsOfSamsFriends.should.be.an.Array.with.length(1);
									friendsOfSamsFriends[0].toString().should.equal(jeff._id.toString())

									// get zane's friendsOfFriends
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

		it('areFriends - determine if accountId1 and accountId2 are friends', function (done) {
			var sam = new Account({username: 'Sam'})

			// create jeff's request for zane's friendship
			new Friendship(docDescriptor).save(function (err, friendship) {
				if (err) return done(err)
				friendship.should.be.ok

				// accept jeff's request
				Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
					if (err) return done(err)
					acceptedFriendship.should.be.ok

					// is zane a friend of jeff?
					Friendship.areFriends(jeff._id, zane._id, function (err, answer) {
						if (err) return done(err)
						answer.should.be.true;

						// is jeff a friend of zane?
						Friendship.areFriends(zane._id, jeff._id, function (err, answer) {
							if (err) return done(err)
							answer.should.be.true;

							// is sam a friend of jeff?
							Friendship.areFriends(jeff._id, sam._id, function (err, answer) {
								if (err) return done(err)
								answer.should.be.false;			

								// is sam a friend of zane?
								Friendship.areFriends(zane._id, sam._id, function (err, answer) {
									if (err) return done(err)
									answer.should.be.false;
									done()
								})
							})
						})
					})
				})
			})
		})

		it('areFriendsOfFriends - determine if accountId1 and accountId2 have any common friends', function (done) {
			var sam = new Account({username: 'Sam'})

			// create jeff's request for zane's friendship
			new Friendship(docDescriptor).save(function (err, friendship) {
				if (err) return done(err)
				friendship.should.be.ok

				// accept jeff's request
				Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
					if (err) return done(err)
					acceptedFriendship.should.be.ok

					// create zane's request for sam's friendship
					new Friendship({requester: zane._id, requested: sam._id}).save(function (err, sentRequest) {
						if (err) return done(err)
						sentRequest.should.be.ok

						// accept zane's request
						Friendship.acceptRequest(zane._id, sam._id, function (err, acceptedFriendship) {
							if (err) return done(err)
							acceptedFriendship.should.be.ok

							// is zane one of jeff's friendsOfFriends?
							Friendship.areFriendsOfFriends(jeff._id, zane._id, function (err, answer) {
								if (err) return done(err)
								answer.should.be.false

								// is sam one of zane's friendsOfFriends?
								Friendship.areFriendsOfFriends(zane._id, sam._id, function (err, answer) {
									if (err) return done(err)
									answer.should.be.false

									// is sam one of jeff's friendsOfFriends?
									Friendship.areFriendsOfFriends(jeff._id, sam._id, function (err, answer) {
										if (err) return done(err)
										answer.should.be.true

										Friendship.areFriendsOfFriends(sam._id, jeff._id, function (err, answer) {
											if (err) return done(err)
											answer.should.be.true
											done()
										})
									})
								})

							})
						})
					})
				})
			})
		})

		it('getRelationship - get the numeric relationship of two accounts', function (done) {

			var sam = new Account({username: "Sam"})

			Friendship.getRelationship(jeff._id, zane._id, function (err, relationship) {
				if (err) return done(err)

				// they have should be NOT_FRIENDS
				relationship.should.equal(Friendship.relationships.NOT_FRIENDS)

				// create jeff's request for zane's friendship
				new Friendship(docDescriptor).save(function (err, pendingFriendship) {
					if (err) return done(err)
					pendingFriendship.should.be.ok

					Friendship.getRelationship(jeff._id, zane._id, function (err, relationship) {
						if (err) return done(err)

						// they should still be NOT_FRIENDS
						relationship.should.equal(Friendship.relationships.NOT_FRIENDS)

						// accept the jeff's request for zane's friendship
						Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
							if (err) return done(err)

							acceptedFriendship.should.be.ok

							Friendship.getRelationship(jeff._id, zane._id, function (err, relationship) {
								if (err) return done(err)

								// they should now be FRIENDS
								relationship.should.equal(Friendship.relationships.FRIENDS)

								// create zane's request for sam's friendship
								new Friendship({requester: zane._id, requested: sam._id}).save(function (err, pendingFriendship) {
									if (err) return done(err)

									pendingFriendship.should.be.ok

									Friendship.acceptRequest(zane._id, sam._id, function (err, acceptedFriendship) {
										if (err) return done(err)

										acceptedFriendship.should.be.ok

										Friendship.getRelationship(zane._id, sam._id, function (err, relationship) {
											if (err) return done(err)

											// they should now be FRIENDS
											relationship.should.equal(Friendship.relationships.FRIENDS)

											Friendship.getRelationship(jeff._id, sam._id, function (err, relationship) {
												if (err) return done(err)

												// they should now be FRIENDS_OF_FRIENDS
												relationship.should.equal(Friendship.relationships.FRIENDS_OF_FRIENDS)
												done()
											})
										})
									})
								})
							})
						})
					})
				})
			})
		})
		
		it('getFriendship - get the friendship document of two accounts')

		it('isRequester - check to see if the given user is the requester in a given friendship')
		it('isRequested - check to see if the given user is the requested in a given friendship')

	})

	describe('document methods', function () {
		it('isRequester - check to see if the given user is the requester in this friendship')
		it('isRequested - check to see if the given user is the requested in this friendship')
	})
}
