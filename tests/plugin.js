var async               = require('async'),
    dbURI               = 'mongodb://localhost/friends-of-friends-tests',
    debug               = require('debug')('friends-of-friends:tests:plugin')
    clearDB             = require('mocha-mongoose')(dbURI, { noClear: true })
    mongoose            = require('mongoose'),
    plugin              = require('../lib/plugin'),
    should              = require('should')

var options = { accountName: 'test-account'}

var AccountModel,
    AccountSchema = new mongoose.Schema({username: String})

AccountSchema.plugin(plugin, options)

AccountModel = mongoose.model(options.accountName, AccountSchema)

var testUsers = {}

module.exports = function () {
    describe('statics', function () {

        beforeEach(function (done) {
            if (!mongoose.connection.db) {
                mongoose.connect(dbURI, function () {
                    insertTestUsers(done)
                }) 
            } else {
                insertTestUsers(done)
            }           
        })

        afterEach(function (done) {
            clearDB(done)
        })

        it('friendRequest           - send a friend request to a another user', function (done) {

            AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, pendingFriendship) {
                if (err) return done(err)

                pendingFriendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                pendingFriendship.requested.should.have.a.property('_id', testUsers.zane._id)
                pendingFriendship.should.have.a.property('status', 'Pending')
                pendingFriendship.dateSent.should.be.a.Date

                done()
            })
        })

        it('getRequests             - get all friend requests for a given user', function (done) {
            AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, pendingFriendship) {
                if (err) done(err)

                pendingFriendship.should.be.ok

                AccountModel.getRequests(testUsers.jeff._id, function (err, requests) {
                    if (err) done(err)

                    requests.sent.should.be.an.empty.Array
                    requests.received.should.be.an.empty.Array

                    AccountModel.getRequests(testUsers.zane._id, function (err, requests) {
                        if (err) return done(err)

                        requests.sent.should.be.an.Array.with.length(1)
                        requests.received.should.be.an.Array.with.length(0)
                        done()
                    })
                })
            })
        })

        it('getSentRequests         - get requests the given user has sent', function (done) {          
            AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, pendingFriendship) {
                if (err) done(err)

                pendingFriendship.should.be.ok

                AccountModel.getSentRequests(testUsers.jeff._id, function (err, requests) {
                    if (err) done(err)

                    requests.should.be.an.empty.Array

                    AccountModel.getSentRequests(testUsers.zane._id, function (err, requests) {
                        if (err) return done(err)

                        requests.should.be.an.Array.with.length(1)

                        AccountModel.acceptRequest(testUsers.zane._id, testUsers.sam._id, function (err, friendship) {
                            if (err) return done (err)
                            
                            AccountModel.getSentRequests(testUsers.zane._id, function (err, requests) {
                                if (err) return done(err)

                                requests.should.be.an.empty.Array

                                done()
                            })
                        })
                    })
                })
            })
        })

        it('getReceivedRequests     - get requests received by the given user', function (done) {
            AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, pendingFriendship) {
                if (err) done(err)

                pendingFriendship.should.be.ok

                AccountModel.getReceivedRequests(testUsers.jeff._id, function (err, requests) {
                    if (err) done(err)

                    requests.should.be.an.empty.Array

                    AccountModel.getReceivedRequests(testUsers.sam._id, function (err, requests) {
                        if (err) return done(err)

                        requests.should.be.an.Array.with.length(1)

                        AccountModel.acceptRequest(testUsers.zane._id, testUsers.sam._id, function (err, friendship) {
                            if (err) return done (err)
                            
                            AccountModel.getReceivedRequests(testUsers.sam._id, function (err, requests) {
                                if (err) return done(err)

                                requests.should.be.an.empty.Array

                                done()
                            })
                        })
                    })
                })
            })
        })

        it('acceptRequest           - accept a friend request ', function (done) {
            AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, pendingFriendship) {
                if (err) return done(err)

                pendingFriendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                pendingFriendship.requested.should.have.a.property('_id', testUsers.zane._id)
                pendingFriendship.should.have.a.property('status', 'Pending')
                pendingFriendship.dateSent.should.be.a.Date

                AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, function (err, friendship) {
                    if (err) return done(err)

                    friendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                    friendship.requested.should.have.a.property('_id', testUsers.zane._id)
                    friendship.should.have.a.property('status', 'Accepted')
                    friendship.dateSent.should.be.a.Date

                    done()
                })
            })
        })

        it('denyRequest             - deny a friend request', function (done) {
            AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, pendingFriendship) {
                if (err) return done(err)

                pendingFriendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                pendingFriendship.requested.should.have.a.property('_id', testUsers.zane._id)
                pendingFriendship.should.have.a.property('status', 'Pending')
                pendingFriendship.dateSent.should.be.a.Date

                AccountModel.denyRequest(testUsers.jeff._id, testUsers.zane._id, function (err, pendingFriendship) {
                    if (err) return done(err)

                    (null === pendingFriendship).should.be.true

                    done()
                })
            })
        })

        it('endFriendship           - end a friendship between two accounts', function (done) {
            AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, pendingFriendship) {
                if (err) return done(err)

                pendingFriendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                pendingFriendship.requested.should.have.a.property('_id', testUsers.zane._id)
                pendingFriendship.should.have.a.property('status', 'Pending')
                pendingFriendship.dateSent.should.be.a.Date

                AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, function (err, friendship) {
                    if (err) return done(err)

                    friendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                    friendship.requested.should.have.a.property('_id', testUsers.zane._id)
                    friendship.should.have.a.property('status', 'Accepted')
                    friendship.dateSent.should.be.a.Date

                    AccountModel.endFriendship(testUsers.jeff._id, testUsers.zane._id, function (err, friendship) {
                        if (err) return done(err)

                        (null === friendship).should.be.true

                        done()
                    })
                })
            })
        })

        it('getFriends              - get all friends of an account', function (done) {
            AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, pendingFriendship) {
                if (err) return done(err)

                pendingFriendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                pendingFriendship.requested.should.have.a.property('_id', testUsers.zane._id)
                pendingFriendship.should.have.a.property('status', 'Pending')
                pendingFriendship.dateSent.should.be.a.Date

                AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, function (err, friendship) {
                    if (err) return done(err)

                    friendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                    friendship.requested.should.have.a.property('_id', testUsers.zane._id)
                    friendship.should.have.a.property('status', 'Accepted')
                    friendship.dateSent.should.be.a.Date

                    AccountModel.getFriends(testUsers.jeff._id, function (err, jeffsFriends) {
                        if (err) return done(err)

                        jeffsFriends.should.be.an.Array.with.length(1)
                        jeffsFriends[0].should.have.a.property('_id', testUsers.zane._id)

                        AccountModel.getFriends(testUsers.zane._id, function (err, zanesFriends) {
                            if (err) return done(err)

                            zanesFriends.should.be.an.Array.with.length(1)
                            zanesFriends[0].should.have.a.property('_id', testUsers.jeff._id)
                        
                            done()
                        })
                    })
                })
            })
        })

        it('getFriendsOfFriends     - get friends of this account\'s friends', function (done) {
            AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, pendingFriendship) {
                if (err) return done(err)

                pendingFriendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                pendingFriendship.requested.should.have.a.property('_id', testUsers.zane._id)
                pendingFriendship.should.have.a.property('status', 'Pending')
                pendingFriendship.dateSent.should.be.a.Date

                AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, function (err, friendship) {
                    if (err) return done(err)

                    friendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                    friendship.requested.should.have.a.property('_id', testUsers.zane._id)
                    friendship.should.have.a.property('status', 'Accepted')
                    friendship.dateSent.should.be.a.Date

                    AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, pendingFriendship) {
                        if (err) return done(err)

                        pendingFriendship.requester.should.have.a.property('_id', testUsers.zane._id)
                        pendingFriendship.requested.should.have.a.property('_id', testUsers.sam._id)
                        pendingFriendship.should.have.a.property('status', 'Pending')
                        pendingFriendship.dateSent.should.be.a.Date

                        AccountModel.acceptRequest(testUsers.zane._id, testUsers.sam._id, function (err, friendship) {
                            if (err) return done(err)

                            friendship.requester.should.have.a.property('_id', testUsers.zane._id)
                            friendship.requested.should.have.a.property('_id', testUsers.sam._id)
                            friendship.should.have.a.property('status', 'Accepted')
                            friendship.dateSent.should.be.a.Date

                            AccountModel.getFriendsOfFriends(testUsers.jeff._id, function (err, jeffsFriendsOfFriends) {
                                if (err) return done(err)



                                jeffsFriendsOfFriends.should.be.an.Array.with.length(1)
                                jeffsFriendsOfFriends[0].should.have.a.property('_id', testUsers.sam._id)

                                AccountModel.getFriendsOfFriends(testUsers.sam._id, function (err, samsFriendsOfFriends) {
                                    if (err) return done(err)

                                    samsFriendsOfFriends.should.be.an.Array.with.length(1)
                                    samsFriendsOfFriends[0].should.have.a.property('_id', testUsers.jeff._id)
                                
                                    done()
                                })
                            })
                        })
                    })
                })
            })
        })
        it('getNonFriends           - get all users that are not the given user\'s friends or friendsOfFriends', function (done) {
            AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, pendingFriendship) {
                if (err) return done(err)

                pendingFriendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                pendingFriendship.requested.should.have.a.property('_id', testUsers.zane._id)
                pendingFriendship.should.have.a.property('status', 'Pending')
                pendingFriendship.dateSent.should.be.a.Date

                AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, function (err, friendship) {
                    if (err) return done(err)

                    friendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                    friendship.requested.should.have.a.property('_id', testUsers.zane._id)
                    friendship.should.have.a.property('status', 'Accepted')
                    friendship.dateSent.should.be.a.Date

                    AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, pendingFriendship) {
                        if (err) return done(err)

                        pendingFriendship.requester.should.have.a.property('_id', testUsers.zane._id)
                        pendingFriendship.requested.should.have.a.property('_id', testUsers.sam._id)
                        pendingFriendship.should.have.a.property('status', 'Pending')
                        pendingFriendship.dateSent.should.be.a.Date

                        AccountModel.acceptRequest(testUsers.zane._id, testUsers.sam._id, function (err, friendship) {
                            if (err) return done(err)

                            friendship.requester.should.have.a.property('_id', testUsers.zane._id)
                            friendship.requested.should.have.a.property('_id', testUsers.sam._id)
                            friendship.should.have.a.property('status', 'Accepted')
                            friendship.dateSent.should.be.a.Date

                            AccountModel.getNonFriends(testUsers.jeff._id, function (err, jeffsNonFriends) {
                                if (err) return done(err)

                                jeffsNonFriends.should.be.an.Array.with.length(1)
                                jeffsNonFriends[0].should.have.a.property('_id', testUsers.henry._id)

                                AccountModel.getNonFriends(testUsers.henry._id, function (err, henrysNonFriends) {
                                    if (err) return done(err)

                                    henrysNonFriends.should.be.an.Array.with.length(1)
                                    henrysNonFriends[0].should.have.a.property('_id', testUsers.jeff._id)
                                
                                    done()
                                })
                            })
                        })
                    })
                })
            })
        })

        it('areFriends              - determine if accountId2 is a friend of accountId1')
        it('areFriendsOfFriends     - determine if accountId1 and accountId2 have any common friends')
        it('getFriendship           - get the friendship document itself')
        it('getRelationship         - get the numeric relationship between two users')
    })

    describe('methods', function () {
        beforeEach(function (done) {
            if (!mongoose.connection.db) {
                mongoose.connect(dbURI, function () {
                    insertTestUsers(done)
                }) 
            } else {
                insertTestUsers(done)
            }           
        })

        afterEach(function (done) {
            clearDB(done)
        })

        it('friendRequest           - send a request to another account')
        it('getRequests             - get friend requests')
        it('getSentRequests         - get friend requests the user has sent')
        it('getReceivedRequests     - get friend requests the user has received')
        it('acceptRequest           - accept a friend request received from the specified user')
        it('denyRequest             - deny a friend request received from the specified user')
        it('endFriendship           - end a friendship with the specified user')
        it('getFriends              - get this user\'s friends')
        it('getFriendsOfFriends     - get friends of this user\'s friends')
        it('getNonFriends           - get accounts which are not this user\'s friends')
        it('isFriend                - determine if this document is friends with the specified account')
        it('isFriendOfFriends       - determine if this document shares any friends with the specified account')
        it('getFriendship           - get the friendship document of this document and the specified account')
        it('getRelationship         - get the relationship of this document and the specified account')
    })
}

function insertTestUsers (done) {
    async.parallel({   
        jeff: function (finished) {
            new AccountModel({username: 'Jeff'}).save(function (err, jeff) {
                finished(err, jeff)
            })
        },
        zane: function (finished) {
            new AccountModel({username: 'Zane'}).save(function (err, zane) {
                finished(err, zane)
            })
        },
        sam: function (finished) {
            new AccountModel({username: 'Sam'}).save(function (err, sam) {
                finished(err, sam)
            })
        },
        henry: function (finished) {
            new AccountModel({username: 'Henry'}).save(function (err, henry) {
                finished(err, henry);
            })
        }
    }, function (err, accounts) {
        if (err) return done(err)

        accounts.jeff.should.be.ok
        accounts.zane.should.be.ok
        accounts.sam.should.be.ok
        accounts.henry.should.be.ok

        testUsers = accounts

        done()
        
    })
}

