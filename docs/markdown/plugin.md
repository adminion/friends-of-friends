# plugin





* * *

### plugin.friendshipPlugin(schema, options) 

adds friends-of-friends functionality to an existing Schema

**Parameters**

**schema**: `Schema`, The mongoose Schema that gets plugged

**options**: `Object`, Options passed to the plugin



## Class: AccountModel


### plugin.AccountModel.friendRequest(requesterId, requested_Id, done) 

sends a friend request to a another user

**Parameters**

**requesterId**: `ObjectId`, the ObjectId of the account sending the request

**requested_Id**: `ObjectId`, the ObjectId of the account to whom the request will be sent

**done**: `function`, required callback, passed the populated request


### plugin.AccountModel.getRequests(accountId, done) 

get all friend requests for a given user

**Parameters**

**accountId**: `ObjectId`, the _id of the user

**done**: `function`, required callback, passed requests retrieved


### plugin.AccountModel.getSentRequests(accountId, done) 

get requests the given user has sent

**Parameters**

**accountId**: `ObjectId`, the _id of the user

**done**: `function`, required callback, passed sent requests retrieved


### plugin.AccountModel.getReceivedRequests(accountId, done) 

get requests received by the given user

**Parameters**

**accountId**: `ObjectId`, the _id of the user

**done**: `function`, required callback, passed received requests retrieved


### plugin.AccountModel.acceptRequest(requesterId, requestedId, done) 

accept a friend request

**Parameters**

**requesterId**: `ObjectId`, the _id of the requester of friendship

**requestedId**: `ObjectId`, the _id of the user whose friendship was requested

**done**: `function`, required callback, passed the populated friendship accepted


### plugin.AccountModel.denyRequest(requesterId, requestedId, done) 

deny a friend request

**Parameters**

**requesterId**: `ObjectId`, the _id of the requester of friendship

**requestedId**: `ObjectId`, the _id of the user whose friendship was requested

**done**: `function`, required callback, passed the denied friendship


### plugin.AccountModel.getFriends(accountId, done) 

get all friends of an account

**Parameters**

**accountId**: `ObjectId`, the _id of the account

**done**: `function`, required callback, passed an array of friends


### plugin.AccountModel.getFriendsOfFriends(accountId, done) 

get friends of this account's friends

**Parameters**

**accountId**: `ObjectId`, the _id of the account

**done**: `function`, required callback, passed an array of friendsOfFriends


### plugin.AccountModel.isFriend(accountId1, accountId2, done) 

determine if accountId2 is a friend of accountId1

**Parameters**

**accountId1**: `ObjectId`, the _id of account1

**accountId2**: `ObjectId`, the _id of account2

**done**: `function`, required callback, passed a boolean determination


### plugin.AccountModel.isFriendOfFriends(accountId1, accountId2, done) 

determine if accountId1 and accountId2 have any common friends

**Parameters**

**accountId1**: `ObjectId`, the _id of account1

**accountId2**: `ObjectId`, the _id of account2

**done**: `function`, required callback, passed a boolean determination


### plugin.AccountModel.getFriendship(accountId1, accountId2, done) 

get the friendship document itself

**Parameters**

**accountId1**: `ObjectId`, the _id of account1

**accountId2**: `ObjectId`, the _id of account2

**done**: `function`, required callback, passed err and a Friendship document, if found


### plugin.AccountModel.getRelationship(accountId1, accountId2, done) 

determine the relationship between two users

**Parameters**

**accountId1**: `ObjectId`, the _id of account1

**accountId2**: `ObjectId`, the _id of account2

**done**: `function`, required callback, passed err and a Relationship value



## Class: AccountDocument
Document-accessible properties and methods

these instance methods are aliases of the Model statics as they apply to each document

example:
 var user = new Accounts({...});
 user.sendRequest(requestedEmail, function (err, request) {...})

### plugin.AccountDocument.friendRequest(requestedEmail, done) 

send a request to another account

**Parameters**

**requestedEmail**: `ObjectId`, the _id of the account to whom the request will be sent

**done**: `function`, required callback, passed the populated request sent


### plugin.AccountDocument.getRequests(done) 

get friend requests

**Parameters**

**done**: `function`, required callback, passed the populated requests retrieved


### plugin.AccountDocument.getSentRequests(done) 

get friend requests the user has sent

**Parameters**

**done**: `function`, required callback, passed the populated requests retrieved


### plugin.AccountDocument.getReceivedRequests(done) 

get friend requests the user has received

**Parameters**

**done**: `function`, required callback, passed the populated requests retrieved


### plugin.AccountDocument.acceptRequest(requesterId, done) 

accept a friend request received from the specified user

**Parameters**

**requesterId**: `ObjectId`, the _id of the account from whom the request was received

**done**: `function`, required callback, passed the populated request that was accepted


### plugin.AccountDocument.denyRequest(requesterId, done) 

deny a friend request received from the specified user

**Parameters**

**requesterId**: `ObjectId`, the _id of the account from whom the request was received

**done**: `function`, required callback, passed the populated request that was denied


### plugin.AccountDocument.getFriends(done) 

get this document's friends

**Parameters**

**done**: `function`, required callback, passed an array of friends


### plugin.AccountDocument.getFriendsOfFriends(done) 

get friends of this document's friends

**Parameters**

**done**: `function`, required callback, passed an array of friendsOfFriends


### plugin.AccountDocument.getNonFriends(done) 

get accounts which are not this document's friends

**Parameters**

**done**: `function`, required callback, passed an array of friendsOfFriends


### plugin.AccountDocument.isFriend(accountId, done) 

determine if this document is friends with the specified account

**Parameters**

**accountId**: `ObjectId`, the _id of the user to check for friendship

**done**: `function`, required callback, passed a boolean determination


### plugin.AccountDocument.isFriendOfFriends(accountId, done) 

determine if this document shares any friends with the specified account

**Parameters**

**accountId**: `ObjectId`, the _id of the user to check for friendship

**done**: `function`, required callback, passed a boolean determination


### plugin.AccountDocument.getFriendship(accountId, done) 

get the friendship document of this document and the specified account

**Parameters**

**accountId**: `ObjectId`, the _id of the friend

**done**: `function`, required callback, passed the populated friendship


### plugin.AccountDocument.getRelationship(accountId, done) 

get the relationship of this document and the specified account

**Parameters**

**accountId**: `ObjectId`, the _id of the friend

**done**: `function`, required callback, passed the relationship value




* * *










