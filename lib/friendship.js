
var async = require('async'),
    debug = require('debug')('friends-of-friends:friendship'),
    relationships = require('./relationships'),
    utils = require('techjeffharris-utils');

// Store the compiled Friendship model here, then just return it once it has been built
var FriendshipModel;

/**
 * Configure then compile Friendship model
 * @param   {Object} options - configuration options 
 * @returns {Model} - the compiled Friendship model
 */
module.exports = function friendshipInit(mongoose, options) {

    // simply return the FriendshipModel if it has been compiled
    if (FriendshipModel) return FriendshipModel;

    debug('mongoose', mongoose);
    debug('options', options);

    var ObjectId = mongoose.Schema.Types.ObjectId;

    var FriendshipSchema = new mongoose.Schema({
        requester: { type: ObjectId, ref: options.personModelName, required: true, index: true },
        requested: { type: ObjectId, ref: options.personModelName, required: true, index: true },
        status: { type: String, default: 'Pending', index: true},
        dateSent: { type: Date, default: Date.now, index: true },
        dateAccepted: { type: Date, required: false, index: true }
    });

    /** 
     * @class FriendshipModel
     */

    /**
     * default relationship constants
     * @member      relationships
     * @memberOf    FriendshipModel
     * @type        {Object}
     * @see         [FriendsOfFriends.relationships]{@link FriendsOfFriends.relationships}
     */
    FriendshipSchema.statics.relationships = relationships;

    /**
     * get all friend requests involving a given user
     * @function    FriendshipModel.getRequests
     * @param       {ObjectId} accountId    - the _id of the user
     * @param       {Function} done         - required callback, passed requests retrieved
     */
    FriendshipSchema.statics.getRequests = function (accountId, done) {
        debug('getRequests')

        var self = this;

        var requests = {
            sent: [],
            received: []
        };

        async.parallel({
            sent: function (complete) {
                self.getSentRequests(accountId, complete);
            },
            received: function (complete) {
                self.getReceivedRequests(accountId, complete);
            }
        }, 
        function (err, results) {
            if (err) return done(err);
            
            requests.sent = results.sent;
            requests.received = results.received;

            done(null, requests);
        });
    };

    /**
     * get requests the given user has sent
     * @function    FriendshipModel.getSentRequests
     * @param       {ObjectId} accountId    - the _id of the user
     * @param       {Function} done         - required callback, passed sent requests retrieved 
     */
    FriendshipSchema.statics.getSentRequests = function (accountId, done) {
        debug('getSentRequests')

        var conditions = {
            requester: accountId,
            status: 'Pending'
        };

        this.find(conditions, done);
    };

    /**
     * get requests received by the given user
     * @function    FriendshipModel.getReceivedRequests
     * @param       {ObjectId} accountId    - the _id of the user
     * @param       {Function} done         - required callback, passed received requests retrieved
     */
    FriendshipSchema.statics.getReceivedRequests = function (accountId, done) {
        debug('getReceivedRequests')

        var conditions = {
            requested: accountId,
            status: 'Pending'
        }

        this.find(conditions, done);
    };

    /**
     * accept a friend request 
     * @function    FriendshipModel.acceptRequest
     * @param       {ObjectId} requesterId  - the _id of the requester of friendship
     * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
     * @param       {Function} done         - required callback, passed the populated friendship accepted
     */
    FriendshipSchema.statics.acceptRequest = function (accountId1, accountId2, done) {
        debug('acceptRequest')

        debug('accountId1', accountId1)
        debug('accountId2', accountId2)


        var conditions = {
            '$or': [
                { requester: accountId1, requested: accountId2 },
                { requester: accountId2, requested: accountId1 }
            ],
            status: 'Pending'            
        };
        
        var updates = {
            status: 'Accepted',
            dateAccepted: Date.now()
        };

        var options = { 'new': true };

        this.findOneAndUpdate(conditions, updates, options, function (err, friendship) {
            if (err) {
                done(err);
            } else if (friendship) {
                done(null, friendship);
            } else {
                done(new Error('Cannot accept request that does not exist!'));
            }
        });
    };

    /**
     * cancel a friend request
     * @function    FriendshipModel.cancelRequest
     * @param       {ObjectId} requesterId  - the _id of the requester of friendship
     * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
     * @param       {Function} done         - required callback, passed the denied friendship
     */
    FriendshipSchema.statics.cancelRequest = function (accountId1, accountId2, done) {
        debug('cancelRequest')

        var conditions = {
            '$or': [
                { requester: accountId1, requested: accountId2 },
                { requester: accountId2, requested: accountId1 }
            ],
            status: 'Pending'            
        };

        this.remove(conditions, done);
    };

    /**
     * deny a friend request
     * @function    FriendshipModel.denyRequest
     * @param       {ObjectId} requesterId  - the _id of the requester of friendship
     * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
     * @param       {Function} done         - required callback, passed the denied friendship
     */
    FriendshipSchema.statics.denyRequest = function (accountId1, accountId2, done) {
        debug('denyRequest')

        var conditions = {
            '$or': [
                { requester: accountId1, requested: accountId2 },
                { requester: accountId2, requested: accountId1 }
            ],
            status: 'Pending'            
        };

        this.remove(conditions, done);
    };

    /**
     * get a list ids of friends of an account
     * @function    FriendshipModel.getFriends
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback, passed an array of friendIds
     */
    FriendshipSchema.statics.getFriends = function (accountId, done) {
        debug('getFriends')

        var friendIds = [];

        var conditions = { 
            '$or': [
                { requester: accountId },
                { requested: accountId }
            ],
            status: 'Accepted'
        };

        this.find(conditions, function (err, friendships) {
            if (err) {
                done(err);
            } else { 
                debug('friendships', friendships);

                friendships.forEach(function (friendship) {
                    debug('friendship', friendship);

                    if (friendship.requester.equals(accountId)) {
                        friendIds.push(friendship.requested);
                    } else {
                        friendIds.push(friendship.requester);
                    }

                });

                debug('friendIds', friendIds);

                done(null, friendIds);
            }

        });
    };

    /**
     * get friendIds of this account's friends
     * @function    FriendshipModel.getFriendsOfFriends
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback, passed an array of friendsOfFriends
     */
    FriendshipSchema.statics.getFriendsOfFriends = function (accountId, done) {
        debug('getFriendsOfFriends')

        var self = this, 
            idsFound = [];

        // get the specified user's friends' Ids
        this.getFriends(accountId, function (err, friendIds) {
            if (err) {
                done(err);
            // if the user has no friends
            } else if (!friendIds.length) {
                done(null, idsFound);
            // if the user has friends
            } else {

                async.map(friendIds, eachFriend, function (err, results) {
                    results.forEach(function (friendsFriends) {

                        friendsFriends.forEach(function (friendOfFriendId) {
                            if (idsFound.indexOf(friendOfFriendId) === -1 && !accountId.equals(friendOfFriendId)) {
                                // add each friend of friend to the results
                                idsFound.push(friendOfFriendId);
                                debug('adding' + friendOfFriendId)
                            } else {
                                debug(friendOfFriendId + ' already added');
                            }
                        })
                    });

                    done(null, idsFound);
                })

                function eachFriend (friendId, complete) {
                    // get each friend's friendIds
                    self.getFriends(friendId, complete);
                };
            }
        });
    };

    /**
     * get a list ids of pending friends of an account
     * @function    FriendshipModel.getPendingFriends
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback, passed an array of friendIds
     */
    FriendshipSchema.statics.getPendingFriends = function (accountId, done) {
        debug('getPendingFriends')

        var friendIds = [];

        var conditions = { 
            '$or': [
                { requester: accountId },
                { requested: accountId }
            ],
            status: 'Pending'
        };

        this.find(conditions, function (err, pendingFriendships) {
            if (err) {
                done(err);
            } else { 
                debug('pendingFriendships', pendingFriendships);

                pendingFriendships.forEach(function (pendingFriendship) {
                    debug('pendingFriendship', pendingFriendship);
                    
                    if (accountId.equals(pendingFriendship.requester)) {
                        friendIds.push(pendingFriendship.requested);
                    } else {
                        friendIds.push(pendingFriendship.requester);
                    }

                });

                debug('friendIds', friendIds);

                done(null, friendIds);
            }

        });
    };

    /**
     * determine if accountId1 and accountId2 are friends
     * @function    FriendshipModel.areFriends
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed a boolean determination
     */
    FriendshipSchema.statics.areFriends = function (accountId1, accountId2, done) {
        debug('areFriends')

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
    };

    /**
     * determine if accountId1 and accountId2 have any common friends
     * @function    FriendshipModel.areFriendsOfFriends
     * @param {ObjectId} accountId1 - the _id of account1
     * @param {ObjectId} accountId2 - the _id of account2
     * @param {Function} done       - required callback, passed a boolean determination
     */
    FriendshipSchema.statics.areFriendsOfFriends = function (accountId1, accountId2, done) {
        debug('areFriendsOfFriends')

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

                                j++;
                            }

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
    };

    /**
     * determine if two users are pending friends
     * @param  {ObjectId}   accountId1 - the _id of account1
     * @param  {ObjectId}   accountId2 - the _id of account2
     * @param  {Function} done       - required callback.  passed an err, if any, or null then the friendship _id or false
     */
    FriendshipSchema.statics.arePendingFriends = function (accountId1, accountId2, done) {
        debug('arePendingFriends')

        var friendshipModel = mongoose.model(options.friendshipModelName);

        friendshipModel.getFriendship(accountId1, accountId2, function (err, friendship) {
            if (err) return done(err);

            if (friendship && friendship.status === 'Pending') {
                done(null, friendship._id);
            } else {
                done(null, false);
            }
        });
    }

    /**
     * get the numeric relationship of two accounts
     * @function    FriendshipModel.getRelationship
     * @param  {ObjectId} accountId1    - the _id of account 1
     * @param  {ObjectId} accountId2    - the _id of account 2
     * @param  {Function} done          - required callback 
     */
    FriendshipSchema.statics.getRelationship = function (accountId1, accountId2, done) {
        debug('getRelationship');

        var self = this;

        async.parallel({
            friends: function (finished) {
                self.areFriends(accountId1, accountId2, finished);
            },
            pending: function (finished) {
                self.arePendingFriends(accountId1, accountId2, finished);
            },
            friendsOfFriends: function (finished) {
                self.areFriendsOfFriends(accountId1, accountId2, finished);
            }
        }, function (err, answers) {
            if (err) return done(err);

            if (answers.friends)            return done(null, relationships.FRIENDS);
            if (answers.pending)            return done(null, relationships.PENDING_FRIENDS);
            if (answers.friendsOfFriends)   return done(null, relationships.FRIENDS_OF_FRIENDS);

            done(null, relationships.NOT_FRIENDS);

        });
    };

    /**
     *  get the friendship document of two accounts
     * @function    FriendshipModel.getFriendship
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed err and a Friendship document, if found
     */
    FriendshipSchema.statics.getFriendship = function (accountId1, accountId2, done) {
        debug('getFriendship')

        var friendshipModel = mongoose.model(options.friendshipModelName);

        var conditions = {
            '$or': [
                { requester: accountId1, requested: accountId2 },
                { requester: accountId2, requested: accountId1 }
            ]
        };

        friendshipModel.findOne(conditions, done);
    };

    /**
     * check to see if the given user is the requester in a given friendship
     * @function    FriendshipModel.isRequester
     * @param       {ObjectId}   friendshipId - the _id of the friendship document
     * @param       {ObjectId}   accountId    - the _id of the account
     * @param       {Function}   done         - required callback
     */
    FriendshipSchema.statics.isRequester = function (friendshipId, accountId, done) {
        debug('isRequester')

        var friendshipModel = mongoose.model(options.friendshipModelName);

        friendshipModel.findById(friendshipId, function (err, friendship) {
            if (err) return done(err);
            
            if (!friendship) {
                done(new Error('Invalid friendshipId!'));
            } else {
                done(null, friendship.requester.equals(accountId));
            }
        });
    };

    /**
     * check to see if the given user is the requested in a given friendship
     * @function    FriendshipModel.isRequested
     * @param       {ObjectId} friendshipId - the _id of the friendship
     * @param       {ObjectId} accountId - the _id of the account
     * @param       {Function} done - required callback
     */
    FriendshipSchema.statics.isRequested = function (friendshipId, accountId, done) {
        debug('isRequested')

        var friendshipModel = mongoose.model(options.friendshipModelName);

        friendshipModel.findById(friendshipId, function (err, friendship) {
            if (err) return done(err);
            
            if (!friendship) {
                done(new Error('Invalid friendshipId!'));
            } else {
                done(null, friendship.requested.equals(accountId));
            }
        });
    };

    /**
     * @class  FriendshipDocument
     */

    /**
     * check to see if the given user is the requester in this relationship
     * @function    FriendshipDocument.isRequester
     * @param       {ObjectId} accountId - the _id of the account
     * @param       {Function} done      - required callback
     * @see         [FriendshipModel.isRequester]{@link FriendshipModel.isRequester}
     */
    FriendshipSchema.methods.isRequester = function (accountId, done) {
        this.constructor.isRequester(this._id, accountId, done);
    };

    /**
     * check to see if the given user is the requested in this relationship
     * @function    FriendshipDocument.isRequested
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback
     * @see         [FriendshipModel.isRequested]{@link FriendshipModel.isRequested}
     */
    FriendshipSchema.methods.isRequested = function (accountId, done) {
        this.constructor.isRequested(this._id, accountId, done);
    };

    // "compile" the Friendship model
    FriendshipModel = mongoose.model(options.friendshipModelName, FriendshipSchema, options.friendshipCollectionName);
    
    // return the model
    return FriendshipModel;
};
