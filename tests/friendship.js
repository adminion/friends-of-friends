
var async               = require('async'), 
    dbURI               = 'mongodb://localhost/friends-of-friends-tests',
    debug               = require('debug')('friends-of-friends:tests:friendship')
    should              = require('should'),
    clearDB             = require('mocha-mongoose')(dbURI, { noClear: true });

module.exports = function (FriendsOfFriends, mongoose) {

    var Friendship = FriendsOfFriends.Friendship;

    var Person = mongoose.model(FriendsOfFriends.get('personModelName'));

    var jeff = new Person({username: 'Jeff'}),
        zane = new Person({username: 'Zane'});

    var docDescriptor = {requester: jeff._id, requested: zane._id};

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
                        Friendship.getSentRequests(jeff._id, done);
                        
                    },
                    zanesSentRequests: function (done) {
                        Friendship.getSentRequests(zane._id, done);
                    }

                }, function (err, results) {
                    if (err) return testComplete(err);

                    friendship.should.be.ok;

                    // jeff sent one to zane
                    results.jeffsSentRequests.should.be.an.Array.with.length(1);

                    // zane has sent none
                    results.zanesSentRequests.should.be.an.Array.with.length(0);

                    testComplete();
                });
            });
        });

        it('getReceivedRequests     - get requests received by the given user', function (testComplete) {

            // create jeff's request for zane's frienship
            new Friendship(docDescriptor).save(function (err, friendship) {
                if (err) return testComplete(err);

                async.parallel({
                    jeff: function (done) {
                        Friendship.getReceivedRequests(jeff._id, done);
                    },
                    zane: function (done) {
                        Friendship.getReceivedRequests(zane._id, done);
                    }
                }, function (err, receivedRequests) {
                    if (err) return testComplete(err);

                    friendship.should.be.ok;

                    // jeff sent one to zane
                    receivedRequests.jeff.should.be.an.Array.with.length(0);

                    // zane has sent none
                    receivedRequests.zane.should.be.an.Array.with.length(1);

                    testComplete();
                });
            });
        });

        it('acceptRequest           - accept a friend request', function (testComplete) {

            async.series({
                send: function (next) {
                    new Friendship(docDescriptor).save(function (err, friendship) {
                        next(err, friendship);
                    });
                },
                accept: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, next);
                }
            }, function (err, results) {
                if (err) return testComplete(err);

                results .send.should.be.ok;
                results.accept.should.have.a.property('status', 'Accepted');

                testComplete();
            });
        });

        it('cancelRequest           - cancel a friend request', function (testComplete) {

            async.series({
                send: function (next) {
                    new Friendship(docDescriptor).save(function (err, friendship) {
                        next(err, friendship);
                    })
                },
                cancel: function (next) {
                    Friendship.cancelRequest(jeff._id, zane._id, next);
                }
            }, function (err, results) {
                if (err) return testComplete(err);

                results.send.should.be.ok

                results.cancel.result.ok.should.equal(1);
                results.cancel.result.n.should.equal(1);

                testComplete();
            });
        });

        it('denyRequest             - deny a friend request', function (testComplete) {

            async.series({
                send: function (next) {
                    new Friendship(docDescriptor).save(function (err, friendship) {
                        next(err, friendship);
                    })
                },
                deny: function (next) {
                    Friendship.denyRequest(jeff._id, zane._id, next);
                }
            }, function (err, results) {
                if (err) return testComplete(err);

                results.send.should.be.ok

                results.deny.result.ok.should.equal(1);
                results.deny.result.n.should.equal(1);

                testComplete();
            });
        });

        it('getFriends              - get a list of ids of friends of an person', function (testComplete) {

            async.series({
                send: function (next) {
                    new Friendship(docDescriptor).save(function (err, friendship) {
                        next(err, friendship);
                    })
                },
                accept: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, next);
                },
                friends: function (next) {
                    async.parallel({
                        jeff: function (finished) {
                            Friendship.getFriends(jeff._id, finished);
                        },
                        zane: function (finished) {
                            Friendship.getFriends(zane._id, finished);
                        }
                    }, next);
                }
            }, function (err, results) {
                if (err) return testComplete(err) ;

                results.send.should.be.ok;
                results.send.should.have.property('status', 'Pending');

                results.accept.should.be.ok;
                results.accept.should.have.property('status', 'Accepted');

                results.friends.jeff.should.be.an.Array.with.length(1);
                results.friends.jeff[0].toString().should.equal(zane._id.toString());

                results.friends.zane.should.be.an.Array.with.length(1);
                results.friends.zane[0].toString().should.equal(jeff._id.toString());
                            
                testComplete();
            });
        });

        it('getFriendsOfFriends     - get a list of ids of this person\'s friends', function (testComplete) {

            var sam = new Person({username: 'Sam'});

            async.parallel({
                jeffAndZane: function (done) {
                    async.series({
                        sent: function (next) {
                            new Friendship(docDescriptor).save(next);    
                        },
                        accepted: function (next) {
                            Friendship.acceptRequest(jeff._id, zane._id, next);
                        }
                    }, done);
                },
                zaneAndSam: function (done) {
                    async.series({
                        sent: function (next) {
                            new Friendship({requester: zane._id, requested: sam._id}).save(next);
                        },
                        accepted: function (next) {
                            Friendship.acceptRequest(zane._id, sam._id, next);
                        }
                    }, done);
                }
            },
            function (err, results) {
                if (err) return testComplete(err);

                results.jeffAndZane.sent.should.be.ok;
                results.jeffAndZane.accepted.should.be.ok;
                results.zaneAndSam.sent.should.be.ok;
                results.zaneAndSam.accepted.should.be.ok;

                async.parallel({
                    jeff: function (done) {
                        Friendship.getFriendsOfFriends(jeff._id, done);
                    },
                    zane: function (done) {
                        Friendship.getFriendsOfFriends(zane._id, done);
                    },
                    sam: function (done) {
                        Friendship.getFriendsOfFriends(sam._id, done);
                    }
                }, 
                function (err, results) {
                    if (err) return testComplete(err);

                    results.jeff.should.be.an.Array.with.length(1);
                    results.jeff[0].toString().should.equal(sam._id.toString());

                    results.sam.should.be.an.Array.with.length(1);
                    results.sam[0].toString().should.equal(jeff._id.toString());

                    results.zane.should.be.an.Array.with.length(0);
                    
                    testComplete();
                });
            });
        });

        it('getPendingFriends       - get a list of ids of pending friends of an person', function (testComplete) {

            async.series({
                send: function (next) {
                    new Friendship(docDescriptor).save(function (err, friendship) {
                        next(err, friendship);
                    })
                },
                pendingFriends: function (next) {
                    async.parallel({
                        jeff: function (finished) {
                            Friendship.getPendingFriends(jeff._id, finished);
                        },
                        zane: function (finished) {
                            Friendship.getPendingFriends(zane._id, finished);
                        }
                    }, next);
                }
            }, function (err, results) {
                if (err) return testComplete(err) ;

                results.send.should.be.ok;
                results.send.should.have.property('status', 'Pending');

                results.pendingFriends.jeff.should.be.an.Array.with.length(1);
                results.pendingFriends.jeff[0].toString().should.equal(zane._id.toString());

                results.pendingFriends.zane.should.be.an.Array.with.length(1);
                results.pendingFriends.zane[0].toString().should.equal(jeff._id.toString());
                            
                testComplete();
            });
        });

        it('areFriends              - determine if person 1 and person 2 are friends', function (testComplete) {
            var sam = new Person({username: 'Sam'})

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

                Friendship.areFriends(1234, sam._id, function (err, answer) {
                    err.should.be.an.Error;

                    (undefined === answer).should.be.true;

                    testComplete();
                });
            });
        });

        it('areFriendsOfFriends     - determine if person 1 and person 2 have any common friends', function (testComplete) {
            var sam = new Person({username: 'Sam'})

            async.series({
                requests: function (next) {
                    async.parallel({
                        jeffToZane: function (done) {
                            async.series({
                                sent: function (then) {
                                    new Friendship(docDescriptor).save(then);
                                },
                                accepted: function (then) {
                                    Friendship.acceptRequest(jeff._id, zane._id, then);
                                }
                            }, done);
                        },
                        zaneToSam: function (done) {
                            async.series({
                                sent: function (then) {
                                    new Friendship({requester: zane._id, requested: sam._id}).save(then);
                                },
                                accepted: function (then) {
                                    Friendship.acceptRequest(zane._id, sam._id, then);
                                }
                            }, done);
                        }
                    }, next);
                },
                areFriendsOfFriends: function (next) {
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

                results.areFriendsOfFriends.jeffAndZane.should.be.false;
                results.areFriendsOfFriends.zaneAndSam.should.be.false;
                results.areFriendsOfFriends.jeffAndSam.should.be.true;
                results.areFriendsOfFriends.samAndJeff.should.be.true;

                Friendship.areFriendsOfFriends(1234, sam._id, function (err, answer) {
                    err.should.be.an.Error;
                    (answer === undefined).should.be.true;

                    Friendship.areFriendsOfFriends(zane._id, 1234, function (err, answer) {
                        err.should.be.an.Error;
                        (answer === undefined).should.be.true;

                        testComplete();
                    });
                });
            });         
        });

        it('arePendingFriends       - determine if person 1 and person 2 have a pending friendship', function (testComplete) {

            async.series({
                pre: function (next) {
                    Friendship.arePendingFriends(jeff._id, zane._id, next);
                },
                request: function (next) {
                    new Friendship(docDescriptor).save(function (err, pendingFriendship) {
                        next(err, pendingFriendship);
                    });
                },
                post: function (next) {
                    Friendship.arePendingFriends(jeff._id, zane._id, next);
                },
                friendship: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, next);
                },
                accepted: function (next) {
                    Friendship.arePendingFriends(jeff._id, zane._id, next);
                }
            }, 
            function (err, results) {
                if (err) return done(err);

                results.pre.should.be.false;
                results.request.should.be.ok;
                results.post.should.be.ok;
                results.friendship.should.be.ok;
                results.accepted.should.be.false;

                Friendship.arePendingFriends(1234, 5678, function (err, answer) {
                    err.should.be.an.Error;
                    (answer === undefined).should.be.true;

                    testComplete();
                });
            });
        });

        it('getRelationship         - get the numeric relationship of two people', function (testComplete) {

            var sam = new Person({username: "Sam"}),
                henry = new Person({username: "Henry"});

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
                                        next(err, sentRequest);
                                    });
                                },
                                accepted: function (next) {
                                    Friendship.acceptRequest(zane._id, sam._id, function (err, acceptedFriendship) {
                                        next(err, acceptedFriendship);
                                    });
                                }
                            }, done);
                        }, 
                        jeffAndHenry: function (done) {
                            new Friendship({requester: jeff._id, requested: henry._id}).save(function (err, sentRequest) {
                                done(err, sentRequest);
                            });
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
                        }, 
                        jeffAndHenry: function (done) {
                            Friendship.getRelationship(jeff._id, henry._id, done);
                        }
                    }, next);
                }
            }, 
            function (err, results) {
                if (err) return testComplete(err)

                results.jeffAndZane.should.equal(Friendship.relationships.NOT_FRIENDS);

                debug('results.requests', results.requests);

                results.requests.jeffAndZane.sent.should.be.ok;
                results.requests.jeffAndZane.accepted.should.be.ok;

                results.requests.zaneAndSam.sent.should.be.ok;
                results.requests.zaneAndSam.accepted.should.be.ok;

                results.requests.jeffAndHenry.should.be.ok;

                results.relationships.jeffAndZane.should.equal(Friendship.relationships.FRIENDS);
                results.relationships.zaneAndSam.should.equal(Friendship.relationships.FRIENDS);
                results.relationships.jeffAndSam.should.equal(Friendship.relationships.FRIENDS_OF_FRIENDS);
                results.relationships.jeffAndHenry.should.equal(Friendship.relationships.PENDING_FRIENDS);

                Friendship.getRelationship(1234, 5678, function (err, relationship) {
                    err.should.be.an.Error;

                    (relationship === undefined).should.be.true;

                    testComplete();
                });
            });
        });
        
        it('getFriendship           - get the friendship document of two people', function (testComplete) {

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
            async.series({
                request: function (next) {
                    new Friendship(docDescriptor).save(function (err, request) {
                        if (err) return next(err);
                        
                        async.parallel({
                            jeff: function (done) {
                                Friendship.isRequester(request._id, jeff._id, done);
                            },
                            zane: function (done) {
                                Friendship.isRequester(request._id, zane._id, done);
                            }
                        }, next);
                    });
                },
                friendship: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, function (err, friendship) {
                        if (err) return testComplete(err);

                        async.parallel({
                            jeff: function (done) {
                                Friendship.isRequester(friendship._id, jeff._id, done);
                            },
                            zane: function (done) {
                                Friendship.isRequester(friendship._id, zane._id, done);
                            }
                        }, next);
                    });
                }
            }, function (err, answers) {
                if (err) return testComplete(err);
                
                answers.request.jeff.should.be.true;
                answers.request.zane.should.be.false;

                answers.friendship.jeff.should.be.true;
                answers.friendship.zane.should.be.false;

                Friendship.isRequester(1234, jeff._id, function (err, answer) {
                    err.should.be.an.Error;
                    (answer === undefined).should.be.true;

                    Friendship.isRequester(zane._id, jeff._id, function (err, answer) {

                        err.should.be.an.Error;
                        (answer === undefined).should.be.true;

                        testComplete();
                    });                  
                });
            });
        });

        it('isRequested             - check to see if the given user is the requested in a given friendship', function (testComplete) {
            async.series({
                request: function (next) {
                    new Friendship(docDescriptor).save(function (err, request) {
                        if (err) return next(err);
                        
                        async.parallel({
                            jeff: function (done) {
                                Friendship.isRequested(request._id, jeff._id, done);
                            },
                            zane: function (done) {
                                Friendship.isRequested(request._id, zane._id, done);
                            }
                        }, next);
                    });
                },
                friendship: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, function (err, friendship) {
                        if (err) return testComplete(err);

                        async.parallel({
                            jeff: function (done) {
                                Friendship.isRequested(friendship._id, jeff._id, done);
                            },
                            zane: function (done) {
                                Friendship.isRequested(friendship._id, zane._id, done);
                            }
                        }, next);
                    });
                }
            }, function (err, answers) {
                if (err) return testComplete(err);
                
                answers.request.jeff.should.be.false;
                answers.request.zane.should.be.true;

                answers.friendship.jeff.should.be.false;
                answers.friendship.zane.should.be.true;

                Friendship.isRequested(1234, jeff._id, function (err, answer) {
                    err.should.be.an.Error;
                    (answer === undefined).should.be.true;

                    Friendship.isRequested(zane._id, jeff._id, function (err, answer) {

                        err.should.be.an.Error;
                        (answer === undefined).should.be.true;

                        testComplete();
                    });                  
                });
            });
        });
    });

    describe('methods', function () {
        beforeEach(function (done) {
            if (mongoose.connection.db) return done();

            mongoose.connect(dbURI,done);

        });

        afterEach(function (done) {
            clearDB(done);
        });
        
        it('isRequester             - check to see if the given user is the requester in this friendship', function (testComplete) {
            async.series({
                request: function (next) {
                    new Friendship(docDescriptor).save(function (err, request) {
                        if (err) return next(err)
                        
                        async.parallel({
                            jeff: function (done) {
                                request.isRequester(jeff._id, done);
                            },
                            zane: function (done) {
                                request.isRequester(zane._id, done);
                            }
                        }, next);
                    });
                },
                friendship: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, function (err, friendship) {
                        if (err) return testComplete(err)

                        async.parallel({
                            jeff: function (done) {
                                friendship.isRequester(jeff._id, done);
                            },
                            zane: function (done) {
                                friendship.isRequester(zane._id, done);
                            }
                        }, next);
                    });
                }
            }, function (err, answers) {
                if (err) return testComplete(err);
                
                answers.request.jeff.should.be.true;
                answers.request.zane.should.be.false;

                answers.friendship.jeff.should.be.true;
                answers.friendship.zane.should.be.false;

                testComplete();
            });
        });

        it('isRequested             - check to see if the given user is the requested in this friendship', function (testComplete) {
            async.series({
                request: function (next) {
                    new Friendship(docDescriptor).save(function (err, request) {
                        if (err) return next(err)
                        
                        async.parallel({
                            jeff: function (done) {
                                request.isRequested(jeff._id, done);
                            },
                            zane: function (done) {
                                request.isRequested(zane._id, done);
                            }
                        }, next);
                    });
                },
                friendship: function (next) {
                    Friendship.acceptRequest(jeff._id, zane._id, function (err, friendship) {
                        if (err) return testComplete(err)

                        async.parallel({
                            jeff: function (done) {
                                friendship.isRequested(jeff._id, done);
                            },
                            zane: function (done) {
                                friendship.isRequested(zane._id, done);
                            }
                        }, next);
                    });
                }
            }, function (err, answers) {
                if (err) return testComplete(err);
                
                answers.request.jeff.should.be.false;
                answers.request.zane.should.be.true;

                answers.friendship.jeff.should.be.false;
                answers.friendship.zane.should.be.true;

                testComplete();
            });
        });
    });
};
