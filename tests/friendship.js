
var async               = require('async'), 
    Friendship          = require('../lib/friendship')({accountName: 'test-account'}),
    dbURI               = 'mongodb://localhost/friends-of-friends-tests',
    debug               = require('debug')('friends-of-friends:tests:friendship')
    should              = require('should'),
    mongoose            = require('mongoose'),
    clearDB             = require('mocha-mongoose')(dbURI, { noClear: true });

var Account,
    AccountSchema = new mongoose.Schema({username: String});

try {
    Account = mongoose.model('Account', AccountSchema);
}
catch (error) {
    Account = mongoose.model('Account');
}

var jeff = new Account({username: 'Jeff'}),
    zane = new Account({username: 'Zane'});

var docDescriptor = {requester: jeff._id, requested: zane._id};

module.exports = function () {

    describe('statics', function () {

        beforeEach(function (done) {
            if (mongoose.connection.db) return done();

            mongoose.connect(dbURI,done);

        });

        afterEach(function (done) {
            clearDB(done);
        });

        it('getRequests             - get all requests involving a given user', function (testComplete) {

            new Friendship(docDescriptor).save(function (err, pendingFriendship) {
                if (err) return testComplete(err);

                async.parallel({
                    jeffsRequests: function (then) {
                        Friendship.getRequests(jeff._id, then);
                    },
                    zanesRequests: function (then) {
                        Friendship.getRequests(zane._id, then);
                    }
                }, function (err, results) {
                    if (err) return testComplete(err);

                    pendingFriendship.should.have.a.property('requester', jeff._id);
                    pendingFriendship.should.have.a.property('requested', zane._id);
                    pendingFriendship.should.have.a.property('status', 'Pending');

                    // jeff sent the request, and has received none
                    results.jeffsRequests.sent.should.be.an.Array.with.length(1);
                    results.jeffsRequests.received.should.be.an.empty.Array;

                    // zane received jeff's request and has sent none
                    results.zanesRequests.sent.should.be.an.empty.Array;
                    results.zanesRequests.received.should.be.an.Array.with.length(1);

                    testComplete();
                });
            });
        });

        it('getSentRequests         - get requests the given user has sent', function (testComplete) {

            // create jeff's request for zane's frienship
            new Friendship(docDescriptor).save(function (err, friendship) {
                if (err) return testComplete(err);

                async.parallel({
                    jeffsSentRequests: function (done) {
                        Friendship.getSentRequests(jeff._id, done)
                        
                    },
                    zanesSentRequests: function (done) {
                        Friendship.getSentRequests(zane._id, done)
                    }

                }, function (err, results) {
                    if (err) return testComplete(err)

                    friendship.should.be.ok

                    // jeff sent one to zane
                    results.jeffsSentRequests.should.be.an.Array.with.length(1)

                    // zane has sent none
                    results.zanesSentRequests.should.be.an.Array.with.length(0)

                    testComplete()
                });
            })
        })

        it('getReceivedRequests     - get requests received by the given user', function (testComplete) {

            // create jeff's request for zane's frienship
            new Friendship(docDescriptor).save(function (err, friendship) {
                if (err) return testComplete(err)

                async.parallel({
                    jeff: function (done) {
                        Friendship.getReceivedRequests(jeff._id, done)
                    },
                    zane: function (done) {
                        Friendship.getReceivedRequests(zane._id, done)
                    }
                }, function (err, receivedRequests) {
                    if (err) return testComplete(err)

                    friendship.should.be.ok

                    // jeff sent one to zane
                    receivedRequests.jeff.should.be.an.Array.with.length(0)

                    // zane has sent none
                    receivedRequests.zane.should.be.an.Array.with.length(1)

                    testComplete()
                });
            })          
        })

        it('acceptRequest           - accept a friend request', function (testComplete) {

            async.series({
                send: function (next) {
                    new Friendship(docDescriptor).save(function (err, friendship) {
                        next(err, friendship)
                    })
                },
                accept: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, next)
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                results .send.should.be.ok  
                results.accept.should.have.a.property('status', 'Accepted')

                testComplete()
            })
        })

        it('denyRequest             - deny a friend request', function (testComplete) {

            async.series({
                send: function (next) {
                    new Friendship(docDescriptor).save(function (err, friendship) {
                        next(err, friendship)
                    })
                },
                deny: function (next) {
                    Friendship.denyRequest(jeff._id, zane._id, next)
                }
            }, function (err, results) {
                if (err) return testComplete(err)

                (null === friendship).should.equal.true

                testComplete()
            })          
        })

        it('getFriends              - get a list of ids of friends of an account', function (testComplete) {

            async.series({
                send: function (next) {
                    new Friendship(docDescriptor).save(function (err, friendship) {
                        next(err, friendship)
                    })
                },
                accept: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, next)
                },
                friends: function (next) {
                    async.parallel({
                        jeff: function (finished) {
                            Friendship.getFriends(jeff._id, finished)
                        },
                        zane: function (finished) {
                            Friendship.getFriends(zane._id, finished)
                        }
                    }, next)
                }
            }, function (err, results) {
                if (err) return testComplete(err) 

                results.send.should.be.ok
                results.send.should.have.property('status', 'Pending')

                results.accept.should.be.ok
                results.accept.should.have.property('status', 'Accepted')

                results.friends.jeff.should.be.an.Array.with.length(1)
                results.friends.jeff[0].toString().should.equal(zane._id.toString())

                results.friends.zane.should.be.an.Array.with.length(1)
                results.friends.zane[0].toString().should.equal(jeff._id.toString())
                            
                testComplete()  
            })
        })

        it('getFriendsOfFriends     - get a list of ids of this account\'s friends', function (testComplete) {

            var sam = new Account({username: 'Sam'})

            async.parallel({
                jeffAndZane: function (done) {
                    async.series({
                        sent: function (next) {
                            new Friendship(docDescriptor).save(next)        
                        },
                        accepted: function (next) {
                            Friendship.acceptRequest(jeff._id, zane._id, next)
                        }
                    }, done)
                },
                zaneAndSam: function (done) {
                    async.series({
                        sent: function (next) {
                            new Friendship({requester: zane._id, requested: sam._id}).save(next)        
                        },
                        accepted: function (next) {
                            Friendship.acceptRequest(zane._id, sam._id, next)
                        }
                    }, done)  
                }
            },
            function (err, results) {
                if (err) return testComplete(err)

                results.jeffAndZane.sent.should.be.ok
                results.jeffAndZane.accepted.should.be.ok
                results.zaneAndSam.sent.should.be.ok
                results.zaneAndSam.accepted.should.be.ok

                async.parallel({
                    jeff: function (done) {
                        Friendship.getFriendsOfFriends(jeff._id, done)
                    },
                    zane: function (done) {
                        Friendship.getFriendsOfFriends(zane._id, done)
                    },
                    sam: function (done) {
                        Friendship.getFriendsOfFriends(sam._id, done)
                    }
                }, 
                function (err, results) {
                    if (err) return testComplete(err)

                    results.jeff.should.be.an.Array.with.length(1);
                    results.jeff[0].toString().should.equal(sam._id.toString())

                    results.sam.should.be.an.Array.with.length(1);
                    results.sam[0].toString().should.equal(jeff._id.toString())

                    results.zane.should.be.an.Array.with.length(0);
                    
                    testComplete();
                });
            });
        })

        it('areFriends              - determine if accountId1 and accountId2 are friends', function (testComplete) {
            var sam = new Account({username: 'Sam'})

            async.series({
                sent: function (next) {
                    new Friendship(docDescriptor).save(next);        
                },
                accepted: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, next);
                }, 
                tests: function (next) {
                    async.parallel({
                        jeffAndZane: function (done) {
                            Friendship.areFriends(jeff._id, zane._id, done);
                        },
                        zaneAndJeff: function (done) {
                            Friendship.areFriends(zane._id, jeff._id, done);
                        },
                        jeffAndSam: function (done) {
                            Friendship.areFriends(jeff._id, sam._id, done);
                        },
                        zaneAndSam: function (done) {
                            Friendship.areFriends(zane._id, sam._id, done);
                        }
                    }, next);
                }
            }, 
            function (err, results) {
                if (err) return testComplete(err);

                results.sent.should.be.ok;
                results.accepted.should.be.ok;

                results.tests.jeffAndZane.should.be.true;
                results.tests.zaneAndJeff.should.be.true;

                results.tests.jeffAndSam.should.be.false;
                results.tests.zaneAndSam.should.be.false;

                testComplete()
            });
        })

        it('areFriendsOfFriends     - determine if accountId1 and accountId2 have any common friends', function (testComplete) {
            var sam = new Account({username: 'Sam'})

            async.series({
                requests: function (next) {
                    async.parallel({
                        jeffToZane: function (done) {
                            async.series({
                                sent: function (next) {
                                    new Friendship(docDescriptor).save(next);
                                },
                                accepted: function (next) {
                                    Friendship.acceptRequest(jeff._id, zane._id, next);
                                }
                            }, done);
                        },
                        zaneToSam: function (done) {
                            async.series({
                                sent: function (next) {
                                    new Friendship({requester: zane._id, requested: sam._id}).save(next);
                                },
                                accepted: function (next) {
                                    Friendship.acceptRequest(zane._id, sam._id, next);
                                }
                            }, done);
                        }
                    }, next);
                },
                areFriends: function (next) {
                    async.parallel({
                        jeffAndZane: function (done) {
                            Friendship.areFriendsOfFriends(jeff._id, zane._id, done);
                        },
                        zaneAndSam: function (done) {
                            Friendship.areFriendsOfFriends(zane._id, sam._id, done);
                        }, 
                        jeffAndSam: function (done) {
                            Friendship.areFriendsOfFriends(jeff._id, sam._id, done);
                        },
                        samAndJeff: function (done) {
                            Friendship.areFriendsOfFriends(sam._id, jeff._id, done);
                        }
                    }, next);
                }
            }, function (err, results) {
                if (err) testComplete(err) 

                results.requests.jeffToZane.sent.should.be.ok;
                results.requests.jeffToZane.accepted.should.be.ok;

                results.requests.zaneToSam.sent.should.be.ok;
                results.requests.zaneToSam.accepted.should.be.ok;

                results.areFriends.jeffAndZane.should.be.false;
                results.areFriends.zaneAndSam.should.be.false;
                results.areFriends.jeffAndSam.should.be.true;
                results.areFriends.samAndJeff.should.be.true;

                testComplete();
            });         
        })

        it('getRelationship         - get the numeric relationship of two accounts', function (testComplete) {

            var sam = new Account({username: "Sam"})

            async.series({
                jeffAndZane: function (next) {
                    Friendship.getRelationship(jeff._id, zane._id, next);
                },
                requests: function (next) {
                    async.parallel({
                        jeffAndZane: function (done) {
                            async.series({
                                sent: function (next) {
                                    new Friendship(docDescriptor).save(function (err, sentRequest) {
                                        next(err, sentRequest);
                                    });
                                },
                                accepted: function (next) {
                                    Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
                                        next(err, acceptedFriendship);
                                    });
                                }
                            }, done);
                        },
                        zaneAndSam: function (done) {
                            async.series({
                                sent: function (next) {
                                    new Friendship({requester: zane._id, requested: sam._id}).save(function (err, sentRequest) {
                                        next(err, sentRequest)
                                    });
                                },
                                accepted: function (next) {
                                    Friendship.acceptRequest(zane._id, sam._id, function (err, acceptedFriendship) {
                                        next(err, acceptedFriendship)
                                    });
                                }
                            }, done);
                        }
                    }, next);
                },
                relationships: function (next) {
                    async.parallel({
                        jeffAndZane: function (done) {
                            Friendship.getRelationship(jeff._id, zane._id, done);
                        },
                        zaneAndSam: function (done) {
                            Friendship.getRelationship(zane._id, sam._id, done);
                        },
                        jeffAndSam: function (done) {
                            Friendship.getRelationship(jeff._id, sam._id, done);
                        }
                    }, next);
                }
            }, 
            function (err, results) {
                if (err) return testComplete(err)

                // they should have been NOT_FRIENDS at the beginning
                results.jeffAndZane.should.equal(Friendship.relationships.NOT_FRIENDS)

                debug('results.requests', results.requests);

                results.requests.jeffAndZane.sent.should.be.ok
                results.requests.jeffAndZane.accepted.should.be.ok

                results.requests.zaneAndSam.sent.should.be.ok
                results.requests.zaneAndSam.accepted.should.be.ok

                // they should now be FRIENDS
                results.relationships.jeffAndZane.should.equal(Friendship.relationships.FRIENDS)

                // they should now be FRIENDS
                results.relationships.zaneAndSam.should.equal(Friendship.relationships.FRIENDS)

                // they should now be FRIENDS_OF_FRIENDS
                results.relationships.jeffAndSam.should.equal(Friendship.relationships.FRIENDS_OF_FRIENDS)

                testComplete();

            });
        })
        
        it('getFriendship           - get the friendship document of two accounts', function (testComplete) {

            async.series({
                sent: function (next) {
                    new Friendship(docDescriptor).save(function (err, pendingFriendship) {
                        next(err, pendingFriendship);
                    });
                },
                pending: function (next) {
                    Friendship.getFriendship(jeff._id, zane._id, function (err, pendingFriendship) {
                        next(err, pendingFriendship);
                    });
                },
                accepted: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
                        next(err, acceptedFriendship);
                    });
                },
                friendship: function (last) {
                    Friendship.getFriendship(jeff._id, zane._id, function (err, friendship) {
                        last(err, friendship);
                    });
                }
            }, 
            function (err, results) {
                if (err) return testComplete(err);

                debug('results', results);

                results.sent.should.have.property('status', 'Pending');
                results.sent.should.have.property('requester', jeff._id);
                results.sent.should.have.property('requested', zane._id);
                results.sent.dateSent.should.be.an.instanceof(Date);

                results.pending.should.have.property('status', 'Pending');
                results.pending.should.have.property('requester', jeff._id);
                results.pending.should.have.property('requested', zane._id);
                results.pending.dateSent.should.be.an.instanceof(Date);
                
                results.accepted.should.have.property('status', 'Accepted');
                results.accepted.should.have.property('requester', jeff._id);
                results.accepted.should.have.property('requested', zane._id);
                results.accepted.dateSent.should.be.an.instanceof(Date);
                results.accepted.dateAccepted.should.be.an.instanceof(Date);

                results.friendship.should.have.property('status', 'Accepted');
                results.friendship.should.have.property('requester', jeff._id);
                results.friendship.should.have.property('requested', zane._id);
                results.friendship.dateSent.should.be.an.instanceof(Date);
                results.friendship.dateAccepted.should.be.an.instanceof(Date);

                testComplete();
            });
        });

        it('isRequester             - check to see if the given user is the requester in a given friendship', function (testComplete) {
            new Friendship(docDescriptor).save(function (err, pendingFriendship) {
                if (err) return testComplete(err)
                pendingFriendship.should.be.ok

                Friendship.isRequester(pendingFriendship._id, jeff._id, function (err, answer) {
                    if (err) return testComplete(err)

                    answer.should.be.true

                    Friendship.isRequester(pendingFriendship._id, zane._id, function (err, answer) {
                        if (err) return testComplete(err)

                        answer.should.be.false

                        Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
                            if (err) return testComplete(err)
                            acceptedFriendship.should.be.ok

                            Friendship.isRequester(acceptedFriendship, jeff._id, function (err, answer) {
                                if (err) return testComplete(err)

                                answer.should.be.true

                                Friendship.isRequester(acceptedFriendship, zane._id, function (err, answer) {
                                    if (err) return testComplete(err)

                                    answer.should.be.false
                                    
                                    testComplete()
                                })
                            })
                        })
                    })
                })
            })
        })

        it('isRequested             - check to see if the given user is the requested in a given friendship', function (testComplete) {
            new Friendship(docDescriptor).save(function (err, pendingFriendship) {
                if (err) return testComplete(err)

                Friendship.isRequested(pendingFriendship._id, jeff._id, function (err, answer) {
                    if (err) return testComplete(err)

                    answer.should.be.false

                    Friendship.isRequested(pendingFriendship._id, zane._id, function (err, answer) {
                        if (err) return testComplete(err)

                        answer.should.be.true

                        Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
                            if (err) return testComplete(err)
                            acceptedFriendship.should.be.ok

                            Friendship.isRequested(acceptedFriendship, jeff._id, function (err, answer) {
                                if (err) return testComplete(err)

                                answer.should.be.false

                                Friendship.isRequested(acceptedFriendship, zane._id, function (err, answer) {
                                    if (err) return testComplete(err)

                                    answer.should.be.true
                                    
                                    testComplete()
                                })
                            })
                        })
                    })
                })
            })
        })

    })

    describe('methods', function () {
        beforeEach(function (done) {
            if (mongoose.connection.db) return done()

            mongoose.connect(dbURI,done)

        })

        afterEach(function (done) {
            clearDB(done)
        })
        
        it('isRequester             - check to see if the given user is the requester in this friendship', function (testComplete) {
            new Friendship(docDescriptor).save(function (err, pendingFriendship) {
                if (err) return testComplete(err)
                pendingFriendship.should.be.ok

                pendingFriendship.isRequester(jeff._id, function (err, answer) {
                    if (err) return testComplete(err)

                    answer.should.be.true

                    pendingFriendship.isRequester(zane._id, function (err, answer) {
                        if (err) return testComplete(err)

                        answer.should.be.false

                        Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
                            if (err) return testComplete(err)
                            acceptedFriendship.should.be.ok
                            
                            pendingFriendship.isRequester(jeff._id, function (err, answer) {
                                if (err) return testComplete(err)

                                answer.should.be.true

                                pendingFriendship.isRequester(zane._id, function (err, answer) {
                                    if (err) return testComplete(err)

                                    answer.should.be.false

                                    testComplete()
                                })
                            })
                        })
                    })
                })
            })
        })

        it('isRequested             - check to see if the given user is the requested in this friendship', function (testComplete) {
            new Friendship(docDescriptor).save(function (err, pendingFriendship) {
                if (err) return testComplete(err)
                pendingFriendship.should.be.ok

                pendingFriendship.isRequested(jeff._id, function (err, answer) {
                    if (err) return testComplete(err)

                    answer.should.be.false

                    pendingFriendship.isRequested(zane._id, function (err, answer) {
                        if (err) return testComplete(err)

                        answer.should.be.true

                        Friendship.acceptRequest(jeff._id, zane._id, function (err, acceptedFriendship) {
                            if (err) return testComplete(err)
                            acceptedFriendship.should.be.ok
                            
                            pendingFriendship.isRequested(jeff._id, function (err, answer) {
                                if (err) return testComplete(err)

                                answer.should.be.false

                                pendingFriendship.isRequested(zane._id, function (err, answer) {
                                    if (err) return testComplete(err)

                                    answer.should.be.true

                                    testComplete()
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}
