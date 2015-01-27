var async               = require('async'),
    dbURI               = 'mongodb://localhost/friends-of-friends-tests',
    debug               = require('debug')('friends-of-friends:tests:plugin')
    clearDB             = require('mocha-mongoose')(dbURI, { noClear: true })
    mongoose            = require('mongoose'),
    plugin              = require('../lib/plugin'),
    relationships       = require('../lib/relationships'),
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

        it('friendRequest           - send a friend request to a another user', function (testComplete) {
            AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, pendingFriendship) {
                if (err) return testComplete(err)

                pendingFriendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                pendingFriendship.requested.should.have.a.property('_id', testUsers.zane._id)
                pendingFriendship.should.have.a.property('status', 'Pending')
                pendingFriendship.dateSent.should.be.a.Date

                testComplete()
            })
        })

        it('getRequests             - get all friend requests for a given user', function (testComplete) {
            async.series({
                request: function (next) {
                    AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, sentRequest) {
                        next(err, sentRequest);
                    })
                }, 
                jeffsRequests: function (next) {
                    AccountModel.getRequests(testUsers.jeff._id, next)
                }, 
                zanesRequests: function (next) {
                    AccountModel.getRequests(testUsers.zane._id, next)
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results.request.should.be.ok
                results.jeffsRequests.sent.should.be.an.empty.Array
                results.zanesRequests.received.should.be.an.empty.Array

                testComplete()
            })
        })

        it('getSentRequests         - get requests the given user has sent', function (testComplete) {   
            async.series({
                sent: function (next) {
                    AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, sentRequest) {
                        next(err, sentRequest);
                    })
                }, 
                jeffsRequests: function (next) {
                    AccountModel.getSentRequests(testUsers.jeff._id, next)
                },
                zanesRequests: function (next) {
                    AccountModel.getSentRequests(testUsers.zane._id, next)
                },
                accepted: function (next) {
                    AccountModel.acceptRequest(testUsers.zane._id, testUsers.sam._id, next)
                },
                zanesRequestsAfter: function (next) {
                    AccountModel.getSentRequests(testUsers.zane._id, next)
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results.sent.should.be.ok
                results.jeffsRequests.should.be.an.empty.Array
                results.zanesRequests.should.be.an.Array.with.length(1)
                results.accepted.should.be.ok
                results.zanesRequestsAfter.should.be.an.empty.Array

                testComplete()
            })
        })

        it('getReceivedRequests     - get requests received by the given user', function (testComplete) {
            async.series({
                sent: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, sentRequest) {
                        next(err, sentRequest);
                    })
                },
                requestsBefore: function (next) {
                    async.parallel({
                        jeff: function (done) {
                            AccountModel.getReceivedRequests(testUsers.jeff._id, done)
                        },
                        zane: function (done) {
                            AccountModel.getReceivedRequests(testUsers.zane._id, done)
                        },
                        sam: function (done) {
                            AccountModel.getReceivedRequests(testUsers.sam._id, done)
                        },
                        henry: function (done) {
                            AccountModel.getReceivedRequests(testUsers.henry._id, done)
                        }
                    }, function (err, results) {
                        next(err, results)
                    })
                },
                accepted: function (next) {
                    AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, next)
                }, 
                requestsAfter: function (next) {
                    async.parallel({
                        jeff: function (done) {
                            AccountModel.getReceivedRequests(testUsers.jeff._id, done)
                        },
                        zane: function (done) {
                            AccountModel.getReceivedRequests(testUsers.zane._id, done)
                        },
                        sam: function (done) {
                            AccountModel.getReceivedRequests(testUsers.sam._id, done)
                        },
                        henry: function (done) {
                            AccountModel.getReceivedRequests(testUsers.henry._id, done)
                        }
                    }, function (err, results) {
                        next(err, results)
                    })
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results.sent.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.sent.requested.should.have.a.property('_id', testUsers.zane._id)
                results.sent.should.have.a.property('status', 'Pending')
                results.sent.dateSent.should.be.a.Date

                results.requestsBefore.jeff.should.be.an.empty.Array
                results.requestsBefore.zane.should.be.an.Array.with.length(1)
                results.requestsBefore.sam.should.be.an.empty.Array
                results.requestsBefore.henry.should.be.an.empty.Array

                results.accepted.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.accepted.requested.should.have.a.property('_id', testUsers.zane._id)
                results.accepted.should.have.a.property('status', 'Accepted')
                results.accepted.dateSent.should.be.a.Date

                results.requestsAfter.jeff.should.be.an.empty.Array
                results.requestsAfter.zane.should.be.an.empty.Array
                results.requestsAfter.sam.should.be.an.empty.Array
                results.requestsAfter.henry.should.be.an.empty.Array

                testComplete()
            })
        })

        it('acceptRequest           - accept a friend request ', function (testComplete) {
            async.series({
                sent: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, sentRequest) {
                        next(err, sentRequest);
                    })
                },
                accepted: function (next) {
                    AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, next)
                }
            }, function (err, results) {
                if (err) return done(err) 

                results.sent.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.sent.requested.should.have.a.property('_id', testUsers.zane._id)
                results.sent.should.have.a.property('status', 'Pending')
                results.sent.dateSent.should.be.a.Date

                results.accepted.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.accepted.requested.should.have.a.property('_id', testUsers.zane._id)
                results.accepted.should.have.a.property('status', 'Accepted')
                results.accepted.dateSent.should.be.a.Date

                testComplete()
            })
        })

        it('denyRequest             - deny a friend request', function (testComplete) {
            async.series({
                sent: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, sentRequest) {
                        next(err, sentRequest);
                    })
                },
                denied: function (next) {
                    AccountModel.denyRequest(testUsers.jeff._id, testUsers.zane._id, next)
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results.sent.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.sent.requested.should.have.a.property('_id', testUsers.zane._id)
                results.sent.should.have.a.property('status', 'Pending')
                results.sent.dateSent.should.be.an.instanceof(Date);

                results.denied.should.equal(1)

                testComplete()
            })
        })

        it('endFriendship           - end a friendship between two accounts', function (testComplete) {
            async.series({
                sent: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, sentRequest) {
                        next(err, sentRequest);
                    })
                },
                accepted: function (next) {
                    AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, next)
                },
                ended: function (next) {
                    AccountModel.endFriendship(testUsers.jeff._id, testUsers.zane._id, next)
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results.sent.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.sent.requested.should.have.a.property('_id', testUsers.zane._id)
                results.sent.should.have.a.property('status', 'Pending')
                results.sent.dateSent.should.be.an.instanceof(Date);

                results.accepted.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.accepted.requested.should.have.a.property('_id', testUsers.zane._id)
                results.accepted.should.have.a.property('status', 'Accepted')
                results.accepted.dateSent.should.be.an.instanceof(Date);

                results.ended.should.equal(1);

                testComplete()
            })
        })

        it('getFriends              - get all friends of an account', function (testComplete) {
            async.series({
                sent: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, sentRequest) {
                        next(err, sentRequest);
                    })
                },
                accepted: function (next) {
                    AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, next)
                },
                friends: function (next) {
                    async.parallel({
                        jeff: function (done) {
                            AccountModel.getFriends(testUsers.jeff._id, done)
                        },
                        zane: function (done) {
                            AccountModel.getFriends(testUsers.zane._id, done)
                        }
                    }, function (err, results) {
                        next(err, results)
                    })
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results.sent.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.sent.requested.should.have.a.property('_id', testUsers.zane._id)
                results.sent.should.have.a.property('status', 'Pending')
                results.sent.dateSent.should.be.a.Date

                results.accepted.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.accepted.requested.should.have.a.property('_id', testUsers.zane._id)
                results.accepted.should.have.a.property('status', 'Accepted')
                results.accepted.dateSent.should.be.a.Date

                results.friends.jeff.should.be.an.Array.with.length(1)
                results.friends.jeff[0].should.have.a.property('_id', testUsers.zane._id)

                results.friends.zane.should.be.an.Array.with.length(1)
                results.friends.zane[0].should.have.a.property('_id', testUsers.jeff._id)

                testComplete()
            })
        })

        it('getFriendsOfFriends     - get friends of this account\'s friends', function (testComplete) {
            async.series({
                jeffToZane: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, request) {
                        next(err, request)
                    })
                },
                jeffToZaneAccepted: function (next) {
                    AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, next)
                },
                zaneToSam: function (next) {
                    AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, request) {
                        next(err, request)
                    })
                },
                zaneToSamAccepted: function (next) {
                    AccountModel.acceptRequest(testUsers.zane._id, testUsers.sam._id, next)
                },
                friendsOfFriends: function (next) {
                    async.parallel({
                        jeff: function (done) {
                            AccountModel.getFriendsOfFriends(testUsers.jeff._id, done)
                        }, 
                        sam: function (done) {
                            AccountModel.getFriendsOfFriends(testUsers.sam._id, done)
                        },
                        zane: function (done) {
                            AccountModel.getFriendsOfFriends(testUsers.zane._id, done)
                        },
                        henry: function (done) {
                            AccountModel.getFriendsOfFriends(testUsers.henry._id, done)
                        }
                    }, function (err, results) {
                        next(err, results)
                    })
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results.jeffToZane.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.jeffToZane.requested.should.have.a.property('_id', testUsers.zane._id)
                results.jeffToZane.should.have.a.property('status', 'Pending')
                results.jeffToZane.dateSent.should.be.a.Date

                results.jeffToZaneAccepted.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.jeffToZaneAccepted.requested.should.have.a.property('_id', testUsers.zane._id)
                results.jeffToZaneAccepted.should.have.a.property('status', 'Accepted')
                results.jeffToZaneAccepted.dateSent.should.be.a.Date

                results.zaneToSam.requester.should.have.a.property('_id', testUsers.zane._id)
                results.zaneToSam.requested.should.have.a.property('_id', testUsers.sam._id)
                results.zaneToSam.should.have.a.property('status', 'Pending')
                results.zaneToSam.dateSent.should.be.a.Date

                results.zaneToSamAccepted.requester.should.have.a.property('_id', testUsers.zane._id)
                results.zaneToSamAccepted.requested.should.have.a.property('_id', testUsers.sam._id)
                results.zaneToSamAccepted.should.have.a.property('status', 'Accepted')
                results.zaneToSamAccepted.dateSent.should.be.a.Date

                results.friendsOfFriends.jeff.should.be.an.Array.with.length(1)
                results.friendsOfFriends.jeff[0].should.have.a.property('_id', testUsers.sam._id)

                results.friendsOfFriends.sam.should.be.an.Array.with.length(1)
                results.friendsOfFriends.sam[0].should.have.a.property('_id', testUsers.jeff._id)

                results.friendsOfFriends.zane.should.be.an.empty.Array
                results.friendsOfFriends.henry.should.be.and.empty.Array

                testComplete()
            })
        })

        it('getNonFriends           - get all users that are not the given user\'s friends or friendsOfFriends', function (testComplete) {
            async.series({
                jeffToZane: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, request) {
                        next(err, request)
                    })
                },
                jeffToZaneAccepted: function (next) {
                    AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, next)
                },
                zaneToSam: function (next) {
                    AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, request) {
                        next(err, request)
                    })
                },
                zaneToSamAccepted: function (next) {
                    AccountModel.acceptRequest(testUsers.zane._id, testUsers.sam._id, next)
                },
                nonFriends: function (next) {
                    async.parallel({
                        jeff: function (done) {
                            AccountModel.getNonFriends(testUsers.jeff._id, done)
                        }, 
                        sam: function (done) {
                            AccountModel.getNonFriends(testUsers.sam._id, done)
                        },
                        zane: function (done) {
                            AccountModel.getNonFriends(testUsers.zane._id, done)
                        },
                        henry: function (done) {
                            AccountModel.getNonFriends(testUsers.henry._id, done)
                        }
                    }, function (err, results) {
                        next(err, results)
                    })
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results.jeffToZane.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.jeffToZane.requested.should.have.a.property('_id', testUsers.zane._id)
                results.jeffToZane.should.have.a.property('status', 'Pending')
                results.jeffToZane.dateSent.should.be.a.Date

                results.jeffToZaneAccepted.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.jeffToZaneAccepted.requested.should.have.a.property('_id', testUsers.zane._id)
                results.jeffToZaneAccepted.should.have.a.property('status', 'Accepted')
                results.jeffToZaneAccepted.dateSent.should.be.a.Date

                results.zaneToSam.requester.should.have.a.property('_id', testUsers.zane._id)
                results.zaneToSam.requested.should.have.a.property('_id', testUsers.sam._id)
                results.zaneToSam.should.have.a.property('status', 'Pending')
                results.zaneToSam.dateSent.should.be.a.Date

                results.zaneToSamAccepted.requester.should.have.a.property('_id', testUsers.zane._id)
                results.zaneToSamAccepted.requested.should.have.a.property('_id', testUsers.sam._id)
                results.zaneToSamAccepted.should.have.a.property('status', 'Accepted')
                results.zaneToSamAccepted.dateSent.should.be.a.Date

                results.nonFriends.jeff.should.be.an.Array.with.length(1)
                results.nonFriends.jeff[0].should.have.a.property('_id', testUsers.henry._id)

                results.nonFriends.zane.should.be.an.Array.with.length(1)
                results.nonFriends.sam.should.be.an.Array.with.length(1)

                results.nonFriends.henry.should.be.an.Array.with.length(3)

                results.nonFriends.henry.should.containDeep([ {"_doc": { username: testUsers.jeff.username } } ])
                results.nonFriends.henry.should.containDeep([ {"_doc": { username: testUsers.zane.username } } ])
                results.nonFriends.henry.should.containDeep([ {"_doc": { username: testUsers.sam.username } } ])

                testComplete()
            })
        })

        it('areFriends              - determine if accountId2 is a friend of accountId1', function (testComplete) {
            async.series({
                jeffToZane: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, request) {
                        next(err, request)
                    })
                },
                jeffToZaneAccepted: function (next) {
                    AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, next)
                },
                areFriends: function (next) {
                    async.parallel({
                        jeffAndZane: function (done) {
                            AccountModel.areFriends(testUsers.jeff._id, testUsers.zane._id, done)
                        },
                        jeffAndSam: function (done) {
                            AccountModel.areFriends(testUsers.jeff._id, testUsers.sam._id, done)
                        },
                        jeffAndHenry: function (done) {
                            AccountModel.areFriends(testUsers.jeff._id, testUsers.henry._id, done)
                        },
                        zaneAndSam: function (done) {
                            AccountModel.areFriends(testUsers.zane._id, testUsers.sam._id, done) 
                        },
                        zaneAndHenry: function (done) {
                            AccountModel.areFriends(testUsers.zane._id, testUsers.henry._id, done)
                        }, 
                        samAndHenry: function (done) {
                            AccountModel.areFriends(testUsers.sam._id, testUsers.henry._id, done)
                        }
                    }, function (err, results) {
                        next(err, results)
                    })
                }
            }, function (err, results) {
                if (err) return testComplete(err) 

                results.jeffToZane.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.jeffToZane.requested.should.have.a.property('_id', testUsers.zane._id)
                results.jeffToZane.should.have.a.property('status', 'Pending')
                results.jeffToZane.dateSent.should.be.a.Date

                results.jeffToZaneAccepted.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.jeffToZaneAccepted.requested.should.have.a.property('_id', testUsers.zane._id)
                results.jeffToZaneAccepted.should.have.a.property('status', 'Accepted')
                results.jeffToZaneAccepted.dateSent.should.be.a.Date

                results.areFriends.jeffAndZane.should.be.true;
                results.areFriends.jeffAndSam.should.be.false;
                results.areFriends.jeffAndHenry.should.be.false;
                results.areFriends.zaneAndSam.should.be.false;
                results.areFriends.zaneAndHenry.should.be.false;
                results.areFriends.samAndHenry.should.be.false;
                
                testComplete()
            })
        })

        it('areFriendsOfFriends     - determine if accountId1 and accountId2 have any common friends', function (testComplete) {
            async.series({
                jeffToZane: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, request) {
                        next(err, request)
                    })
                },
                jeffToZaneAccepted: function (next) {
                    AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, next)
                },
                zaneToSam: function (next) {
                    AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, request) {
                        next(err, request)
                    })
                }, 
                zaneToSamAccepted: function (next) {
                    AccountModel.acceptRequest(testUsers.zane._id, testUsers.sam._id, next)
                }, 
                areFriendsOfFriends: function (next) {
                    async.parallel({
                        jeffAndZane: function (done) {
                            AccountModel.areFriendsOfFriends(testUsers.jeff._id, testUsers.zane._id, done)
                        },
                        jeffAndSam: function (done) {
                            AccountModel.areFriendsOfFriends(testUsers.jeff._id, testUsers.sam._id, done)
                        },
                        jeffAndHenry: function (done) {
                            AccountModel.areFriendsOfFriends(testUsers.jeff._id, testUsers.henry._id, done)
                        },
                        zaneAndSam: function (done) {
                            AccountModel.areFriendsOfFriends(testUsers.zane._id, testUsers.sam._id, done) 
                        },
                        zaneAndHenry: function (done) {
                            AccountModel.areFriendsOfFriends(testUsers.zane._id, testUsers.henry._id, done)
                        }, 
                        samAndHenry: function (done) {
                            AccountModel.areFriendsOfFriends(testUsers.sam._id, testUsers.henry._id, done)
                        }
                    }, function (err, results) {
                        next(err, results)
                    })
                }
            }, function (err, results) {
                if (err) return testComplete(err) 

                results.jeffToZane.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.jeffToZane.requested.should.have.a.property('_id', testUsers.zane._id)
                results.jeffToZane.should.have.a.property('status', 'Pending')
                results.jeffToZane.dateSent.should.be.a.Date

                results.jeffToZaneAccepted.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.jeffToZaneAccepted.requested.should.have.a.property('_id', testUsers.zane._id)
                results.jeffToZaneAccepted.should.have.a.property('status', 'Accepted')
                results.jeffToZaneAccepted.dateSent.should.be.a.Date

                results.zaneToSam.requester.should.have.a.property('_id', testUsers.zane._id)
                results.zaneToSam.requested.should.have.a.property('_id', testUsers.sam._id)
                results.zaneToSam.should.have.a.property('status', 'Pending')
                results.zaneToSam.dateSent.should.be.a.Date

                results.zaneToSamAccepted.requester.should.have.a.property('_id', testUsers.zane._id)
                results.zaneToSamAccepted.requested.should.have.a.property('_id', testUsers.sam._id)
                results.zaneToSamAccepted.should.have.a.property('status', 'Accepted')
                results.zaneToSamAccepted.dateSent.should.be.a.Date

                results.areFriendsOfFriends.jeffAndZane.should.be.false;
                results.areFriendsOfFriends.jeffAndSam.should.be.true;
                results.areFriendsOfFriends.jeffAndHenry.should.be.false;
                results.areFriendsOfFriends.zaneAndSam.should.be.false;
                results.areFriendsOfFriends.zaneAndHenry.should.be.false;
                results.areFriendsOfFriends.samAndHenry.should.be.false;
                
                testComplete()
            })
        })

        it('getFriendship           - get the friendship document itself', function (testComplete) {
            async.series({
                sent: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, request) {
                        next(err, request)
                    })
                },
                accepted: function (next) {
                    AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, next)
                },
                friendship: function (next) {
                    AccountModel.getFriendship(testUsers.jeff._id, testUsers.zane._id, next)
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results.sent.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.sent.requested.should.have.a.property('_id', testUsers.zane._id)
                results.sent.should.have.a.property('status', 'Pending')
                results.sent.dateSent.should.be.a.Date

                results.accepted.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.accepted.requested.should.have.a.property('_id', testUsers.zane._id)
                results.accepted.should.have.a.property('status', 'Accepted')
                results.accepted.dateSent.should.be.a.Date

                results.friendship.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.friendship.requested.should.have.a.property('_id', testUsers.zane._id)
                results.friendship.should.have.a.property('status', 'Accepted')
                results.friendship.dateSent.should.be.a.Date
            
                testComplete()
            })
        })

        it('getRelationship         - get the numeric relationship between two users', function (testComplete) {
            async.series({
                jeffToZane: function (next) {
                    AccountModel.friendRequest(testUsers.jeff._id, testUsers.zane._id, function (err, request) {
                        next(err, request)
                    })
                },
                jeffToZaneAccepted: function (next) {
                    AccountModel.acceptRequest(testUsers.jeff._id, testUsers.zane._id, next)
                },
                zaneToSam: function (next) {
                    AccountModel.friendRequest(testUsers.zane._id, testUsers.sam._id, function (err, request) {
                        next(err, request)
                    })
                }, 
                zaneToSamAccepted: function (next) {
                    AccountModel.acceptRequest(testUsers.zane._id, testUsers.sam._id, next)
                }, 
                relationships: function (next) {
                    async.parallel({
                        jeffAndZane: function (done) {
                            AccountModel.getRelationship(testUsers.jeff._id, testUsers.zane._id, done)
                        },
                        jeffAndSam: function (done) {
                            AccountModel.getRelationship(testUsers.jeff._id, testUsers.sam._id, done)
                        },
                        jeffAndHenry: function (done) {
                            AccountModel.getRelationship(testUsers.jeff._id, testUsers.henry._id, done)
                        },
                        zaneAndSam: function (done) {
                            AccountModel.getRelationship(testUsers.zane._id, testUsers.sam._id, done) 
                        },
                        zaneAndHenry: function (done) {
                            AccountModel.getRelationship(testUsers.zane._id, testUsers.henry._id, done)
                        }, 
                        samAndHenry: function (done) {
                            AccountModel.getRelationship(testUsers.sam._id, testUsers.henry._id, done)
                        }
                    }, function (err, results) {
                        next(err, results)
                    })
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results.jeffToZane.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.jeffToZane.requested.should.have.a.property('_id', testUsers.zane._id)
                results.jeffToZane.should.have.a.property('status', 'Pending')
                results.jeffToZane.dateSent.should.be.a.Date

                results.jeffToZaneAccepted.requester.should.have.a.property('_id', testUsers.jeff._id)
                results.jeffToZaneAccepted.requested.should.have.a.property('_id', testUsers.zane._id)
                results.jeffToZaneAccepted.should.have.a.property('status', 'Accepted')
                results.jeffToZaneAccepted.dateSent.should.be.a.Date

                results.zaneToSam.requester.should.have.a.property('_id', testUsers.zane._id)
                results.zaneToSam.requested.should.have.a.property('_id', testUsers.sam._id)
                results.zaneToSam.should.have.a.property('status', 'Pending')
                results.zaneToSam.dateSent.should.be.a.Date

                results.zaneToSamAccepted.requester.should.have.a.property('_id', testUsers.zane._id)
                results.zaneToSamAccepted.requested.should.have.a.property('_id', testUsers.sam._id)
                results.zaneToSamAccepted.should.have.a.property('status', 'Accepted')
                results.zaneToSamAccepted.dateSent.should.be.a.Date

                results.relationships.jeffAndZane   .should.equal(relationships.FRIENDS)
                results.relationships.jeffAndSam    .should.equal(relationships.FRIENDS_OF_FRIENDS)
                results.relationships.jeffAndHenry  .should.equal(relationships.NOT_FRIENDS)
                results.relationships.zaneAndSam    .should.equal(relationships.FRIENDS)
                results.relationships.zaneAndHenry  .should.equal(relationships.NOT_FRIENDS)
                results.relationships.samAndHenry   .should.equal(relationships.NOT_FRIENDS)
            
                testComplete()
            })
        })
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

