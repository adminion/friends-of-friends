/**
 * @module friendship
 */

var // debug = require('debug')('friends-of-friends:friendship'),
    mongoose = require('mongoose'),
    relationships = require('./relationships'),
    utils = require('techjeffharris-utils');

/**
 * the friendship initializer function
 * @type {function}
 */
module.exports = friendshipInit

/**
 * Configure then compile Friendship model
 * @param   {Object} options - configuration options 
 * @returns {Model} - the compiled Friendship model
 */
function friendshipInit(options) {

    // debug('options', options);

    var defaults = {
        accountName:    'Account',
        friendshipName: 'Friendship'
    };

    options = utils.extend(defaults, options);

    // debug('options', options);

    var ObjectId = mongoose.Schema.Types.ObjectId;

    var FriendshipSchema = new mongoose.Schema({
        requester: { type: ObjectId, ref: options.accountName, required: true, index: true },
        requested: { type: ObjectId, ref: options.accountName, required: true, index: true },
        status: { type: String, default: 'Pending', index: true},
        dateSent: { type: Date, default: Date.now, index: true },
        dateAccepted: { type: Date, required: false, index: true }
    });

    function getModel () {
        return mongoose.model(options.frmiendshipName, FriendshipSchema);
    };

    /** 
     * @class FriendshipModel
     */

    /**
     * default relationship constants
     * @member      relationships
     * @memberOf    FriendshipModel
     * @type        {Object}
     * @see         [Relationships]{@link module:relationships}
     */
    FriendshipSchema.statics.relationships = relationships;

    /**
     * get all friend requests for a given user
     * @function    FriendshipModel.getRequests
     * @param       {ObjectId} accountId    - the _id of the user
     * @param       {Function} done         - required callback, passed requests retrieved
     */
    FriendshipSchema.statics.getRequests = function (accountId, done) {
        // debug('getRequests')

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
    };

    /**
     * get requests the given user has sent
     * @function    FriendshipModel.getSentRequests
     * @param       {ObjectId} accountId    - the _id of the user
     * @param       {Function} done         - required callback, passed sent requests retrieved 
     */
    FriendshipSchema.statics.getSentRequests = function (accountId, done) {
        // debug('getSentRequests')

        var model = getModel()

        var conditions = {
            requester: accountId,
            status: 'Pending'
        };

        model.find(conditions, function (err, sentRequests) {
            if (err) {
                done(err)
            } else if (sentRequests) {
                done(null, sentRequests);
            } else {
                done();
            }
        });
    };

    /**
     * get requests received by the given user
     * @function    FriendshipModel.getReceivedRequests
     * @param       {ObjectId} accountId    - the _id of the user
     * @param       {Function} done         - required callback, passed received requests retrieved
     */
    FriendshipSchema.statics.getReceivedRequests = function (accountId, done) {
        // debug('getReceivedRequests')

        var model = getModel()

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
    };

    /**
     * accept a friend request 
     * @function    FriendshipModel.acceptRequest
     * @param       {ObjectId} requesterId  - the _id of the requester of friendship
     * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
     * @param       {Function} done         - required callback, passed the populated friendship accepted
     */
    FriendshipSchema.statics.acceptRequest = function (requesterId, requestedId, done) {
        // debug('acceptRequest')

        var model = getModel()

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
    };

    /**
     * deny a friend request
     * @function    FriendshipModel.denyRequest
     * @param       {ObjectId} requesterId  - the _id of the requester of friendship
     * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
     * @param       {Function} done         - required callback, passed the denied friendship
     */
    FriendshipSchema.statics.denyRequest = function (requesterId, requestedId, done) {
        // debug('denyRequest')

        var model = getModel()

        var conditions = {
            requester: requesterId, 
            requested: requestedId, 
            status: 'Pending'
        };

        model.findOne(conditions, function (err, request) {
            if (err) {
                done(err);
            } else if (request) {
                request.remove(done);
            } else {
                done (new Error('Request does not exist!'));
            }
        });
    };

    /**
     * get a list ids of friends of an account
     * @function    FriendshipModel.getFriends
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback, passed an array of friendIds
     */
    FriendshipSchema.statics.getFriends = function (accountId, done) {
        // debug('getFriends')

        var friendIds = [];

        // when looking up friendIds for a given user, we don't care who sent the request
        var conditions = { 
            '$or': [
                { requester: accountId },
                { requested: accountId }
            ],
            status: 'Accepted'
        };

        var model = this.model(this.modelName);

        this.find(conditions, function (err, friendships) {
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
            friendsOfFriendsIds = [],
            totalResults = 0,
            idsFound = [];

        // get the specified user's friends' Ids
        this.getFriends(accountId, function (err, friendIds) {
            if (err) {
                done(err);
            // if the user has no friends
            } else if (!friendIds.length) {
                done(null, friendsOfFriendsIds);
            // if the user has friends
            } else {
                // loop through friendIds
                friendIds.forEach(function (friendId) {
                    // get each friend's friendIds
                    self.getFriends(friendId, function (err, friendsOfFriendIds) {
                        if (err) {
                            done(err);
                        } else {
                            
                            // loop though friends of friend
                            friendsOfFriendIds.forEach(function (friendOfFriendId) {
                                if (idsFound.indexOf(friendOfFriendId) === -1 && !accountId.equals(friendOfFriendId)) {
                                    // add each friend of friend to the results
                                    idsFound.push(friendsOfFriendIds.toString());
                                    friendsOfFriendsIds.push(friendOfFriendId);
                                } else {
                                    debug('friend already counted!');
                                }
                            });
                        

                            // if all getFriends callbacks have been called
                            if (++totalResults === friendIds.length) {
                                done(null, friendsOfFriendsIds);
                            }
                        } 
                    });
                });
            }
        });
    };

    FriendshipSchema.statics.getNonFriends = function (accountId, done) {
        debug('getNonFriends');

        var model = mongoose.model(options.friendshipName, FriendshipSchema),
            self = this,
            nonFriendIds = [];

        // get ids of the account's friends
        this.getFriends(accountId, function (err, friendIds) {
            // get ids of the account's friendsOfFriends
            self.getFriendsOfFriends(accountId, function (err, friendsOfFriendsIds) {
                var conditions = {
                    '_id': { 
                        '$ne' : accountId,
                        '$nin': friendIds,
                        '$nin': friendsOfFriendsIds
                    }
                };

                model.find(conditions, done);
            });

        });
    };

    /**
     * determine if accountId2 is a friend of accountId1
     * @function    FriendshipModel.isFriend
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed a boolean determination
     */
    FriendshipSchema.statics.isFriend = function (accountId1, accountId2, done) {
        debug('isFriend')

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
     * @function    FriendshipModel.isFriendOfFriends
     * @param {ObjectId} accountId1 - the _id of account1
     * @param {ObjectId} accountId2 - the _id of account2
     * @param {Function} done       - required callback, passed a boolean determination
     */
    FriendshipSchema.statics.isFriendOfFriends = function (accountId1, accountId2, done) {
        debug('isFriendOfFriends')

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
    };

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
    };

    /**
     *  get the friendship document itself
     * @function    AccountModel.getFriendship
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed err and a Friendship document, if found
     */
    schema.statics.getFriendship = function (accountId1, accountId2, done) {
        // debug('getFriendship')

        var model = mongoose.model(options.accountName, schema);

        var conditions = {
            '$or': [
                { requester: accountId1, requested: accountId2 },
                { requester: accountId2, requested: accountId1 }
            ],
            status: 'Accepted'
        };

        Friendship.findOne(conditions, done);
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

        this.findById(friendshipId, function (err, friendship) {
            if (err) {
                done(err);
            } else if (!friendship) {
                done(new Error('Invalid friendshipId!'));
            } else {
                done(null, friendship.requester.equals(accountId));
            }
        });
    };

    /**
     * check to see if the given user is requested in a given friendship
     * @function    FriendshipModel.isRequested
     * @param       {ObjectId} friendshipId - the _id of the friendship
     * @param       {ObjectId} accountId - the _id of the account
     * @param       {Function} done - required callback
     */
    FriendshipSchema.statics.isRequested = function (friendshipId, accountId, done) {
        debug('isRequested')

        this.findById(friendshipId, function (err, friendship) {
            if (err) {
                done(err);
            } else if (!friendship) {
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
     */
    FriendshipSchema.methods.isRequester = function (accountId, done) {
        FriendshipSchema.statics.isRequester(this._id, accountId, done);
    };

    /**
     * check to see if the given user is the requested in this relationship
     * @function    FriendshipDocument.isRequested
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback
     */
    FriendshipSchema.methods.isRequested = function (accountId, done) {
        FriendshipSchema.statics.isRequested(this._id, accountId, done);
    };

    return getModel()
};
