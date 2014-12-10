
var debug = require('debug')('friends-of-friends'),
    mongoose = require('mongoose'),
    plugin = require('./plugin'),
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
        /**
         *  Model.getRequests() - get all friend requests for a given user
         * 
         * @param {ObjectId} accountId - the _id of the user
         * @param {Function} done - required callback, passed requests retrieved
         */
        getRequests : function (accountId, done) {

            var self = this;

            var requests = {
                sent: [],
                received: []
            };

            this.getSentRequests(accountId, function (err, sentRequests) {
                if (err) {
                    done(err);
                } else {
                    requests.sent = sentRequests;

                    self.getReceivedRequests(accountId, function (err, receivedRequests) {
                        if (err) {
                            done(err);
                        } else {
                            requests.received = receivedRequests;
                            done(null, requests);
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
            var model = mongoose.model('FRIENDSHIP_REF', FriendshipSchema);

            var conditions = {
                requester: accountId,
                status: 'Pending'
            };

            var select = '_id created email privacy profile.displayName';

            model.find(conditions, function (err, sentRequests) {
                if (err) {
                    done(err)
                } else if (sentRequests) {
                    done(null, sentRequests);
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
            var model = mongoose.model('FRIENDSHIP_REF', FriendshipSchema);
            
            var conditions = {
                requested: accountId,
                status: 'Pending'
            }

            model.find(conditions, function (err, receivedRequests) {
                if (err) {
                    done(err);
                } else if (receivedRequests) {
                    done(null, receivedRequests);
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
            var model = mongoose.model('FRIENDSHIP_REF', FriendshipSchema);
            
            var conditions = {
                requester: requesterId, 
                requested: requestedId, 
                status: 'Pending'
            };

            var updates = {
                status: 'Accepted',
                dateAccepted: Date.now()
            };

            model.findOneAndUpdate(conditions, updates, function (err, friendship) {
                if (err) {
                    throw err
                    done(err);
                } else if (friendship) {
                    done(null, friendship);
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
            var model = mongoose.model('FRIENDSHIP_REF', FriendshipSchema);

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
         *  Model.getFriends() - get a list ids of friends of an account
         * 
         * @param {ObjectId} accountId - the _id of the account
         * @param {Function} done - required callback, passed an array of friendIds
         */
        getFriends : function (accountId, done) {

            debug('typeof done', typeof done);

            var model = mongoose.model('FRIENDSHIP_REF', FriendshipSchema),
                friendIds = [];

            // when looking up friendIds for a given user, we don't care who send the request
            var conditions = { 
                '$or': [
                    { requester: accountId },
                    { requested: accountId }
                ],
                status: 'Accepted'
            };

            model.find(conditions, function (err, friendships) {
                if (err) {
                    done(err);
                } else { 
                    debug('friendships', friendships);
                    friendships.forEach(function (friendship) {
                        debug('friendship', friendship);
                        
                        if (accountId.equals(friendship.requester)) {
                            friendIds.push(friendship.requested);
                        } else {
                            friendIds.push(friendship.requester);
                        }

                        debug('friendIds', friendIds);
                    });

                    done(null, friendIds);
                } 
                
            });
        },

        /**
         *  Model.getFriendsOfFriends() - get friendIds of this account's friends
         * 
         * @param {ObjectId} accountId - the _id of the account
         * @param {Function} done - required callback, passed an array of friendsOfFriends
         */
        getFriendsOfFriends: function (accountId, done) {

            var self = this, 
                friendIdsOfFriends = [],
                totalResults = 0;

            // get the specified user's friends' Ids
            this.getFriends(accountId, function (err, friendIds) {
                if (err) {
                    done(err);
                // if the user has no friends
                } else if (!friendIds.length) {
                    done(null, friendIdsOfFriends);
                // if the user has friends
                } else {
                    // loop through friendIds
                    friendIds.forEach(function (friendId) {
                        // get each friend's friendIds
                        self.getFriends(friendId, function (err, friendIdsOfFriend) {
                            if (err) {
                                done(err);
                            } else {
                                // if the friend has friends
                                if (friendIdsOfFriend.length) {
                                    // loop though friends of friend
                                    friendIdsOfFriend.forEach(function(friendIdOfFriend) {
                                        // add each friend of friend to the results
                                        friendIdsOfFriends.push(friendIdOfFriend);
                                    });
                                }

                                // if all getFriends callbacks have been called
                                if (++totalResults === friendIds.length) {
                                    done(null, friendIdsOfFriends);
                                }
                            } 
                        });
                    });
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

            // get friendIds of accountId1
            this.getFriends(accountId1, function (err, friendIds) {
                if (err) {
                    done(err);
                } else {
                    // if accountId1 has friendIds
                    if (friendIds.length) {

                        var i = 0;

                        // go through friendIds until we find accountId2, or we run out of friendIds
                        while (answer === false && i < friendIds.length) {
                            // if accountId2 matches this friends's _id
                            if (accountId2.equals(friendIds[i])) {
                                // then yes, accountId2 is a friend of accountId1
                                answer = true;
                            }
                            
                            // increment the index pointer
                            i++;
                        }
                    }

                    // return our answer
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

            this.getFriends(accountId1, function (err, account1FriendIds) {
                if (err) {
                    done(err);
                } else if (account1FriendIds.length > 0) {
                    self.getFriends(accountId2, function (err, account2FriendIds) {
                        if (err) {
                            done(err);
                        } else if (account2FriendIds.length > 0) {

                            var i = 0;

                            // as long as we haven't found a match an we haven't run out of account1FriendIds
                            while (answer === false && i < account1FriendIds.length) {
                                var j=0;

                                // as long as we haven't found a match and we haven't run out of account2FriendIds
                                while (answer === false && j < account2FriendIds.length) {
                                    // if the ids are equal
                                    if (account1FriendIds[i].equals(account2FriendIds[j])) {
                                        // then yes, accountId1 and accountId2 share at least one mutual friend
                                        answer = true;
                                    }

                                    // increment the account2Ids index pointer
                                    j++
                                }

                                // increment the account1Ids index pointer
                                i++;

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

    return {
        model: Friendship,
        plugin: plugin(Friendship, accountRef),
        privacy: privacy,
        relationships: relationships,
        schema: FriendshipSchema,
    }
};
