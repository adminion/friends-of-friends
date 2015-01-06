/**
 * @module plugin
 */

var //debug = require('debug')('friends-of-friends:plugin'),
    mongoose = require('mongoose'),
    relationships = require('./relationships'),
    utils = require('techjeffharris-utils');

/**
 * the mongoose plugin function
 * @type {Function}
 */
module.exports = friendshipPlugin;

/**
 * adds friends-of-friends functionality to an existing Schema
 * @param  {Schema} schema - The mongoose Schema that gets plugged
 * @param  {Object} options - Options passed to the plugin
 */
function friendshipPlugin (schema, options) {

    // debug('schema', schema)

    // debug('options', options)

    var defaults = {
        accountName:    'Account',
        friendshipName: 'Friendship'
    };

    options = utils.extend(defaults, options);

    // debug('options', options)

    var Friendship = mongoose.model(options.friendshipName);

    // debug('Friendship', Friendship)

    /*
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
    
    /**
     * @class AccountModel
     */
    
    /**
     * default relationship constants 
     * @member      relationships
     * @memberOf    AccountModel
     * @constant
     * @type        {Object}
     * @see         [Relationships]{@link module:relationships}
     */
    schema.statics.relationships = relationships;

    /**
     * sends a friend request to a another user
     * @function    AccountModel.friendRequest
     * @param       {ObjectId} requesterId    - the ObjectId of the account sending the request
     * @param       {ObjectId} requested_Id   - the ObjectId of the account to whom the request will be sent
     * @param       {Function} done           - required callback, passed the populated request 
     */
    schema.statics.friendRequest = function (requesterId, requestedEmail, done) {
        // debug('friendRequest');

        var self = this;

        // view the user's profile to see what we can do
        this.viewProfile(requesterId, requestedEmail, function (err, requestedAccountInfo) {
            if (err) {
                done(err);
            } else if (!requestedAccountInfo) {
                done();
            } else {

                // check for existing friendship or request
                self.getFriendship(requesterId, requestedAccountInfo._id, function (err, friendship) {
                    if (err) {
                        done(err);
                    } else if (friendship) {
                        var err = (friendship.status === 'Pending')
                            ? 'A pending request already exists'
                            : 'Cannot request friendship of friends';
                        done(err, populatedFriendship);
                    } else {
                        // check to see if they are NOT allowed to send a request
                        if (!requestedAccountInfo.friendRequests) {
                            done(new Error('You are not allowed to send this user a friend request.'));
                            // debug('friend request no allowed!');
                        } else {
                            var request = new Friendship({ 
                                requester: requesterId,
                                requested: requestedAccountInfo._id
                            }).save(done);
                        }
                    }
                });
            }
        });
    };

    /**
     *  get all friend requests for a given user
     * @function    AccountModel.getRequests
     * @param       {ObjectId} accountId  - the _id of the user
     * @param       {Function} done       - required callback, passed requests retrieved
     */
    schema.statics.getRequests = function (accountId, done) {
        // debug('getRequests')
        var self = this;

        Friendship.getRequests(accountId, function (err, requests) {
            if (err) {
                done(err)
            } else if (requests) {
                self.populate(requests, [
                    { path: 'requester' },
                    { path: 'requested' }
                ], done);
            } else {
                done();
            }
        });
    };

    /**
     *  get requests the given user has sent
     * @function    AccountModel.getSentRequests
     * @param       {ObjectId} accountId    - the _id of the user
     * @param       {Function} done         - required callback, passed sent requests retrieved 
     */
    schema.statics.getSentRequests = function (accountId, done) {
        // debug('getSentRequests')

        var self = this;

        Friendship.getSentRequests(accountId, function (err, sentRequests) {
            if (err) {
                done(err)
            } else if (sentRequests) {
                self.populate(sentRequests, [
                    { path: 'requester' },
                    { path: 'requested' }
                ], done);
            } else {
                done();
            }
        })
    };

    /**
     *  get requests received by the given user
     * @function    AccountModel.getReceivedRequests
     * @param {ObjectId} accountId - the _id of the user
     * @param {Function} done - required callback, passed received requests retrieved
     */
    schema.statics.getReceivedRequests = function (accountId, done) {
        // debug('getReceivedRequests')

        var self = this;

        Friendship.getReceivedRequests(accountId, function (err, receivedRequests) {
            if (err) {
                done(err);
            } else if (receivedRequests) {
                self.populate(receivedRequests, [
                    { path: 'requester' },
                    { path: 'requested' }
                ], done);
            } else {
                done();
            }
        });
    };

    /**
     *  accept a friend request 
     * @function    AccountModel.acceptRequest
     * @param       {ObjectId} requesterId  - the _id of the requester of friendship
     * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
     * @param       {Function} done         - required callback, passed the populated friendship accepted
     */
    schema.statics.acceptRequest = function (requesterId, requestedId, done) {
        // debug('acceptRequest')

        var self = this;

        Friendship.acceptRequest(requestedId, requesterId, function (err, friendship) {
            if (err) {
                throw err
                done(err);
            } else if (friendship) {
                self.populate(friendship, [
                    { path: 'requester' },
                    { path: 'requested' }
                ], done);
            } else {
                done('Request does not exist!');
            }

        });
    };

    /**
     *  deny a friend request
     * @function    AccountModel.denyRequest
     * @param       {ObjectId} requesterId  - the _id of the requester of friendship
     * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
     * @param       {Function} done         - required callback, passed the denied friendship
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
     */
    schema.statics.endFriendship = function (accountId1, accountId2, done) {
        this.getFriendship(accountId1, accountId2, function (err, friendship) {
            if (err) {
                done(err);
            } else if (!friendship) {
                done(new Error('Friendship not found!'));
            } else {
                friendship.remove(done);
            }
        })
    };

    /**
     *  get all friends of an account
     * @function    AccountModel.getFriends
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback, passed an array of friends
     */
    schema.statics.getFriends = function (accountId, done) {
        // debug('getFriends')

        var self = this;

        Friendship.getFriends(accountId, function (err, friendIds) {
            if (err) {
                done(err);
            } else {
                self.find({ '_id' : { '$in': friendIds } }, select, done);
            }
        });
    };

    /**
     *  get friends of this account's friends
     * @function    AccountModel.getFriendsOfFriends
     * @param       {ObjectId} accountId    - the _id of the account
     * @param       {Function} done         - required callback, passed an array of friendsOfFriends
     */
    schema.statics.getFriendsOfFriends = function (accountId, done) {
        // debug('getFriendsOfFriends')

        var self = this;

        // get the specified user's friends
        Friendship.getFriendsOfFriends(accountId, function (err, friendIdsOfFriends) {
            if (err) {
                done(err);
            } else {
                self.find({ '_id' : { '$in': friendIdsOfFriends } }, done);
            }
        });
    };

    schema.statics.getNonFriends = function (accountId, done) {
        // debug('getNonFriends');

        Friendship.getNonFriends(accountId, done);

    };

    /**
     *  determine if accountId2 is a friend of accountId1
     * @function    AccountModel.isFriend
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed a boolean determination
     */
    schema.statics.isFriend = function (accountId1, accountId2, done) {
         Friendship.isFriend(accountId1, accountId2, done);
    };

    /**
     *  determine if accountId1 and accountId2 have any common friends
     * @function    AccountModel.isFriendOfFriends
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed a boolean determination
     */
    schema.statics.isFriendOfFriends = function (accountId1, accountId2, done) {
         Friendship.isFriendOfFriends(accountId1, accountId2, done);
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

        var self = this;

        var conditions = {
            '$or': [
                { requester: accountId1, requested: accountId2 },
                { requester: accountId2, requested: accountId1 }
            ],
            status: 'Accepted'
        };

        Friendship.findOne(conditions, function (err, friendship) {
            self.populate(friendship, [
                { path: 'requester' },
                { path: 'requested' }
            ], done);
        });
    };

    /**
     *  determine the relationship between two users
     * @function    AccountModel.getRelationship
     * @param       {ObjectId} accountId1   - the _id of account1
     * @param       {ObjectId} accountId2   - the _id of account2
     * @param       {Function} done         - required callback, passed err and a Relationship value
     */
    schema.statics.getRelationship = function (accountId1, accountId2, done) {
        // debug('getRelationship');

        Friendship.getRelationship(accountId1, accountId2, done);
    };

/**
 *  Document-accessible properties and methods
 * 
 * these instance methods are aliases of the Model statics as they apply to each document
 * 
 * example:
 *  var user = new Accounts({...});
 *  user.sendRequest(requestedEmail, function (err, request) {...})
 *  
 *  @class AccountDocument
 */
   
    /**
     *  send a request to another account
     * @function    AccountDocument.friendRequest
     * @param       {ObjectId} requestedEmail   - the _id of the account to whom the request will be sent
     * @param       {Function} done             - required callback, passed the populated request sent 
     */
    schema.methods.friendRequest = function (email, done) {
        this.constructor.friendRequest(this._id, email, done);
    };

    /**
     *  get friend requests
     * @function    AccountDocument.getRequests
     * @param       {Function} done - required callback, passed the populated requests retrieved
     */
    schema.methods.getRequests = function (done) {
        this.constructor.getRequests(this._id, done);
    };

    /**
     * get friend requests the user has sent
     * @function    AccountDocument.getSentRequests
     * @param       {Function} done - required callback, passed the populated requests retrieved
     */
    schema.methods.getSentRequests = function (done) {
        this.constructor.getSentRequests(this._id, done);
    };

    /**
     *  get friend requests the user has received
     * @function    AccountDocument.getReceivedRequests
     * @param       {Function} done - required callback, passed the populated requests retrieved
     */
    schema.methods.getReceivedRequests = function (done) {
        this.constructor.getReceivedRequests(this._id, done);
    };

    /**
     *  accept a friend request received from the specified user
     * @function    AccountDocument.acceptRequest
     * @param       {ObjectId} requesterId  - the _id of the account from whom the request was received
     * @param       {Function} done         - required callback, passed the populated request that was accepted
     */
    schema.methods.acceptRequest = function (requesterId, done) {
        this.constructor.acceptRequest(requesterId, this._id, done);
    };

    /**
     *  deny a friend request received from the specified user
     * @function    AccountDocument.denyRequest
     * @param       {ObjectId} requesterId  - the _id of the account from whom the request was received
     * @param       {Function} done         - required callback, passed the populated request that was denied
     */
    schema.methods.denyRequest = function (requesterId, done) {
        this.constructor.denyRequest(requesterId, this._id, done);
    };

    /**
     * end a friendship with the specified user
     * @param  {ObjectId}   accountId - the _id of the account 
     * @param  {Function}   done      - required callback
     */
    schema.methods.endFriendship = function (accountId, done) {
        this.constructor.endFriendship(this._id, accountId, done);
    };

    /**
     *  get this document's friends
     * @function    AccountDocument.getFriends
     * @param       {Function} done - required callback, passed an array of friends
     */
    schema.methods.getFriends = function (done) {
        this.constructor.getFriends(this._id, done);
    };

    /**
     *  get friends of this document's friends
     * @function    AccountDocument.getFriendsOfFriends
     * @param       {Function} done - required callback, passed an array of friendsOfFriends
     */
    schema.methods.getFriendsOfFriends = function (done) {
        this.constructor.getFriendsOfFriends(this._id, done);
    };

    /**
     *  get accounts which are not this document's friends
     * @function    AccountDocument.getNonFriends
     * @param       {Function} done - required callback, passed an array of friendsOfFriends
     */
    schema.methods.getNonFriends = function (done) {
        this.constructor.getNonFriends(this._id, done);
    };

    /**
     *  determine if this document is friends with the specified account
     * @function    AccountDocument.isFriend
     * @param       {ObjectId} accountId    - the _id of the user to check for friendship
     * @param       {Function} done         - required callback, passed a boolean determination
     */
    schema.methods.isFriend = function (accountId, done) {
        this.constructor.isFriend(this._id, accountId, done);
    };

    /**
     *  determine if this document shares any friends with the specified account
     * @function    AccountDocument.isFriendOfFriends
     * @param       {ObjectId} accountId    - the _id of the user to check for friendship
     * @param       {Function} done         - required callback, passed a boolean determination
     */
    schema.methods.isFriendOfFriends = function (accountId, done) {
        this.constructor.isFriendOfFriends(this._id, accountId, done);
    };

    /**
     *  get the friendship document of this document and the specified account
     * @function    AccountDocument.getFriendship
     * @param       {ObjectId} accountId    - the _id of the friend
     * @param       {Function} done         - required callback, passed the populated friendship
     */
    schema.methods.getFriendship = function (accountId, done) {
        this.constructor.getFriendship(this._id, accountId, done);
    };

    /**
     *  get the relationship of this document and the specified account
     * @function    AccountDocument.getRelationship
     * @param       {ObjectId} accountId    - the _id of the friend
     * @param       {Function} done         - required callback, passed the relationship value
     */
    schema.methods.getRelationship = function (accountId, done) {
        this.constructor.getRelationship(this._id, accountId, done);
    };
};
