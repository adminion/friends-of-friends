
var env = require('../../env'),
    debug = require('debug')(env.context('server:data:friends')),
    mongoose = require('mongoose'),
    privacy = require('./privacy'),
    relationships = require('./relationships');

var ObjectId = mongoose.Schema.Types.ObjectId;

var FRIENDSHIP_REF = 'Friendship';

module.exports = function (accountRef) {

    var FriendshipSchema = new mongoose.Schema({
        requester: { type: ObjectId, ref: accountRef, required: true, index: true },
        requested: { type: ObjectId, ref: accountRef, required: true, index: true },
        status: { type: String, default: 'Pending', index: true},
        dateSent: { type: Date, default: Date.now, index: true },
        dateAccepted: { type: Date, required: false, index: true }
    });

    FriendshipSchema.static({
        privacy: privacy,
        relationships: relationships,
        isRequester: function (friendshipId, accountId, done) {
            var self = this,
                model = mongoose.model(FRIENDSHIP_REF, FriendshipSchema);

            model.findById(friendshipId, function (err, friendship) {
                if (err) {
                    done(err);
                } else if (!friendship) {
                    done(new Error('Invalid friendshipId!'));
                } else {
                    done(null, friendship.requester.equals(accountId));
                }
            });
        },
        isRequested: function (friendshipId, accountId, done) {
            var self = this,
                model = mongoose.model(FRIENDSHIP_REF, FriendshipSchema);

            model.findById(friendshipId, function (err, friendship) {
                if (err) {
                    done(err);
                } else if (!friendship) {
                    done(new Error('Invalid friendshipId!'));
                } else {
                    done(null, friendship.requested.equals(accountId));
                }
            });
        },
    });

    FriendshipSchema.method({
        isRequester: function (accountId, done) {
            this.statics.isRequester(this._id, accountId, done);
        },
        isRequested: function (accountId1, done) {
            this.statics.isRequested(this._id, accountId, done);
        }
    });

    var Friendship = mongoose.model(FRIENDSHIP_REF, FriendshipSchema);

    /**
     *  Adds friendship and privacy functionality to a schema 
     */
    function friendshipPlugin (schema) {

        var settingDef = { 
            type: Number, 
            min: privacy.values.ANYBODY, 
            max: privacy.values.NOBODY, 
            default: privacy.values.NOBODY 
        };

        schema.add({
            privacy: {
                profile:        settingDef,
                search:         settingDef,
                chatRequests:   settingDef,
                friendRequests: settingDef,
            }
        });

        /** 
         * Model-accesible Properties and Functions
         *
         * Most of these require or may optionally take a callback with this signature:
         *  function (err, friends) {...}
         * 
         * example:
         * 
         *  Model.getFriends(account1_Id, function (err, friends) {
         *      
         *      console.log('friends', friends);
         *  
         *  });
         */
        schema.static({

            privacy: privacy,
            relationships: relationships,

            /**
             *  Model.sendRequest() - sends a friend request to a another user
             * 
             * @param {ObjectId} requesterId - the ObjectId of the account sending the request
             * @param {ObjectId} requested_Id - the ObjectId of the account to whom the request will be sent
             * @param {Function} done - required callback, passed the populated request 
             */
            friendRequest : function (requesterId, requestedEmail, done) {
                var self = this,
                    model = mongoose.model(accountRef, schema);

                // view the user's profile to see what we can do
                this.viewProfile(requesterId, requestedEmail, function (err, requestedAccountInfo) {
                    if (err) {
                        done(err);
                    } else if (!requestedAccountInfo) {
                        done();
                    } else {

                        var select = '_id created email privacy profile';

                        var toPopulate = [
                            { path: 'requester', select: select },
                            { path: 'requested', select: select }
                        ];

                        // check for existing friendship or request
                        self.getFriendship(requesterId, requestedAccountInfo._id, function (err, friendship) {
                            if (err) {
                                done(err);
                            } else if (friendship) {
                                model.populate(friendship, toPopulate, done);
                            } else {
                                // check to see if they are NOT allowed to send a request
                                if (!requestedAccountInfo.friendRequests) {
                                    done(new Error('You are not allowed to send this user a friend request.'));
                                    debug('friend request no allowed!');
                                } else {
                                    var request = new Friendship({ 
                                        requester: requesterId,
                                        requested: requestedAccountInfo._id
                                    }).save(function (err, friendship) {
                                        if (err) {
                                            done(err);
                                        } else if (!friendship) {
                                            done();
                                        } else {
                                            model.populate(friendship, toPopulate, done);
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            },

            /**
             *  Model.getRequests() - get all friend requests for a given user
             * 
             * @param {ObjectId} accountId - the _id of the user
             * @param {Function} done - required callback, passed requests retrieved
             */
            getRequests : function (accountId, done) {

                var self = this;

                var friendships = {
                    sent: [],
                    received: []
                };

                this.getSentRequests(accountId, function (err, sentRequests) {
                    if (err) {
                        done(err);
                    } else {
                        friendships.sent = sentRequests;

                        self.getReceivedRequests(accountId, function (err, receivedRequests) {
                            if (err) {
                                done(err);
                            } else {
                                friendships.received = receivedRequests;
                                done(null, friendships);
                            }
                        });
                    }
                });
            },

            /**
             *  Model.getSentRequests() - get requests the given user has sent
             *
             * @param {ObjectId} accountId - the _id of the user
             * @param {Function} done - required callback, passed sent requests retrieved 
             */
            getSentRequests : function (accountId, done) {
                var self = this,
                    model = mongoose.model(accountRef, schema);

                var conditions = {
                    requester: accountId,
                    status: 'Pending'
                };

                var select = '_id created email privacy profile.displayName';

                Friendship.find(conditions, function (err, sentRequests) {
                    if (err) {
                        done(err)
                    } else if (sentRequests) {
                        model.populate(sentRequests, [
                            { path: 'requester', select: select },
                            { path: 'requested', select: select }
                        ], done);
                    } else {
                        done();
                    }
                })
            },

            /**
             *  Model.getReceivedRequests() - get requests received by the given user
             * 
             * @param {ObjectId} accountId - the _id of the user
             * @param {Function} done - required callback, passed received requests retrieved
             */
            getReceivedRequests : function (accountId, done) {

                var self = this,
                    model = mongoose.model(accountRef, schema);

                var conditions = {
                    requested: accountId,
                    status: 'Pending'
                }

                var select = '_id created email privacy profile.displayName';

                Friendship.find(conditions, function (err, receivedRequests) {
                    if (err) {
                        done(err);
                    } else if (receivedRequests) {
                        model.populate(receivedRequests, [
                            { path: 'requester', select: select },
                            { path: 'requested', select: select }
                        ], done);
                    } else {
                        done();
                    }
                });
            },

            /**
             *  Model.acceptRequest() - accept a friend request 
             * 
             * @param {ObjectId} requestedId - the _id of the user whose friendship was requested
             * @param {ObjectId} requesterId - the _id of the requester of friendship
             * @param {Function} done - required callback, passed the populated friendship accepted
             */
            acceptRequest : function (requestedId, requesterId, done) {
                var self = this,
                    model = mongoose.model(accountRef, schema);

                var conditions = {
                    requester: requesterId, 
                    requested: requestedId, 
                    status: 'Pending'
                };

                var select = '_id created email privacy profile';

                var updates = {
                    status: 'Accepted',
                    dateAccepted: Date.now()
                };

                Friendship.findOneAndUpdate(conditions, updates, function (err, friendship) {
                    if (err) {
                        throw err
                        done(err);
                    } else if (friendship) {
                        model.populate(friendship, [
                            { path: 'requester', select: select },
                            { path: 'requested', select: select }
                        ], done);
                    } else {
                        done('Request does not exist!');
                    }

                });
            },

            /**
             *  Model.denyRequest() - deny a friend request
             * 
             * @param {ObjectId} requestedId - the _id of the user whose friendship was requested
             * @param {ObjectId} requesterId - the _id of the requester of friendship
             * @param {Function} done - required callback, passed the denied friendship
             */
            denyRequest : function (requestedId, requesterId, done) {
                var conditions = {
                    requester: requesterId, 
                    requested: requestedId, 
                    status: 'Pending'
                };

                Friendship.findOne(conditions, function (err, request) {
                    if (err) {
                        done(err);
                    } else if (request) {
                        Friendship.remove(conditions, done);
                    } else {
                        done (new Error('Request does not exist!'));
                    }
                });
            },

            /**
             *  Model.getFriends() - get all friends of an account
             * 
             * @param {ObjectId} accountId - the _id of the account
             * @param {Function} done - required callback, passed an array of friends
             */
            getFriends : function (accountId, done) {

                debug('typeof done', typeof done);

                var self = this,
                    model = mongoose.model(accountRef, schema),
                    friends = [];

                // when looking up friends for a given user, we don't care who send the request
                var conditions = { 
                    '$or': [
                        { requester: accountId },
                        { requested: accountId }
                    ],
                    status: 'Accepted'
                };

                var select = '_id created email privacy profile';

                Friendship.find(conditions, function (err, friendships) {
                    if (err) {
                        done(err);
                    } else if (friendships) { 
                        debug('friendships', friendships);
                        model.populate(friendships, [
                            { path: 'requester', select: select },
                            { path: 'requested', select: select }
                        ], function (err, populatedFriendships) {
                            debug('populatedFriendships', populatedFriendships);
                            populatedFriendships.forEach(function (populatedFriendship) {
                                debug('populatedFriendship', populatedFriendship);
                                
                                if (accountId.equals(populatedFriendship.requester._id)) {
                                    friends.push(populatedFriendship.requested);
                                } else {
                                    friends.push(populatedFriendship.requester);
                                }

                                debug('friends', friends);
                            });
                            
                            done(null, friends);
                        });
                    } else { 
                        done(null, friends);
                    }
                });
            },

            /**
             *  Model.getFriendsOfFriends() - get friends of this account's friends
             * 
             * @param {ObjectId} accountId - the _id of the account
             * @param {Function} done - required callback, passed an array of friendsOfFriends
             */
            getFriendsOfFriends: function (accountId, done) {

                var friendsOfFriends = [];
                var friendResults = 0;

                // get the specified user's friends
                this.getFriends(accountId, function (err, friends) {
                    if (err) {
                        done(err);
                    // if the user has friends
                    } else if (friends.length) {
                        // loop through friends
                        friends.forEach(function (friend) {
                            // get each friend's friends
                            friend.getFriends(function (err, friendsOfFriend) {
                                if (err) {
                                    done(err);
                                } else {
                                    // if the friend has friends
                                    if (friendsOfFriend.length) {
                                        // loop though friends of friend
                                        friendsOfFriends.forEach(function(friendOfFriend) {
                                            // add each friend of friend to the results
                                            friendsOfFriends.push(friendOfFriend);
                                        });
                                    }

                                    // if all getFriends callbacks have been called
                                    if (++friendResults === friends.length) {
                                        done(null, friendsOfFriends);
                                    }
                                } 
                            });
                        });
                    // if the user has no friends
                    } else {
                        done(null, friendsOfFriends);
                    }
                });
            },

            /**
             *  Model.isFriend() - determine if accountId2 is a friend of accountId1
             * 
             * @param {ObjectId} accountId1 - the _id of account1
             * @param {ObjectId} accountId2 - the _id of account2
             * @param {Function} done - required callback, passed a boolean determination
             */
            isFriend: function (accountId1, accountId2, done) {

                var self = this;

                var answer = false;

                // get friends of accountId1
                this.getFriends(accountId1, function (err, friends) {
                    if (err) {
                        done(err);
                    } else {
                        // if accountId1 has friends
                        if (friends.length) {
                            // loop through those friends
                            friends.forEach(function(friend) {
                                // if accountId2 matches this friends's _id
                                if (accountId2.equals(friend._id)) {
                                    // then yes, accountId2 is a friend of accountId1
                                    answer = true;
                                }
                            });
                        }
                        done(err, answer);
                    }
                });
            },

            /**
             *  Model.isFriendOfFriends() - determine if accountId1 and accountId2 have any common friends
             * 
             * @param {ObjectId} accountId1 - the _id of account1
             * @param {ObjectId} accountId2 - the _id of account2
             * @param {Function} done - required callback, passed a boolean determination
             */
            isFriendOfFriends: function (accountId1, accountId2, done) {
                var self = this;

                var answer = false;

                this.getFriends(accountId1, function (err, friends1) {
                    if (err) {
                        done(err);
                    } else if (friends1.length > 0) {
                        self.getFriends(accountId2, function (err, friends2) {
                            if (err) {
                                done(err);
                            } else if (friends2.length > 0) {
                                // account1's friends
                                outerLoop:
                                for (var i=0; i<friends1.length; i++) {
                                    for (var j=0; j<friends2.length; j++) {
                                        // if friend1._id matches friend2._id
                                        if (friends1[i]._id.equals(friends2[j]._id) {
                                            // then yes, accountId2 is a friend of at least one of accountId1's friends
                                            answer = true;
                                            break outerLoop;
                                        }
                                    }
                                };
                                done(err, answer);
                            } else {
                                done(err, answer);
                            }
                        });
                    } else {
                        done(err, answer);
                    }
                });
            },

            /**
             *  Model.getFriendship() - get the friendship document itself
             * 
             * @param {ObjectId} accountId1 - the _id of account1
             * @param {ObjectId} accountId2 - the _id of account2
             * @param {Function} done - required callback, passed err and a Friendship document, if found
             */
            getFriendship: function (accountId1, accountId2, done) {
                var model = mongoose.model(accountRef, schema);

                var conditions = {
                    '$or': [
                        { requester: accountId1, requested: accountId2 },
                        { requester: accountId2, requested: accountId1 }
                    ],
                    status: 'Accepted'
                };

                var select = '_id created email privacy profile';

                Friendship.findOne(conditions, function (err, friendship) {
                    model.populate(friendship, [
                        { path: 'requester', select: select },
                        { path: 'requested', select: select }
                    ], done);
                });
            },

            /**
             *  Model.getRelationship() - determine the relationship between two users
             * 
             * @param {ObjectId} accountId1 - the _id of account1
             * @param {ObjectId} accountId2 - the _id of account2
             * @param {Function} done - required callback, passed err and a Relationship value
             */
            getRelationship: function (accountId1, accountId2, done) {
                var self = this;

                this.isFriend(accountId1, accountId2, function (err, answer) {
                    if (err) {
                        done(err)
                    } else {
                        if (answer) {
                            done(err, relationships.values.FRIENDS);
                        } else {
                            self.isFriendOfFriends(accountId1, accountId2, function (err, answer) {
                                if (err) {
                                    done(err);
                                } else {
                                    if (answer) {
                                        done(err, relationships.values.FRIENDS_OF_FRIENDS);
                                    } else {
                                        done(err, relationships.values.NOT_FRIENDS);
                                    }
                                }
                            });
                        }
                    }
                });
            },

            /**
             *  Model.viewProfile()
             */
            viewProfile: function (account1_Id, account2Email, done) {
                var self = this,
                    model = mongoose.model(accountRef, schema);

                model.findByUsername(account2Email, function (err, account2) {
                    debug('account2', account2);

                    if (err) {
                        done(err);
                    } else if (!account2) {
                        done();
                    } else {
                        self.getRelationship(account1_Id, account2._id, function (err, relationshipValue) {
                            debug('relationshipValue', relationshipValue);

                            if (err) {
                                done(err);
                            } else {
                                var accountInfo = { relationship: relationshipValue };

                                ['profile', 'friendRequests', 'chatRequests'].forEach(function (privProperty) {

                                    debug('privProperty', privProperty)

                                    // the value of the requested account's privacy property
                                    var propertyValue = account2.privacy[privProperty]
                                    debug('propertyValue', propertyValue);

                                    // for example, they are friends and the property value is friends of friends
                                    if (relationshipValue >= propertyValue) {
                                        debug('relationshipValue >= propertyValue');
                                        if (privProperty === 'profile') {
                                            accountInfo._id = account2._id;
                                            accountInfo.email = account2.email;
                                            accountInfo.profile = account2.profile;
                                        } else {
                                            accountInfo[privProperty] = true;
                                        }
                                    } else {
                                        debug('relationshipValue < propertyValue');
                                        accountInfo[privProperty] = false;
                                    }
                                });

                                debug('accountInfo', accountInfo);

                                if (accountInfo.profile === false) {
                                    done();
                                } else {
                                    done(null, accountInfo);
                                }
                            }
                        });
                    }
                });
            },

            search: function (userId, term, options, done) {

                var self = this,
                    model = mongoose.model(accountRef, schema);

                options = options || {};

                var limit = options.limit || 10;
                var skip = options.skip || 0;

                var conditions = {
                    '$or': [
                        {'profile.displayName': new RegExp(term,'i')}, 
                        {'profile.firstName': new RegExp(term, 'i')}, 
                        {'profile.lastName': new RegExp(term, 'i')}
                    ],
                    '_id': { '$ne' : userId },
                    'privacy.search' : { '$gte' : privacy.values.FRIENDS }
                };

                for (var name in conditions) {
                    debug('conditions.'+name, conditions[name]);
                };

                var select = '_id created email privacy profile';
                
                options = { limit: limit, skip: skip }

                debug('conditions', conditions);
                debug('options', options);

                var results = {
                        friends: [],
                        friendsOfFriends: [],
                        nonFriends: []
                    },
                    // ids array contains a string for each found account's _id this 
                    // allows us to prevent duplicates if a friend of friend is also 
                    // your friend already shown, for example
                    ids = [],
                    self=this;


                // search the users's friends
                this.getFriends(userId, function (err, friends) {

                    if (err) {
                        done(err);
                    }

                    debug('friends', friends);

                    // if friends were found
                    if (friends.length > 0) {

                        var friendsResults = 0;

                        // go through each friend
                        friends.forEach(function (friend) {

                            debug('friend', friend);

                            // add their _id to the ids array 
                            ids.push(friend._id.toString());
                            results.friends.push(friend);

                            conditions['privacy.search'] = { '$gte': self.privacy.values.FRIENDS_OF_FRIENDS }

                            // search friends of each friend
                            friend.getFriends(conditions, options, function (err, friendsOfFriends) {

                                if (err) {
                                    done(err);
                                    return;
                                }

                                // if friends of friend were found
                                if (friendsOfFriends.length > 0) {
                                    debug('friendsOfFriends', friendsOfFriends);


                                    // go thorugh each friend of friend
                                    friendsOfFriends.forEach(function (friendOfFriend) {

                                        debug('friendOfFriend', friendOfFriend);

                                        // if the friend has not yet been selected
                                        if (ids.indexOf(friendOfFriend._id.toString()) === -1) {
                                            ids.push(friendOfFriend._id.toString());
                                            results.friendsOfFriends.push(friendOfFriend);
                                        }

                                    });
                                }

                                if (++friendsResults === friends.length) {
                                    nonFriendsSearch();
                                } 
                            });
                        });

                    } else {
                        nonFriendsSearch(); 
                    }

                });

                function nonFriendsSearch () {

                    conditions['privacy.search'] = { '$gte' : privacy.values.ANYBODY };
                    debug('conditions', conditions)

                    select = '_id created email profile.displayName';         

                    model.find(conditions, select, options, function (err, nonFriends) {
                        if (err) {
                            throw err
                            done(err);
                        } else {
                            debug('nonFriends',nonFriends);

                            if (nonFriends) {
                                nonFriends.forEach(function (nonFriend) {

                                    debug('nonFriend',nonFriend);
                                    if (ids.indexOf(nonFriend._id.toString()) === -1) {
                                        ids.push(nonFriend._id.toString());
                                        results.nonFriends.push(nonFriend);
                                    }
                                });                    
                            }

                            debug('results', results); 
                            done(null, results);
                        }
                    });   
                }   
            }
        });

        /**
         *  Document-accessible properties and methods
         * 
         * these instance methods are aliases of the Model statics as they apply to each document
         * 
         * example:
         *  var user = new Accounts({...});
         *  user.sendRequest(requestedEmail, function (err, request) {...})
         */
        schema.method({

            /**
             *  Document.sendRequest() - send a request to another account
             *
             * @param {ObjectId} requestedEmail - the _id of the account to whom the request will be sent
             * @param {Function} done - required callback, passed the populated request sent 
             */
            friendRequest : function (email, done) {
                schema.statics.friendRequest(this._id, email, done);
            },

            /**
             *  Document.getRequests() - get friend requests
             *
             * @param {Function} done - required callback, passed the populated requests retrieved
             */
            getRequests : function (done) {
                schema.statics.getRequests(this._id, done);
            },

            /**
             *  Document.getSentRequests() - get friend requests the user has sent
             *
             * @param {Function} done - required callback, passed the populated requests retrieved
             */
            getSentRequests : function (done) {
                schema.statics.getSentRequests(this._id, done);
            },

            /**
             *  Document.getReceivedRequests() - get friend requests the user has received
             *
             * @param {Function} done - required callback, passed the populated requests retrieved
             */
            getReceivedRequests : function (done) {
                schema.statics.getReceivedRequests(this._id, done);
            },

            /**
             *  Document.acceptRequest() - accept a friend request received from the specified user
             *
             * @param {ObjectId} requesterId - the _id of the account from whom the request was received
             * @param {Function} done - required callback, passed the populated request that was accepted
             */
            acceptRequest : function (requesterId, done) {

                schema.statics.acceptRequest(this._id, requesterId, done);
            },

            /**
             *  Document.denyRequest() - deny a friend request received from the specified user
             *
             * @param {ObjectId} requesterId - the _id of the account from whom the request was received
             * @param {Function} done - required callback, passed the populated request that was denied
             */
            denyRequest : function (requesterId, done) {
                schema.statics.denyRequest(this._id, requesterId, done);
            },

            /**
             *  Document.getFriends() - get this document's friends
             *
             * @param {Function} done - required callback, passed an array of friends
             */
            getFriends : function (done) {
                schema.statics.getFriends(this._id, done);
            },

            /**
             *  Document.getFriendsOfFriends() - get friends of this document's friends
             *
             * @param {Function} done - required callback, passed an array of friendsOfFriends
             */
            getFriendsOfFriends : function (done) {
                schema.statics.getFriendsOfFriends(this._id, done);
            },

            /**
             *  Document.isFriend() - determine if this document is friends with the specified account
             *
             * @param {ObjectId} accountId - the _id of the user to check for friendship
             * @param {Function} done - required callback, passed a boolean determination
             */
            isFriend: function (accountId, done) {
                schema.statics.isFriend(this._id, accountId, done);
            },

            /**
             *  Document.isFriend() - determine if this document shares any friends with the specified account
             *
             * @param {ObjectId} accountId - the _id of the user to check for friendship
             * @param {Function} done - required callback, passed a boolean determination
             */
            isFriendOfFriends : function (accountId, done) {
                schema.statics.isFriendOfFriends(this._id, accountId, done);
            },

            /**
             *  Document.getFriendship() - get the friendship document of this document and the specified account
             * 
             * @param {ObjectId} accountId - the _id of the friend
             * @param {Function} done - required callback, passed the populated friendship
             */
            getFriendship : function (accountId, done) {
                schema.statics.getFriendship(this._id, accountId, done);
            },

            /**
             *  Document.getRelationship() - get the relationship of this document and the specified account
             * 
             * @param {ObjectId} accountId - the _id of the friend
             * @param {Function} done - required callback, passed the relationship value
             */
            getRelationship : function (accountId, done) {
                schema.statics.getRelationship(this._id, accountId, done);
            },

            /**
             * Document.viewProfile() - get information from the given profile as allowed 
             */
            viewProfile : function (email, done) {
                schema.statics.viewProfile(this._id, email, done);
            },

            search : function (term, options, done) {
                schema.statics.search(this._id, term, options, done);
            }


        });

    };

    return {
        model: Friendship,
        plugin: friendshipPlugin
    }
};
