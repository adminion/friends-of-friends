
var debug = require('debug')('friends-of-friends:plugin'),
    mongoose = require('mongoose'),
    relationships = require('./relationships'),
    utils = require('techjeffharris-utils');

module.exports = function friendshipPlugin (schema, options) {

    // debug('schema', schema)

    debug('options', options)

    var defaults = {
        accountName:    'Account',
        friendshipName: 'Friendship'
    };

    options = utils.extend(defaults, options);

    debug('options', options)

    Friendship = require('./friendship')(options)

    /**
     *  Functions called on the Account Model itself
     * 
     * example:
     * ```javascript
     * Model.getFriends(Jeff._id, function (err, friends) {
     *      
     *     console.log('friends', friends);
     *  
     * });
     * ```
     *  
     * @class AccountModel
     */
    
    /**
     * default relationship constants 
     * @member      relationships
     * @memberOf    AccountModel
     * @constant
     * @type        {Object}
     * @see         [FriendsOfFriends.relationships]{@link FriendsOfFriends.relationships}
     */
    schema.statics.relationships = relationships;

    /**
     * sends a friend request to a another user
     * @function    AccountModel.friendRequest
     * @param       {ObjectId} requesterId    - the ObjectId of the account sending the request
     * @param       {ObjectId} requested_Id   - the ObjectId of the account to whom the request will be sent
     * @param       {Function} done           - required callback
     */
    schema.statics.friendRequest = function (requesterId, requestedId, done) {
        // debug('friendRequest');

        var accountModel = mongoose.model(options.accountName);

        var conditions = { 
            requester: requesterId, 
            requested: requestedId 
        };

        // check for existing friendship or request
        Friendship.findOne(conditions, function (err, friendship) {
            if (err) {
                done(err);
            } else if (friendship) {
                var error = new Error( (friendship.status === 'Pending')
                    ? 'A pending request already exists'
                    : 'Requester and requested are already friends'
                );

                accountModel.populate(friendship, 'requester requested', function (err, populatedFriendship) {
                    if (err) return done (err)

                    done(error, populatedFriendship)
                })
            } else {
                new Friendship(conditions).save(function (err, pendingFriendship) {
                    accountModel.populate(pendingFriendship, 'requester requested', done);
                })
            }
        });
    };

    /**
     *  get all friend requests for a given user
     * @function    AccountModel.getRequests
     * @param       {ObjectId} accountId  - the _id of the user
     * @param       {Function} done       - required callback, passed requests retrieved
     * @see         [FriendshipModel.getRequests]{@link FriendshipModel.getRequests}
     */
    schema.statics.getRequests = function (accountId, done) {
        // debug('getRequests')
        var accountModel = mongoose.model(options.accountName);

        Friendship.getRequests(accountId, function (err, requests) {
            if (err) {
                done(err)
            } else {
                accountModel.populate(requests, 'sent.requester sent.requested received.requester received.requested', done);
            }
        });
    };

    /**
     *  get requests the given user has sent
     * @function    AccountModel.getSentRequests
     * @param       {ObjectId} accountId    - the _id of the user
     * @param       {Function} done         - required callback, passed sent requests retrieved 
     * @see         [FriendshipModel.getSentRequests]{@link FriendshipModel.getSentRequests}
     */
    schema.statics.getSentRequests = function (accountId, done) {
        // debug('getSentRequests')

        var accountModel = mongoose.model(options.accountName);

        Friendship.getSentRequests(accountId, function (err, sentRequests) {
            if (err) {
                done(err)
            } else {
                accountModel.populate(sentRequests, 'requester requested', done);
            }
        })
    };

    /**
     *  get requests received by the given user
     * @function    AccountModel.getReceivedRequests
     * @param       {ObjectId} accountId - the _id of the user
     * @param       {Function} done - required callback, passed received requests retrieved
     * @see         [FriendshipModel.getReceivedRequests]{@link FriendshipModel.getReceivedRequests}
     */
    schema.statics.getReceivedRequests = function (accountId, done) {
        // debug('getReceivedRequests')

        var accountModel = mongoose.model(options.accountName);

        Friendship.getReceivedRequests(accountId, function (err, receivedRequests) {
            if (err) {
                done(err);
            } else {
                accountModel.populate(receivedRequests, 'requester requested', done);
            } 
        });
    };

    /**
     *  accept a friend request 
     * @function    AccountModel.acceptRequest
     * @param       {ObjectId} requesterId  - the _id of the requester of friendship
     * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
     * @param       {Function} done         - required callback, passed the populated friendship
     * @see         [FriendshipModel.acceptRequest]{@link FriendshipModel.acceptRequest}
     */
    schema.statics.acceptRequest = function (requesterId, requestedId, done) {
        // debug('acceptRequest')

        var accountModel = mongoose.model(options.accountName);

        Friendship.acceptRequest(requesterId, requestedId, function (err, friendship) {
            if (err) {
                done(err);
            } else {
                accountModel.populate(friendship, 'requester requested', done);
            }
        });
    };

    /**
     *  deny a friend request
     * @function    AccountModel.denyRequest
     * @param       {ObjectId} requesterId  - the _id of the requester of friendship
     * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
     * @param       {Function} done         - required callback, passed the denied friendship
     * @see         [FriendshipModel.denyRequest]{@link FriendshipModel.denyRequest}
     */
    schema.statics.denyRequest = function (requesterId, requestedId, done) {
         Friendship.denyRequest(requesterId, requestedId, done);
    };

    /**
     * end a friendship between two accounts
     * @function    AccountModel.endFriendship
     * @param       {ObjectId}   accountId1 - the _id of account 1
     * @param       {ObjectId}   accountId2 - the _id of account 2
     * @param       {Function} done       - required callback
     * @see         [FriendshipModel.endFriendship]{@link FriendshipModel.endFriendship}
     */
    schema.statics.endFriendship = function (accountId1, accountId2, done) {
        var conditions = { 
            '$or': [
                { requester: accountId1, requested: accountId2 },
                { requester: accountId2, requested: accountId1 }
            ],
            status: 'Accepted'
        };

        Friendship.remove(conditions, done)
    };

    /**
     *  get all friends of an account
     * @function    AccountModel.getFriends
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback, passed an array of friends
     * @see         [FriendshipModel.getFriends]{@link FriendshipModel.getFriends}
     */
    schema.statics.getFriends = function (accountId, done) {
        // debug('getFriends')

        var accountModel = mongoose.model(options.accountName);

        Friendship.getFriends(accountId, function (err, friendIds) {
            if (err) {
                done(err);
            } else {
                accountModel.find({ '_id' : { '$in': friendIds } }, done);
            }
        });
    };

    /**
     *  get friends of an account's friends
     * @function    AccountModel.getFriendsOfFriends
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback, passed an array of friendsOfFriends
     * @see         [FriendshipModel.getFriendsOfFriends]{@link FriendshipModel.getFriendsOfFriends}
     */
    schema.statics.getFriendsOfFriends = function (accountId, done) {
        // debug('getFriendsOfFriends')

        var accountModel = mongoose.model(options.accountName);

        // get the specified user's friendsOfFriends
        Friendship.getFriendsOfFriends(accountId, function (err, friendIdsOfFriends) {
            if (err) {
                done(err);
            } else {
                accountModel.find({ '_id' : { '$in': friendIdsOfFriends } }, done);
            }
        });
    };

    /**
     *  get friends of an account's pending friends
     * @function    AccountModel.getPendingFriends
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback, passed an array of friendsOfFriends
     * @see         [FriendshipModel.getPendingFriends]{@link FriendshipModel.getPendingFriends}
     */
    schema.statics.getPendingFriends = function (accountId, done) {
        var accountModel = mongoose.model(options.accountName);

        Friendship.getPendingFriends(accountId, function (err, pendingFriendIds) {
            if (err) {
                done(err);
            } else {
                accountModel.find({ '_id' : { '$in': pendingFriendIds } }, done);
            }
        })
    }

    /**
     * get all users that are not the given user's friends or friendsOfFriends
     * @param   {ObjectId} accountId - the _id of the user 
     * @param   {Function} done      - required callback
     * @see     [FriendshipModel.getNonFriends]{@link FriendshipModel.getNonFriends}
     */
    schema.statics.getNonFriends = function (accountId, done) {
        // debug('getNonFriends');
        debug('getNonFriends');

        var accountModel = mongoose.model(options.accountName),
            self = this;

        Friendship.getFriends(accountId, function (err, friendIds) {


            Friendship.getFriendsOfFriends(accountId, function (err, friendIdsOfFriends) {

                debug('friendIds of ' + accountId, friendIds)
                debug('friendIds of ' + accountId + '\'s friends', friendIdsOfFriends)

                var conditions = {
                    '_id': { 
                        '$ne' : accountId,
                        '$nin': friendIds.concat(friendIdsOfFriends)
                    }
                };

                accountModel.find(conditions, done);
            });

        });
    }; 

    /**
     *  determine if accountId1 and accountId2 are friends
     * @function    AccountModel.areFriends
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed a boolean determination
     * @see         [FriendshipModel.areFriends]{@link FriendshipModel.areFriends}
     */
    schema.statics.areFriends = function (accountId1, accountId2, done) {
         Friendship.areFriends(accountId1, accountId2, done);
    };

    /**
     *  determine if accountId1 and accountId2 have any common friends
     * @function    AccountModel.areFriendsOfFriends
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed a boolean determination
     * @see         [FriendshipModel.areFriendsOfFriends]{@link FriendshipModel.areFriendsOfFriends}
     */
    schema.statics.areFriendsOfFriends = function (accountId1, accountId2, done) {
         Friendship.areFriendsOfFriends(accountId1, accountId2, done);
    };

    /**
     *  determine if accountId1 and accountId2 have a pending friendship 
     * @param  {ObjectId}   accountId1 - the _id of account 1
     * @param  {ObjectId}   accountId2 - the _id of account 2
     * @param  {Function} done       - required callback, passed an error or null and a boolean determination
     */
    schema.statics.arePendingFriends = function (accountId1, accountId2, done) {
        Friendship.arePendingFriends(accountId1, accountId2, done);
    };

    /**
     *  get the friendship document itself
     * @function    AccountModel.getFriendship
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed err and a Friendship document, if found
     * @see         [FriendshipModel.getFriendship]{@link FriendshipModel.getFriendship}
     */
    schema.statics.getFriendship = function (accountId1, accountId2, done) {
        // debug('getFriendship')

        var accountModel = mongoose.model(options.accountName);

        Friendship.getFriendship(accountId1, accountId2, function (err, friendship) {
            accountModel.populate(friendship, 'requester requested', done);
        });
    };

    /**
     *  get the numeric relationship between two users
     * @function    AccountModel.getRelationship
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed err and a Relationship value
     * @see         [FriendshipModel.getRelationship]{@link FriendshipModel.getRelationship}
     */
    schema.statics.getRelationship = function (accountId1, accountId2, done) {
        // debug('getRelationship');

        Friendship.getRelationship(accountId1, accountId2, done);
    };

    /**
     * check to see if the given user is the requester in a given friendship
     * @function    AccountModel.isRequester
     * @param       {ObjectId}   friendshipId - the _id of the friendship document
     * @param       {ObjectId}   accountId    - the _id of the account
     * @param       {Function}   done         - required callback
     */
    schema.statics.isRequester = function (friendshipId, accountId, done) {
        // debug ('isRequester');
        Friendship.isRequester(friendshipId, accountId, done);
    };

    /**
     * check to see if the given user is the requested in a given friendship
     * @function    AccountModel.isRequested
     * @param       {ObjectId}   friendshipId - the _id of the friendship document
     * @param       {ObjectId}   accountId    - the _id of the account
     * @param       {Function}   done         - required callback
     */
    schema.statics.isRequested = function (friendshipId, accountId, done) {
        // debug ('isRequested');
        Friendship.isRequested(friendshipId, accountId, done);
    };

    /**
     *  Document-accessible properties and methods
     * 
     * These instance methods are aliases of the Model statics as they apply to each document
     * 
     * example:
     * ```javascript
     *  var jeff = new User({ username: "Jeff" }),
     *      zane = new User({ username: "Zane" });
     *      
     *  jeff.sendRequest(zane._id, function (err, request) {...});
     * ```
     *  
     *  @class AccountDocument
     */
   
    /**
     *  send a request to another account
     * @function    AccountDocument.friendRequest
     * @param       {ObjectId} requestedId  - the _id of the account to whom the request will be sent
     * @param       {Function} done         - required callback, passed the populated request sent 
     * @see         [AccountModel.friendRequest]{@link AccountModel.friendRequest}
     */
    schema.methods.friendRequest = function (requestedId, done) {
        this.constructor.friendRequest(this._id, requestedId, done);
    };

    /**
     *  get friend requests
     * @function    AccountDocument.getRequests
     * @param       {Function} done - required callback, passed the populated requests retrieved
     * @see         [AccountModel.getRequests]{@link AccountModel.getRequests}
     */
    schema.methods.getRequests = function (done) {
        this.constructor.getRequests(this._id, done);
    };

    /**
     * get friend requests the user has sent
     * @function    AccountDocument.getSentRequests
     * @param       {Function} done - required callback, passed the populated requests retrieved
     * @see         [AccountModel.getSentRequests]{@link AccountModel.getSentRequests}
     */
    schema.methods.getSentRequests = function (done) {
        this.constructor.getSentRequests(this._id, done);
    };

    /**
     *  get friend requests the user has received
     * @function    AccountDocument.getReceivedRequests
     * @param       {Function} done - required callback, passed the populated requests retrieved
     * @see         [AccountModel.getReceivedRequests]{@link AccountModel.getReceivedRequests}
     */
    schema.methods.getReceivedRequests = function (done) {
        this.constructor.getReceivedRequests(this._id, done);
    };

    /**
     *  accept a friend request received from the specified user
     * @function    AccountDocument.acceptRequest
     * @param       {ObjectId} requesterId  - the _id of the account from whom the request was received
     * @param       {Function} done         - required callback, passed the populated request that was accepted
     * @see         [AccountModel.acceptRequest]{@link AccountModel.acceptRequest}
     */
    schema.methods.acceptRequest = function (requesterId, done) {
        this.constructor.acceptRequest(requesterId, this._id, done);
    };

    /**
     *  deny a friend request received from the specified user
     * @function    AccountDocument.denyRequest
     * @param       {ObjectId} requesterId  - the _id of the account from whom the request was received
     * @param       {Function} done         - required callback, passed the populated request that was denied
     * @see         [AccountModel.denyRequest]{@link AccountModel.denyRequest}
     */
    schema.methods.denyRequest = function (requesterId, done) {
        this.constructor.denyRequest(requesterId, this._id, done);
    };

    /**
     * end a friendship with the specified user
     * @param   {ObjectId}   accountId - the _id of the account 
     * @param   {Function}   done      - required callback
     * @see     [AccountModel.endFriendship]{@link AccountModel.endFriendship}
     */
    schema.methods.endFriendship = function (accountId, done) {
        this.constructor.endFriendship(this._id, accountId, done);
    };

    /**
     *  get this document's friends
     * @function    AccountDocument.getFriends
     * @param       {Function} done - required callback, passed an array of friends
     * @see         [AccountModel.getFriends]{@link AccountModel.getFriends}
     */
    schema.methods.getFriends = function (done) {
        this.constructor.getFriends(this._id, done);
    };

    /**
     *  get friends of this document's friends
     * @function    AccountDocument.getFriendsOfFriends
     * @param       {Function} done - required callback, passed an array of friendsOfFriends
     * @see         [AccountModel.getFriendsOfFriends]{@link AccountModel.getFriendsOfFriends}
     */
    schema.methods.getFriendsOfFriends = function (done) {
        this.constructor.getFriendsOfFriends(this._id, done);
    };

    /**
     *  get friends of this account's pending friends
     * @function    AccountDocument.getPendingFriends
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback, passed an array of friendsOfFriends
     * @see         [AccountModel.getPendingFriends]{@link AccountModel.getPendingFriends}
     */
    schema.methods.getPendingFriends = function (done) {
        this.constructor.getPendingFriends(this._id, done);
    };

    /**
     *  get accounts which are not this document's friends
     * @function    AccountDocument.getNonFriends
     * @param       {Function} done - required callback, passed an array of friendsOfFriends
     * @see         [AccountModel.getNonFriends]{@link AccountModel.getNonFriends}
     */
    schema.methods.getNonFriends = function (done) {
        this.constructor.getNonFriends(this._id, done);
    };

    /**
     *  determine if this document is friends with the specified account
     * @function    AccountDocument.isFriend
     * @param       {ObjectId} accountId    - the _id of the user to check for friendship
     * @param       {Function} done         - required callback, passed a boolean determination
     * @see         [AccountModel.isFriend]{@link AccountModel.isFriend}
     */
    schema.methods.isFriend = function (accountId, done) {
        this.constructor.areFriends(this._id, accountId, done);
    };

    /**
     *  determine if this document shares any friends with the specified account
     * @function    AccountDocument.isFriendOfFriends
     * @param       {ObjectId} accountId    - the _id of the user to check for friendship
     * @param       {Function} done         - required callback, passed a boolean determination
     * @see         [AccountModel.isFriendOfFriends]{@link AccountModel.isFriendOfFriends}
     */
    schema.methods.isFriendOfFriends = function (accountId, done) {
        this.constructor.areFriendsOfFriends(this._id, accountId, done);
    };

    /**
     * determine if this document has a pending friendship with the specified account
     * @param  {ObjectId}   accountId - the _id of the account
     * @param  {Function} done      - required callback, passed a boolean determination
     */
    schema.methods.isPendingFriend = function (accountId, done) {
        this.constructor.arePendingFriends(this._id, accountId, done);
    };

    /**
     *  get the friendship document of this document and the specified account
     * @function    AccountDocument.getFriendship
     * @param       {ObjectId} accountId    - the _id of the friend
     * @param       {Function} done         - required callback, passed the populated friendship
     * @see         [AccofuntModel.getFriendship]{@link AccountModel.getFriendship}
     */
    schema.methods.getFriendship = function (accountId, done) {
        this.constructor.getFriendship(this._id, accountId, done);
    };

    /**
     *  get the relationship of this document and the specified account
     * @function    AccountDocument.getRelationship
     * @param       {ObjectId} accountId    - the _id of the friend
     * @param       {Function} done         - required callback, passed the relationship value
     * @see         [AccountModel.getRelationship]{@link AccountModel.getRelationship}
     */
    schema.methods.getRelationship = function (accountId, done) {
        this.constructor.getRelationship(this._id, accountId, done);
    };

    /**
     * check to see if the given user is the requester in this relationship
     * @function    AccountDocument.isRequester
     * @param       {ObjectId} accountId - the _id of the account
     * @param       {Function} done      - required callback
     * @see         [AccountModel.isRequester]{@link AccountModel.isRequester}
     */
    schema.methods.isRequester = function (friendshipId, done) {
        this.constructor.isRequester(friendshipId, this._id, done);
    };

    /**
     * check to see if the given user is the requested in this relationship
     * @function    AccountDocument.isRequested
     * @param       {ObjectId} accountId - the _id of the account
     * @param       {Function} done      - required callback
     * @see         [AccountModel.isRequested]{@link AccountModel.isRequested}
     */
    schema.methods.isRequested = function (friendshipId, done) {
        this.constructor.isRequested(friendshipId, this._id, done);
    }
};
