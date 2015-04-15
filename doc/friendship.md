#Index

**Classes**

* [class: FriendshipModel](#FriendshipModel)
  * [FriendshipModel.relationships](#FriendshipModel.relationships)
  * [FriendshipModel.getRequests(accountId, done)](#FriendshipModel.getRequests)
  * [FriendshipModel.getSentRequests(accountId, done)](#FriendshipModel.getSentRequests)
  * [FriendshipModel.getReceivedRequests(accountId, done)](#FriendshipModel.getReceivedRequests)
  * [FriendshipModel.acceptRequest(requesterId, requestedId, done)](#FriendshipModel.acceptRequest)
  * [FriendshipModel.cancelRequest(requesterId, requestedId, done)](#FriendshipModel.cancelRequest)
  * [FriendshipModel.denyRequest(requesterId, requestedId, done)](#FriendshipModel.denyRequest)
  * [FriendshipModel.getFriends(accountId, done)](#FriendshipModel.getFriends)
  * [FriendshipModel.getFriendsOfFriends(accountId, done)](#FriendshipModel.getFriendsOfFriends)
  * [FriendshipModel.getPendingFriends(accountId, done)](#FriendshipModel.getPendingFriends)
  * [FriendshipModel.areFriends(accountId1, accountId2, done)](#FriendshipModel.areFriends)
  * [FriendshipModel.areFriendsOfFriends(accountId1, accountId2, done)](#FriendshipModel.areFriendsOfFriends)
  * [FriendshipModel.getRelationship(accountId1, accountId2, done)](#FriendshipModel.getRelationship)
  * [FriendshipModel.getFriendship(accountId1, accountId2, done)](#FriendshipModel.getFriendship)
  * [FriendshipModel.isRequester(friendshipId, accountId, done)](#FriendshipModel.isRequester)
  * [FriendshipModel.isRequested(friendshipId, accountId, done)](#FriendshipModel.isRequested)
* [class: FriendshipDocument](#FriendshipDocument)
  * [FriendshipDocument.isRequester(accountId, done)](#FriendshipDocument.isRequester)
  * [FriendshipDocument.isRequested(accountId, done)](#FriendshipDocument.isRequested)
 
<a name="FriendshipModel"></a>
#class: FriendshipModel
**Members**

* [class: FriendshipModel](#FriendshipModel)
  * [FriendshipModel.relationships](#FriendshipModel.relationships)
  * [FriendshipModel.getRequests(accountId, done)](#FriendshipModel.getRequests)
  * [FriendshipModel.getSentRequests(accountId, done)](#FriendshipModel.getSentRequests)
  * [FriendshipModel.getReceivedRequests(accountId, done)](#FriendshipModel.getReceivedRequests)
  * [FriendshipModel.acceptRequest(requesterId, requestedId, done)](#FriendshipModel.acceptRequest)
  * [FriendshipModel.cancelRequest(requesterId, requestedId, done)](#FriendshipModel.cancelRequest)
  * [FriendshipModel.denyRequest(requesterId, requestedId, done)](#FriendshipModel.denyRequest)
  * [FriendshipModel.getFriends(accountId, done)](#FriendshipModel.getFriends)
  * [FriendshipModel.getFriendsOfFriends(accountId, done)](#FriendshipModel.getFriendsOfFriends)
  * [FriendshipModel.getPendingFriends(accountId, done)](#FriendshipModel.getPendingFriends)
  * [FriendshipModel.areFriends(accountId1, accountId2, done)](#FriendshipModel.areFriends)
  * [FriendshipModel.areFriendsOfFriends(accountId1, accountId2, done)](#FriendshipModel.areFriendsOfFriends)
  * [FriendshipModel.getRelationship(accountId1, accountId2, done)](#FriendshipModel.getRelationship)
  * [FriendshipModel.getFriendship(accountId1, accountId2, done)](#FriendshipModel.getFriendship)
  * [FriendshipModel.isRequester(friendshipId, accountId, done)](#FriendshipModel.isRequester)
  * [FriendshipModel.isRequested(friendshipId, accountId, done)](#FriendshipModel.isRequested)

<a name="FriendshipModel.relationships"></a>
##FriendshipModel.relationships
default relationship constants

**Type**: `Object`  
<a name="FriendshipModel.getRequests"></a>
##FriendshipModel.getRequests(accountId, done)
get all friend requests involving a given user

**Params**

- accountId `ObjectId` - the _id of the user  
- done `function` - required callback, passed requests retrieved  

<a name="FriendshipModel.getSentRequests"></a>
##FriendshipModel.getSentRequests(accountId, done)
get requests the given user has sent

**Params**

- accountId `ObjectId` - the _id of the user  
- done `function` - required callback, passed sent requests retrieved  

<a name="FriendshipModel.getReceivedRequests"></a>
##FriendshipModel.getReceivedRequests(accountId, done)
get requests received by the given user

**Params**

- accountId `ObjectId` - the _id of the user  
- done `function` - required callback, passed received requests retrieved  

<a name="FriendshipModel.acceptRequest"></a>
##FriendshipModel.acceptRequest(requesterId, requestedId, done)
accept a friend request

**Params**

- requesterId `ObjectId` - the _id of the requester of friendship  
- requestedId `ObjectId` - the _id of the user whose friendship was requested  
- done `function` - required callback, passed the populated friendship accepted  

<a name="FriendshipModel.cancelRequest"></a>
##FriendshipModel.cancelRequest(requesterId, requestedId, done)
cancel a friend request

**Params**

- requesterId `ObjectId` - the _id of the requester of friendship  
- requestedId `ObjectId` - the _id of the user whose friendship was requested  
- done `function` - required callback, passed the denied friendship  

<a name="FriendshipModel.denyRequest"></a>
##FriendshipModel.denyRequest(requesterId, requestedId, done)
deny a friend request

**Params**

- requesterId `ObjectId` - the _id of the requester of friendship  
- requestedId `ObjectId` - the _id of the user whose friendship was requested  
- done `function` - required callback, passed the denied friendship  

<a name="FriendshipModel.getFriends"></a>
##FriendshipModel.getFriends(accountId, done)
get a list ids of friends of an account

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback, passed an array of friendIds  

<a name="FriendshipModel.getFriendsOfFriends"></a>
##FriendshipModel.getFriendsOfFriends(accountId, done)
get friendIds of this account's friends

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback, passed an array of friendsOfFriends  

<a name="FriendshipModel.getPendingFriends"></a>
##FriendshipModel.getPendingFriends(accountId, done)
get a list ids of pending friends of an account

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback, passed an array of friendIds  

<a name="FriendshipModel.areFriends"></a>
##FriendshipModel.areFriends(accountId1, accountId2, done)
determine if accountId1 and accountId2 are friends

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed a boolean determination  

<a name="FriendshipModel.areFriendsOfFriends"></a>
##FriendshipModel.areFriendsOfFriends(accountId1, accountId2, done)
determine if accountId1 and accountId2 have any common friends

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed a boolean determination  

<a name="FriendshipModel.getRelationship"></a>
##FriendshipModel.getRelationship(accountId1, accountId2, done)
get the numeric relationship of two accounts

**Params**

- accountId1 `ObjectId` - the _id of account 1  
- accountId2 `ObjectId` - the _id of account 2  
- done `function` - required callback  

<a name="FriendshipModel.getFriendship"></a>
##FriendshipModel.getFriendship(accountId1, accountId2, done)
get the friendship document of two accounts

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed err and a Friendship document, if found  

<a name="FriendshipModel.isRequester"></a>
##FriendshipModel.isRequester(friendshipId, accountId, done)
check to see if the given user is the requester in a given friendship

**Params**

- friendshipId `ObjectId` - the _id of the friendship document  
- accountId `ObjectId` - the _id of the account  
- done `function` - required callback  

<a name="FriendshipModel.isRequested"></a>
##FriendshipModel.isRequested(friendshipId, accountId, done)
check to see if the given user is the requested in a given friendship

**Params**

- friendshipId `ObjectId` - the _id of the friendship  
- accountId `ObjectId` - the _id of the account  
- done `function` - required callback  

<a name="FriendshipDocument"></a>
#class: FriendshipDocument
**Members**

* [class: FriendshipDocument](#FriendshipDocument)
  * [FriendshipDocument.isRequester(accountId, done)](#FriendshipDocument.isRequester)
  * [FriendshipDocument.isRequested(accountId, done)](#FriendshipDocument.isRequested)

<a name="FriendshipDocument.isRequester"></a>
##FriendshipDocument.isRequester(accountId, done)
check to see if the given user is the requester in this relationship

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback  

<a name="FriendshipDocument.isRequested"></a>
##FriendshipDocument.isRequested(accountId, done)
check to see if the given user is the requested in this relationship

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback  

