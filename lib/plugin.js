
var async = require('async'),
    debug = require('debug')('friends-of-friends:plugin'),
    relationships = require('./relationships'),
    utils = require('techjeffharris-utils');

module.exports = function pluginInit (mongoose) {

    return function friendshipPlugin (schema, pluginOptions) {

        // debug('schema', schema)
        
        debug('pluginOptions', pluginOptions);

        Friendship = require('./friendship')(mongoose, pluginOptions);

        /**
         *  Functions called on the Person Model itself
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
         * @class PersonModel
         */
        

        /**
         * statics access to the FriendshipModel
         * @member      Friendship
         * @memberOf    PersonModel
         * @type        {mongoose.Model}
         * @see         [FriendsOfFriends.FriendshipModel]{@link FriendsOfFriends.FriendshipModel}
         */
        schema.statics.Friendship = Friendship;
        
        /**
         * default relationship constants 
         * @member      relationships
         * @memberOf    PersonModel
         * @constant
         * @type        {Object}
         * @see         [FriendsOfFriends.relationships]{@link FriendsOfFriends.relationships}
         */
        schema.statics.relationships = relationships;

        /**
         * sends a friend request to a another user
         * @function    PersonModel.friendRequest
         * @param       {ObjectId} requesterId    - the ObjectId of the person sending the request
         * @param       {ObjectId} requested_Id   - the ObjectId of the person to whom the request will be sent
         * @param       {Function} done           - required callback
         */
        schema.statics.friendRequest = function (requesterId, requestedId, done) {
            debug('PersonModel.friendRequest');

            var personModel = mongoose.model(pluginOptions.personModelName);

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

                    personModel.populate(friendship, 'requester requested', function (err, populatedFriendship) {
                        if (err) return done (err)

                        done(error, populatedFriendship)
                    })
                } else {
                    new Friendship(conditions).save(function (err, pendingFriendship) {
                        personModel.populate(pendingFriendship, 'requester requested', done);
                    })
                }
            });
        };

        /**
         *  get all friend requests for a given user
         * @function    PersonModel.getRequests
         * @param       {ObjectId} personId  - the _id of the user
         * @param       {Function} done       - required callback, passed requests retrieved
         * @see         [FriendshipModel.getRequests]{@link FriendshipModel.getRequests}
         */
        schema.statics.getRequests = function (personId, done) {
            debug('PersonModel.getRequests')
            var personModel = mongoose.model(pluginOptions.personModelName);

            Friendship.getRequests(personId, function (err, requests) {
                if (err) {
                    done(err)
                } else {
                    personModel.populate(requests, 'sent.requester sent.requested received.requester received.requested', done);
                }
            });
        };

        /**
         *  get requests the given user has sent
         * @function    PersonModel.getSentRequests
         * @param       {ObjectId} personId    - the _id of the user
         * @param       {Function} done         - required callback, passed sent requests retrieved 
         * @see         [FriendshipModel.getSentRequests]{@link FriendshipModel.getSentRequests}
         */
        schema.statics.getSentRequests = function (personId, done) {
            debug('PersonModel.getSentRequests')

            var personModel = mongoose.model(pluginOptions.personModelName);

            Friendship.getSentRequests(personId, function (err, sentRequests) {
                if (err) {
                    done(err)
                } else {
                    personModel.populate(sentRequests, 'requester requested', done);
                }
            })
        };

        /**
         *  get requests received by the given user
         * @function    PersonModel.getReceivedRequests
         * @param       {ObjectId} personId - the _id of the user
         * @param       {Function} done - required callback, passed received requests retrieved
         * @see         [FriendshipModel.getReceivedRequests]{@link FriendshipModel.getReceivedRequests}
         */
        schema.statics.getReceivedRequests = function (personId, done) {
            debug('PersonModel.getReceivedRequests')

            var personModel = mongoose.model(pluginOptions.personModelName);

            Friendship.getReceivedRequests(personId, function (err, receivedRequests) {
                if (err) {
                    done(err);
                } else {
                    personModel.populate(receivedRequests, 'requester requested', done);
                } 
            });
        };

        /**
         *  accept a friend request 
         * @function    PersonModel.acceptRequest
         * @param       {ObjectId} requesterId  - the _id of the requester of friendship
         * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
         * @param       {Function} done         - required callback, passed the populated friendship
         * @see         [FriendshipModel.acceptRequest]{@link FriendshipModel.acceptRequest}
         */
        schema.statics.acceptRequest = function (requesterId, requestedId, done) {
            debug('PersonModel.acceptRequest')

            var personModel = mongoose.model(pluginOptions.personModelName);

            Friendship.acceptRequest(requesterId, requestedId, function (err, friendship) {
                if (err) {
                    done(err);
                } else {
                    personModel.populate(friendship, 'requester requested', done);
                }
            });
        };

        /**
         *  cancel a friend request
         * @function    PersonModel.cancelRequest
         * @param       {ObjectId} requesterId  - the _id of the requester of friendship
         * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
         * @param       {Function} done         - required callback, passed the denied friendship
         * @see         [FriendshipModel.cancelRequest]{@link FriendshipModel.cancelRequest}
         */
        schema.statics.cancelRequest = function (requesterId, requestedId, done) {
             Friendship.cancelRequest(requesterId, requestedId, done);
        };

        /**
         *  deny a friend request
         * @function    PersonModel.denyRequest
         * @param       {ObjectId} requesterId  - the _id of the requester of friendship
         * @param       {ObjectId} requestedId  - the _id of the user whose friendship was requested
         * @param       {Function} done         - required callback, passed the denied friendship
         * @see         [FriendshipModel.denyRequest]{@link FriendshipModel.denyRequest}
         */
        schema.statics.denyRequest = function (requesterId, requestedId, done) {
             Friendship.denyRequest(requesterId, requestedId, done);
        };

        /**
         * end a friendship between two persons
         * @function    PersonModel.endFriendship
         * @param       {ObjectId}   personId1 - the _id of person 1
         * @param       {ObjectId}   personId2 - the _id of person 2
         * @param       {Function} done       - required callback
         * @see         [FriendshipModel.endFriendship]{@link FriendshipModel.endFriendship}
         */
        schema.statics.endFriendship = function (personId1, personId2, done) {
            var conditions = { 
                '$or': [
                    { requester: personId1, requested: personId2 },
                    { requester: personId2, requested: personId1 }
                ],
                status: 'Accepted'
            };

            Friendship.remove(conditions, done)
        };

        /**
         *  get a perons's friends
         * @function    PersonModel.getFriends
         * @param       {ObjectId}  personId       - the _id of the person
         * @param       {Object}    findParams     - optional mongoose `Model.find()` parameters. @see [Model.find](http://mongoosejs.com/docs/api.html#model_Model.find)
         * @param       {Function}  done            - required callback, passed an array of friends
         * @see         [FriendshipModel.getFriends]{@link FriendshipModel.getFriends}
         */
        schema.statics.getFriends = function (personId, findParams, done) {
            debug('PersonModel.getFriends')

             if (typeof findParams === 'function') {
                done = findParams;
            }

            var conditions = utils.extend({}, findParams.conditions);

            var projection = (typeof findParams.projection === 'string') 
                ? findParams.projection
                : utils.extend({}, findParams.projection)

            var options = utils.extend({}, findParams.options);

            var personModel = mongoose.model(pluginOptions.personModelName);

            Friendship.getFriends(personId, function (err, friendIds) {
                if (err) {
                    done(err);
                } else {
                    conditions._id = { '$in': friendIds };
                    personModel.find(conditions, projection, options, done);
                }
            });
        };

        /**
         *  get a person's friends-of-friends.  friends-of-friends are non-friends with whom this person has at least one mutual friend.
         *  get friends of a person's friends
         * @function    PersonModel.getFriendsOfFriends
         * @param       {ObjectId}  personId       - the _id of the person
         * @param       {Object}    findParams     - optional mongoose find params. @see [Model.find](http://mongoosejs.com/docs/api.html#model_Model.find)
         * @param       {Function}  done            - required callback, passed an array of friendsOfFriends
         * @see         [FriendshipModel.getFriendsOfFriends]{@link FriendshipModel.getFriendsOfFriends}
         */
        schema.statics.getFriendsOfFriends = function (personId, findParams, done) {
            debug('PersonModel.getFriendsOfFriends')

            if (typeof findParams === 'function') {
                done = findParams;
            }

            var conditions = utils.extend({}, findParams.conditions);
            
            var projection = (typeof findParams.projection === 'string') 
                ? findParams.projection
                : utils.extend({}, findParams.projection)

            var options = utils.extend({}, findParams.options);

            var personModel = mongoose.model(pluginOptions.personModelName);

            // get the specified user's friendsOfFriends
            Friendship.getFriendsOfFriends(personId, function (err, friendIdsOfFriends) {
                if (err) {
                    done(err);
                } else {
                    conditions._id = { '$in': friendIdsOfFriends };
                    personModel.find(conditions, projection, options, done);
                }
            });
        };

        /**
         *  get a person's pending friends
         *  get friends of a person's pending friends
         * @function    PersonModel.getPendingFriends
         * @param       {ObjectId}  personId       - the _id of the person
         * @param       {Object}    findParams     - optional mongoose find params. @see [Model.find](http://mongoosejs.com/docs/api.html#model_Model.find)
         * @param       {Function}  done            - required callback, passed an array of friendsOfFriends
         * @see         [FriendshipModel.getPendingFriends]{@link FriendshipModel.getPendingFriends}
         */
        schema.statics.getPendingFriends = function (personId, findParams, done) {
            debug('PersonModel.getFriendsOfFriends')

            if (typeof findParams === 'function') {
                done = findParams;
            }

            var conditions = utils.extend({}, findParams.conditions);
            
            var projection = (typeof findParams.projection === 'string') 
                ? findParams.projection
                : utils.extend({}, findParams.projection)

            var options = utils.extend({}, findParams.options);

            var personModel = mongoose.model(pluginOptions.personModelName);

            Friendship.getPendingFriends(personId, function (err, pendingFriendIds) {
                if (err) {
                    done(err);
                } else {
                    conditions._id = { '$in': pendingFriendIds };
                    personModel.find(conditions, projection, options, done);
                }
            })
        }

        /**
         * get all users that are not the given user's friends
         * @function    PersonModel.getNonFriends
         * @param       {ObjectId}  personId   - the _id of the user 
         * @param       {Object}    findParams - optional mongoose find params. @see [Model.find](http://mongoosejs.com/docs/api.html#model_Model.find)
         * @param       {Function}  done        - required callback
         * @see         [FriendshipModel.getNonFriends]{@link FriendshipModel.getNonFriends}
         */
        schema.statics.getNonFriends = function (personId, findParams, done) {
            debug('PersonModel.getNonFriends');

            if (typeof findParams === 'function') {
                done = findParams;
            }

            var conditions = utils.extend({}, findParams.conditions);
            
            var projection = (typeof findParams.projection === 'string') 
                ? findParams.projection
                : utils.extend({}, findParams.projection)

            var options = utils.extend({}, findParams.options);

            var personModel = mongoose.model(pluginOptions.personModelName);

            async.parallel({
                friends: function (complete) {
                    Friendship.getFriends(personId, complete);
                },
                friendsOfFriends: function (complete) {
                    Friendship.getFriendsOfFriends(personId, complete);
                }
            }, function (err, results) {

                debug('friendIds of ' + personId, results.friendIds)
                debug('friendIds of ' + personId + '\'s friends', results.friendIdsOfFriends)
                conditions._id = { 
                    '$ne' : personId,
                    '$nin': results.friends
                };

                personModel.find(conditions, projection, options, done);
          
            });
        }; 

        /**
         *  determine if personId1 and personId2 are friends
         * @function    PersonModel.areFriends
         * @param       {ObjectId} personId1   - the _id of person1
         * @param       {ObjectId} personId2   - the _id of person2
         * @param       {Function} done         - required callback, passed a boolean determination
         * @see         [FriendshipModel.areFriends]{@link FriendshipModel.areFriends}
         */
        schema.statics.areFriends = function (personId1, personId2, done) {
             Friendship.areFriends(personId1, personId2, done);
        };

        /**
         *  determine if personId1 and personId2 have any common friends
         * @function    PersonModel.areFriendsOfFriends
         * @param       {ObjectId} personId1   - the _id of person1
         * @param       {ObjectId} personId2   - the _id of person2
         * @param       {Function} done         - required callback, passed a boolean determination
         * @see         [FriendshipModel.areFriendsOfFriends]{@link FriendshipModel.areFriendsOfFriends}
         */
        schema.statics.areFriendsOfFriends = function (personId1, personId2, done) {
             Friendship.areFriendsOfFriends(personId1, personId2, done);
        };

        /**
         *  determine if personId1 and personId2 have a pending friendship 
         * @param  {ObjectId}   personId1 - the _id of person 1
         * @param  {ObjectId}   personId2 - the _id of person 2
         * @param  {Function} done       - required callback, passed an error or null and a boolean determination
         */
        schema.statics.arePendingFriends = function (personId1, personId2, done) {
            debug('PersonModel.arePendingFriends')
            Friendship.arePendingFriends(personId1, personId2, done);
        };

        /**
         *  get the friendship document itself
         * @function    PersonModel.getFriendship
         * @param       {ObjectId} personId1   - the _id of person1
         * @param       {ObjectId} personId2   - the _id of person2
         * @param       {Function} done         - required callback, passed err and a Friendship document, if found
         * @see         [FriendshipModel.getFriendship]{@link FriendshipModel.getFriendship}
         */
        schema.statics.getFriendship = function (personId1, personId2, done) {
            debug('PersonModel.getFriendship')

            var personModel = mongoose.model(pluginOptions.personModelName);

            Friendship.getFriendship(personId1, personId2, function (err, friendship) {
                personModel.populate(friendship, 'requester requested', done);
            });
        };

        /**
         *  get the numeric relationship between two users
         * @function    PersonModel.getRelationship
         * @param       {ObjectId} personId1   - the _id of person1
         * @param       {ObjectId} personId2   - the _id of person2
         * @param       {Function} done         - required callback, passed err and a Relationship value
         * @see         [FriendshipModel.getRelationship]{@link FriendshipModel.getRelationship}
         */
        schema.statics.getRelationship = function (personId1, personId2, done) {
            debug('PersonModel.getRelationship');

            Friendship.getRelationship(personId1, personId2, done);
        };

        /**
         * check to see if the given user is the requester in a given friendship
         * @function    PersonModel.isRequester
         * @param       {ObjectId}   friendshipId - the _id of the friendship document
         * @param       {ObjectId}   personId    - the _id of the person
         * @param       {Function}   done         - required callback
         */
        schema.statics.isRequester = function (friendshipId, personId, done) {
            debug('PersonModel.isRequester');
            Friendship.isRequester(friendshipId, personId, done);
        };

        /**
         * check to see if the given user is the requested in a given friendship
         * @function    PersonModel.isRequested
         * @param       {ObjectId}   friendshipId - the _id of the friendship document
         * @param       {ObjectId}   personId    - the _id of the person
         * @param       {Function}   done         - required callback
         */
        schema.statics.isRequested = function (friendshipId, personId, done) {
            debug('PersonModel.isRequested');
            Friendship.isRequested(friendshipId, personId, done);
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
         *  @class PersonDocument
         */
       
        /**
         *  send a request to another person
         * @function    PersonDocument.friendRequest
         * @param       {ObjectId} requestedId  - the _id of the person to whom the request will be sent
         * @param       {Function} done         - required callback, passed the populated request sent 
         * @see         [PersonModel.friendRequest]{@link PersonModel.friendRequest}
         */
        schema.methods.friendRequest = function (requestedId, done) {
            debug('PersonDocument.friendRequest')
            this.constructor.friendRequest(this._id, requestedId, done);
        };

        /**
         *  get friend requests
         * @function    PersonDocument.getRequests
         * @param       {Function} done - required callback, passed the populated requests retrieved
         * @see         [PersonModel.getRequests]{@link PersonModel.getRequests}
         */
        schema.methods.getRequests = function (done) {
            debug('PersonDocument.getRequests');
            this.constructor.getRequests(this._id, done);
        };

        /**
         * get friend requests the user has sent
         * @function    PersonDocument.getSentRequests
         * @param       {Function} done - required callback, passed the populated requests retrieved
         * @see         [PersonModel.getSentRequests]{@link PersonModel.getSentRequests}
         */
        schema.methods.getSentRequests = function (done) {
            debug('PersonDocument.getSentRequests');
            this.constructor.getSentRequests(this._id, done);
        };

        /**
         *  get friend requests the user has received
         * @function    PersonDocument.getReceivedRequests
         * @param       {Function} done - required callback, passed the populated requests retrieved
         * @see         [PersonModel.getReceivedRequests]{@link PersonModel.getReceivedRequests}
         */
        schema.methods.getReceivedRequests = function (done) {
            debug('PersonDocument.getReceivedRequests');
            this.constructor.getReceivedRequests(this._id, done);
        };

        /**
         *  accept a friend request received from the specified user
         * @function    PersonDocument.acceptRequest
         * @param       {ObjectId} requesterId  - the _id of the person from whom the request was received
         * @param       {Function} done         - required callback, passed the populated request that was accepted
         * @see         [PersonModel.acceptRequest]{@link PersonModel.acceptRequest}
         */
        schema.methods.acceptRequest = function (requesterId, done) {
            debug('PersonDocument.acceptRequest');
            this.constructor.acceptRequest(requesterId, this._id, done);
        };

        /**
         *  cancel a friend request sent to the specified user
         * @function    PersonDocument.cancelRequest
         * @param       {ObjectId} requestedId  - the _id of the person to whom the request was sent
         * @param       {Function} done         - required callback, passed the populated request that was denied
         * @see         [PersonModel.cancelRequest]{@link PersonModel.cancelRequest}
         */
        schema.methods.cancelRequest = function (requestedId, done) {
            debug('PersonDocument.cancelRequest');
            this.constructor.cancelRequest(this._id, requestedId, done);
        };

        /**
         *  deny a friend request received from the specified user
         * @function    PersonDocument.denyRequest
         * @param       {ObjectId} requesterId  - the _id of the person from whom the request was received
         * @param       {Function} done         - required callback, passed the populated request that was denied
         * @see         [PersonModel.denyRequest]{@link PersonModel.denyRequest}
         */
        schema.methods.denyRequest = function (requesterId, done) {
            debug('PersonDocument.denyRequest');
            this.constructor.denyRequest(requesterId, this._id, done);
        };

        /**
         * end a friendship with the specified user
         * @param   {ObjectId}   personId - the _id of the person 
         * @param   {Function}   done      - required callback
         * @see     [PersonModel.endFriendship]{@link PersonModel.endFriendship}
         */
        schema.methods.endFriendship = function (personId, done) {
            debug('PersonDocument.endFriendship');
            this.constructor.endFriendship(this._id, personId, done);
        };

        /**
         *  get this document's friends
         * @function    PersonDocument.getFriends
         * @param       {Function} done - required callback, passed an array of friends
         * @see         [PersonModel.getFriends]{@link PersonModel.getFriends}
         */
        schema.methods.getFriends = function (findParams, done) {
            debug('PersonDocument.getFriends');
            this.constructor.getFriends(this._id, findParams, done);
        };

        /**
         *  get friends of this document's friends
         * @function    PersonDocument.getFriendsOfFriends
         * @param       {Function} done - required callback, passed an array of friendsOfFriends
         * @see         [PersonModel.getFriendsOfFriends]{@link PersonModel.getFriendsOfFriends}
         */
        schema.methods.getFriendsOfFriends = function (findParams, done) {
            debug('PersonDocument.getFriendsOfFriends');
            this.constructor.getFriendsOfFriends(this._id, findParams, done);
        };

        /**
         *  get this person's pending friends
         * @function    PersonDocument.getPendingFriends
         * @param       {ObjectId} personId    - the _id of the person
         * @param       {Function} done         - required callback, passed an array of friendsOfFriends
         * @see         [PersonModel.getPendingFriends]{@link PersonModel.getPendingFriends}
         */
        schema.methods.getPendingFriends = function (findParams, done) {
            debug('PersonDocument.getPendingFriends');
            this.constructor.getPendingFriends(this._id, findParams, done);
        };

        /**
         *  get persons which are not this document's friends
         * @function    PersonDocument.getNonFriends
         * @param       {Function} done - required callback, passed an array of friendsOfFriends
         * @see         [PersonModel.getNonFriends]{@link PersonModel.getNonFriends}
         */
        schema.methods.getNonFriends = function (findParams, done) {
            debug('PersonDocument.getNonFriends');
            this.constructor.getNonFriends(this._id, findParams, done);
        };

        /**
         *  determine if this document is friends with the specified person
         * @function    PersonDocument.isFriend
         * @param       {ObjectId} personId    - the _id of the user to check for friendship
         * @param       {Function} done         - required callback, passed a boolean determination
         * @see         [PersonModel.isFriend]{@link PersonModel.isFriend}
         */
        schema.methods.isFriend = function (personId, done) {
            debug('PersonDocument.isFriend');
            this.constructor.areFriends(this._id, personId, done);
        };

        /**
         *  determine if this document shares any friends with the specified person
         * @function    PersonDocument.isFriendOfFriends
         * @param       {ObjectId} personId    - the _id of the user to check for friendship
         * @param       {Function} done         - required callback, passed a boolean determination
         * @see         [PersonModel.isFriendOfFriends]{@link PersonModel.isFriendOfFriends}
         */
        schema.methods.isFriendOfFriends = function (personId, done) {
            debug('PersonDocument.isFriendOfFriends');
            this.constructor.areFriendsOfFriends(this._id, personId, done);
        };

        /**
         * determine if this document has a pending friendship with the specified person
         * @param  {ObjectId}   personId - the _id of the person
         * @param  {Function} done      - required callback, passed a boolean determination
         */
        schema.methods.isPendingFriend = function (personId, done) {
            debug('PersonDocument.isPendingFriend');
            this.constructor.arePendingFriends(this._id, personId, done);
        };

        /**
         *  get the friendship document of this document and the specified person
         * @function    PersonDocument.getFriendship
         * @param       {ObjectId} personId    - the _id of the friend
         * @param       {Function} done         - required callback, passed the populated friendship
         * @see         [AccofuntModel.getFriendship]{@link PersonModel.getFriendship}
         */
        schema.methods.getFriendship = function (personId, done) {
            debug('PersonDocument.getFriendship');
            this.constructor.getFriendship(this._id, personId, done);
        };

        /**
         *  get the relationship of this document and the specified person
         * @function    PersonDocument.getRelationship
         * @param       {ObjectId} personId    - the _id of the friend
         * @param       {Function} done         - required callback, passed the relationship value
         * @see         [PersonModel.getRelationship]{@link PersonModel.getRelationship}
         */
        schema.methods.getRelationship = function (personId, done) {
            debug('PersonDocument.getRelationship');
            this.constructor.getRelationship(this._id, personId, done);
        };

        /**
         * check to see if the given user is the requester in this relationship
         * @function    PersonDocument.isRequester
         * @param       {ObjectId} personId - the _id of the person
         * @param       {Function} done      - required callback
         * @see         [PersonModel.isRequester]{@link PersonModel.isRequester}
         */
        schema.methods.isRequester = function (friendshipId, done) {
            debug('PersonDocument.isRequester');
            this.constructor.isRequester(friendshipId, this._id, done);
        };

        /**
         * check to see if the given user is the requested in this relationship
         * @function    PersonDocument.isRequested
         * @param       {ObjectId} personId - the _id of the person
         * @param       {Function} done      - required callback
         * @see         [PersonModel.isRequested]{@link PersonModel.isRequested}
         */
        schema.methods.isRequested = function (friendshipId, done) {
            debug('PersonDocument.isRequested');
            this.constructor.isRequested(friendshipId, this._id, done);
        }
    };
}
