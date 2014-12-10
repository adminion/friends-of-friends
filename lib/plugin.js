
var debug = require('debug')('friends-of-friends'),
    mongoose = require('mongoose'),
    privacy = require('./privacy'),
    relationships = require('./relationships');

/**
 *  Adds friendship and privacy functionality to an accountSchema 
 */
module.exports = function (Friendship, accountRef) {

	return function friendshipPlugin (accountSchema) {

	    var settingDef = { 
	        type: Number, 
	        min: privacy.values.ANYBODY, 
	        max: privacy.values.NOBODY, 
	        default: privacy.values.NOBODY 
	    };

	    accountSchema.add({
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
	    accountSchema.static({

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
	                model = mongoose.model(accountRef, accountSchema);

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
	                        		? 'Friend request '
	                            done('', populatedFriendshipdone);
	                        } else {
	                            // check to see if they are NOT allowed to send a request
	                            if (!requestedAccountInfo.friendRequests) {
	                                done(new Error('You are not allowed to send this user a friend request.'));
	                                debug('friend request no allowed!');
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
	        },

	        /**
	         *  Model.getRequests() - get all friend requests for a given user
	         * 
	         * @param {ObjectId} accountId - the _id of the user
	         * @param {Function} done - required callback, passed requests retrieved
	         */
	        getRequests : function (accountId, done) {
				var model = mongoose.model(accountRef, accountSchema), 
	                select = '_id created email privacy profile.displayName';

	        	Friendship.getRequests(accountId, function (err, requests) {
	        		if (err) {
	                    done(err)
	                } else if (requests) {
	                    model.populate(requests, [
	                        { path: 'requester', select: select },
	                        { path: 'requested', select: select }
	                    ], done);
	                } else {
	                    done();
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
	            var model = mongoose.model(accountRef, accountSchema), 
	                select = '_id created email privacy profile.displayName';

	            Friendship.getSentRequests(accountId, function (err, sentRequests) {
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

	            var model = mongoose.model(accountRef, accountSchema),
	                select = '_id created email privacy profile.displayName';

	            Friendship.getReceivedRequests(accountId, function (err, receivedRequests) {
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
	            var model = mongoose.model(accountRef, accountSchema),
	                select = '_id created email privacy profile';

	            Friendship.acceptRequest(requestedId, requesterId, function (err, friendship) {
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
	        denyRequest : Friendship.denyRequest,

	        /**
	         *  Model.getFriends() - get all friends of an account
	         * 
	         * @param {ObjectId} accountId - the _id of the account
	         * @param {Function} done - required callback, passed an array of friends
	         */
	        getFriends : function (accountId, done) {

	            debug('typeof done', typeof done);

	            var self = this,
	                model = mongoose.model(accountRef, accountSchema),
	                friends = [];

	            var select = '_id created email privacy profile';

	            Friendship.getFriends(accountId, function (err, friendIds) {
	                if (err) {
	                    done(err);
	                } else {
	                	model.find({ '_id' : { '$in': friendIds } }, done);
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

	            var friendsOfFriends = [],
	            	friendResults = 0,
	            	model = mongoose.model(accountRef, accountSchema);

	            // get the specified user's friends
	            Friendship.getFriendsOfFriends(accountId, function (err, friendIdsOfFriends) {
	                if (err) {
	                    done(err);
	                } else {
	                	model.find({ '_id' : { '$in': friendIdsOfFriends } }, done);
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
	        isFriend: Friendship.isFriend,

	        /**
	         *  Model.isFriendOfFriends() - determine if accountId1 and accountId2 have any common friends
	         * 
	         * @param {ObjectId} accountId1 - the _id of account1
	         * @param {ObjectId} accountId2 - the _id of account2
	         * @param {Function} done - required callback, passed a boolean determination
	         */
	        isFriendOfFriends: Friendship.isFriendOfFriends,

	        /**
	         *  Model.getFriendship() - get the friendship document itself
	         * 
	         * @param {ObjectId} accountId1 - the _id of account1
	         * @param {ObjectId} accountId2 - the _id of account2
	         * @param {Function} done - required callback, passed err and a Friendship document, if found
	         */
	        getFriendship: function (accountId1, accountId2, done) {
	            var model = mongoose.model(accountRef, accountSchema);

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
	        getRelationship: Friendship.getRelationship,

	        /**
	         *  Model.viewProfile()
	         */
	        viewProfile: function (account1_Id, account2Email, done) {
	            var self = this,
	                model = mongoose.model(accountRef, accountSchema);

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
	                model = mongoose.model(accountRef, accountSchema);

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
	    accountSchema.method({

	        /**
	         *  Document.sendRequest() - send a request to another account
	         *
	         * @param {ObjectId} requestedEmail - the _id of the account to whom the request will be sent
	         * @param {Function} done - required callback, passed the populated request sent 
	         */
	        friendRequest : function (email, done) {
	            accountSchema.statics.friendRequest(this._id, email, done);
	        },

	        /**
	         *  Document.getRequests() - get friend requests
	         *
	         * @param {Function} done - required callback, passed the populated requests retrieved
	         */
	        getRequests : function (done) {
	            accountSchema.statics.getRequests(this._id, done);
	        },

	        /**
	         *  Document.getSentRequests() - get friend requests the user has sent
	         *
	         * @param {Function} done - required callback, passed the populated requests retrieved
	         */
	        getSentRequests : function (done) {
	            accountSchema.statics.getSentRequests(this._id, done);
	        },

	        /**
	         *  Document.getReceivedRequests() - get friend requests the user has received
	         *
	         * @param {Function} done - required callback, passed the populated requests retrieved
	         */
	        getReceivedRequests : function (done) {
	            accountSchema.statics.getReceivedRequests(this._id, done);
	        },

	        /**
	         *  Document.acceptRequest() - accept a friend request received from the specified user
	         *
	         * @param {ObjectId} requesterId - the _id of the account from whom the request was received
	         * @param {Function} done - required callback, passed the populated request that was accepted
	         */
	        acceptRequest : function (requesterId, done) {

	            accountSchema.statics.acceptRequest(this._id, requesterId, done);
	        },

	        /**
	         *  Document.denyRequest() - deny a friend request received from the specified user
	         *
	         * @param {ObjectId} requesterId - the _id of the account from whom the request was received
	         * @param {Function} done - required callback, passed the populated request that was denied
	         */
	        denyRequest : function (requesterId, done) {
	            accountSchema.statics.denyRequest(this._id, requesterId, done);
	        },

	        /**
	         *  Document.getFriends() - get this document's friends
	         *
	         * @param {Function} done - required callback, passed an array of friends
	         */
	        getFriends : function (done) {
	            accountSchema.statics.getFriends(this._id, done);
	        },

	        /**
	         *  Document.getFriendsOfFriends() - get friends of this document's friends
	         *
	         * @param {Function} done - required callback, passed an array of friendsOfFriends
	         */
	        getFriendsOfFriends : function (done) {
	            accountSchema.statics.getFriendsOfFriends(this._id, done);
	        },

	        /**
	         *  Document.isFriend() - determine if this document is friends with the specified account
	         *
	         * @param {ObjectId} accountId - the _id of the user to check for friendship
	         * @param {Function} done - required callback, passed a boolean determination
	         */
	        isFriend: function (accountId, done) {
	            accountSchema.statics.isFriend(this._id, accountId, done);
	        },

	        /**
	         *  Document.isFriend() - determine if this document shares any friends with the specified account
	         *
	         * @param {ObjectId} accountId - the _id of the user to check for friendship
	         * @param {Function} done - required callback, passed a boolean determination
	         */
	        isFriendOfFriends : function (accountId, done) {
	            accountSchema.statics.isFriendOfFriends(this._id, accountId, done);
	        },

	        /**
	         *  Document.getFriendship() - get the friendship document of this document and the specified account
	         * 
	         * @param {ObjectId} accountId - the _id of the friend
	         * @param {Function} done - required callback, passed the populated friendship
	         */
	        getFriendship : function (accountId, done) {
	            accountSchema.statics.getFriendship(this._id, accountId, done);
	        },

	        /**
	         *  Document.getRelationship() - get the relationship of this document and the specified account
	         * 
	         * @param {ObjectId} accountId - the _id of the friend
	         * @param {Function} done - required callback, passed the relationship value
	         */
	        getRelationship : function (accountId, done) {
	            accountSchema.statics.getRelationship(this._id, accountId, done);
	        },

	        /**
	         * Document.viewProfile() - get information from the given profile as allowed 
	         */
	        viewProfile : function (email, done) {
	            accountSchema.statics.viewProfile(this._id, email, done);
	        },

	        search : function (term, options, done) {
	            accountSchema.statics.search(this._id, term, options, done);
	        }


	    });
	};
};