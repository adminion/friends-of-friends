# Global





* * *

### exports(options) 

Configure then compile Friendship model

**Parameters**

**options**: `Object`, configuration options

**Returns**: `Model`, - the compiled Friendship model


## Class: FriendshipModel


**relationships**: `Object` , default relationship constants
### FriendshipModel.getRequests(accountId, done) 

get all friend requests involving a given user

**Parameters**

**accountId**: `ObjectId`, the _id of the user

**done**: `function`, required callback, passed requests retrieved


### FriendshipModel.getSentRequests(accountId, done) 

get requests the given user has sent

**Parameters**

**accountId**: `ObjectId`, the _id of the user

**done**: `function`, required callback, passed sent requests retrieved


### FriendshipModel.getReceivedRequests(accountId, done) 

get requests received by the given user

**Parameters**

**accountId**: `ObjectId`, the _id of the user

**done**: `function`, required callback, passed received requests retrieved


### FriendshipModel.acceptRequest(requesterId, requestedId, done) 

accept a friend request

**Parameters**

**requesterId**: `ObjectId`, the _id of the requester of friendship

**requestedId**: `ObjectId`, the _id of the user whose friendship was requested

**done**: `function`, required callback, passed the populated friendship accepted


### FriendshipModel.denyRequest(requesterId, requestedId, done) 

deny a friend request

**Parameters**

**requesterId**: `ObjectId`, the _id of the requester of friendship

**requestedId**: `ObjectId`, the _id of the user whose friendship was requested

**done**: `function`, required callback, passed the denied friendship


### FriendshipModel.getFriends(accountId, done) 

get a list ids of friends of an account

**Parameters**

**accountId**: `ObjectId`, the _id of the account

**done**: `function`, required callback, passed an array of friendIds


### FriendshipModel.getFriendsOfFriends(accountId, done) 

get friendIds of this account's friends

**Parameters**

**accountId**: `ObjectId`, the _id of the account

**done**: `function`, required callback, passed an array of friendsOfFriends


### FriendshipModel.areFriends(accountId1, accountId2, done) 

determine if accountId1 and accountId2 are friends

**Parameters**

**accountId1**: `ObjectId`, the _id of account1

**accountId2**: `ObjectId`, the _id of account2

**done**: `function`, required callback, passed a boolean determination


### FriendshipModel.areFriendsOfFriends(accountId1, accountId2, done) 

determine if accountId1 and accountId2 have any common friends

**Parameters**

**accountId1**: `ObjectId`, the _id of account1

**accountId2**: `ObjectId`, the _id of account2

**done**: `function`, required callback, passed a boolean determination


### FriendshipModel.getRelationship(accountId1, accountId2, done) 

get the numeric relationship of two accounts

**Parameters**

**accountId1**: `ObjectId`, the _id of account 1

**accountId2**: `ObjectId`, the _id of account 2

**done**: `function`, required callback


### FriendshipModel.getFriendship(accountId1, accountId2, done) 

get the friendship document of two accounts

**Parameters**

**accountId1**: `ObjectId`, the _id of account1

**accountId2**: `ObjectId`, the _id of account2

**done**: `function`, required callback, passed err and a Friendship document, if found


### FriendshipModel.isRequester(friendshipId, accountId, done) 

check to see if the given user is the requester in a given friendship

**Parameters**

**friendshipId**: `ObjectId`, the _id of the friendship document

**accountId**: `ObjectId`, the _id of the account

**done**: `function`, required callback


### FriendshipModel.isRequested(friendshipId, accountId, done) 

check to see if the given user is the requested in a given friendship

**Parameters**

**friendshipId**: `ObjectId`, the _id of the friendship

**accountId**: `ObjectId`, the _id of the account

**done**: `function`, required callback



## Class: FriendshipDocument


### FriendshipDocument.isRequester(accountId, done) 

check to see if the given user is the requester in this relationship

**Parameters**

**accountId**: `ObjectId`, the _id of the account

**done**: `function`, required callback


### FriendshipDocument.isRequested(accountId, done) 

check to see if the given user is the requested in this relationship

**Parameters**

**accountId**: `ObjectId`, the _id of the account

**done**: `function`, required callback




* * *










