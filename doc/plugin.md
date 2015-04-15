#Index

**Classes**

* [class: AccountModel](#AccountModel)
  * [new AccountModel()](#new_AccountModel)
  * [AccountModel.friendRequest(requesterId, requested_Id, done)](#AccountModel.friendRequest)
  * [AccountModel.getRequests(accountId, done)](#AccountModel.getRequests)
  * [AccountModel.getSentRequests(accountId, done)](#AccountModel.getSentRequests)
  * [AccountModel.getReceivedRequests(accountId, done)](#AccountModel.getReceivedRequests)
  * [AccountModel.acceptRequest(requesterId, requestedId, done)](#AccountModel.acceptRequest)
  * [AccountModel.cancelRequest(requesterId, requestedId, done)](#AccountModel.cancelRequest)
  * [AccountModel.denyRequest(requesterId, requestedId, done)](#AccountModel.denyRequest)
  * [AccountModel.endFriendship(accountId1, accountId2, done)](#AccountModel.endFriendship)
  * [AccountModel.getFriends(accountId, done)](#AccountModel.getFriends)
  * [AccountModel.getFriendsOfFriends(accountId, done)](#AccountModel.getFriendsOfFriends)
  * [AccountModel.getPendingFriends(accountId, done)](#AccountModel.getPendingFriends)
  * [AccountModel.areFriends(accountId1, accountId2, done)](#AccountModel.areFriends)
  * [AccountModel.areFriendsOfFriends(accountId1, accountId2, done)](#AccountModel.areFriendsOfFriends)
  * [AccountModel.getFriendship(accountId1, accountId2, done)](#AccountModel.getFriendship)
  * [AccountModel.getRelationship(accountId1, accountId2, done)](#AccountModel.getRelationship)
  * [AccountModel.isRequester(friendshipId, accountId, done)](#AccountModel.isRequester)
  * [AccountModel.isRequested(friendshipId, accountId, done)](#AccountModel.isRequested)
  * [const: AccountModel.relationships](#AccountModel.relationships)
* [class: AccountDocument](#AccountDocument)
  * [new AccountDocument()](#new_AccountDocument)
  * [AccountDocument.friendRequest(requestedId, done)](#AccountDocument.friendRequest)
  * [AccountDocument.getRequests(done)](#AccountDocument.getRequests)
  * [AccountDocument.getSentRequests(done)](#AccountDocument.getSentRequests)
  * [AccountDocument.getReceivedRequests(done)](#AccountDocument.getReceivedRequests)
  * [AccountDocument.acceptRequest(requesterId, done)](#AccountDocument.acceptRequest)
  * [AccountDocument.cancelRequest(requestedId, done)](#AccountDocument.cancelRequest)
  * [AccountDocument.denyRequest(requesterId, done)](#AccountDocument.denyRequest)
  * [AccountDocument.getFriends(done)](#AccountDocument.getFriends)
  * [AccountDocument.getFriendsOfFriends(done)](#AccountDocument.getFriendsOfFriends)
  * [AccountDocument.getPendingFriends(accountId, done)](#AccountDocument.getPendingFriends)
  * [AccountDocument.getNonFriends(done)](#AccountDocument.getNonFriends)
  * [AccountDocument.isFriend(accountId, done)](#AccountDocument.isFriend)
  * [AccountDocument.isFriendOfFriends(accountId, done)](#AccountDocument.isFriendOfFriends)
  * [AccountDocument.getFriendship(accountId, done)](#AccountDocument.getFriendship)
  * [AccountDocument.getRelationship(accountId, done)](#AccountDocument.getRelationship)
  * [AccountDocument.isRequester(accountId, done)](#AccountDocument.isRequester)
  * [AccountDocument.isRequested(accountId, done)](#AccountDocument.isRequested)
 
<a name="AccountModel"></a>
#class: AccountModel
**Members**

* [class: AccountModel](#AccountModel)
  * [new AccountModel()](#new_AccountModel)
  * [AccountModel.friendRequest(requesterId, requested_Id, done)](#AccountModel.friendRequest)
  * [AccountModel.getRequests(accountId, done)](#AccountModel.getRequests)
  * [AccountModel.getSentRequests(accountId, done)](#AccountModel.getSentRequests)
  * [AccountModel.getReceivedRequests(accountId, done)](#AccountModel.getReceivedRequests)
  * [AccountModel.acceptRequest(requesterId, requestedId, done)](#AccountModel.acceptRequest)
  * [AccountModel.cancelRequest(requesterId, requestedId, done)](#AccountModel.cancelRequest)
  * [AccountModel.denyRequest(requesterId, requestedId, done)](#AccountModel.denyRequest)
  * [AccountModel.endFriendship(accountId1, accountId2, done)](#AccountModel.endFriendship)
  * [AccountModel.getFriends(accountId, done)](#AccountModel.getFriends)
  * [AccountModel.getFriendsOfFriends(accountId, done)](#AccountModel.getFriendsOfFriends)
  * [AccountModel.getPendingFriends(accountId, done)](#AccountModel.getPendingFriends)
  * [AccountModel.areFriends(accountId1, accountId2, done)](#AccountModel.areFriends)
  * [AccountModel.areFriendsOfFriends(accountId1, accountId2, done)](#AccountModel.areFriendsOfFriends)
  * [AccountModel.getFriendship(accountId1, accountId2, done)](#AccountModel.getFriendship)
  * [AccountModel.getRelationship(accountId1, accountId2, done)](#AccountModel.getRelationship)
  * [AccountModel.isRequester(friendshipId, accountId, done)](#AccountModel.isRequester)
  * [AccountModel.isRequested(friendshipId, accountId, done)](#AccountModel.isRequested)
  * [const: AccountModel.relationships](#AccountModel.relationships)

<a name="new_AccountModel"></a>
##new AccountModel()
Functions called on the Account Model itself

example:
```javascript
Model.getFriends(Jeff._id, function (err, friends) {
     
    console.log('friends', friends);
 
});
```

<a name="AccountModel.friendRequest"></a>
##AccountModel.friendRequest(requesterId, requested_Id, done)
sends a friend request to a another user

**Params**

- requesterId `ObjectId` - the ObjectId of the account sending the request  
- requested_Id `ObjectId` - the ObjectId of the account to whom the request will be sent  
- done `function` - required callback  

<a name="AccountModel.getRequests"></a>
##AccountModel.getRequests(accountId, done)
get all friend requests for a given user

**Params**

- accountId `ObjectId` - the _id of the user  
- done `function` - required callback, passed requests retrieved  

<a name="AccountModel.getSentRequests"></a>
##AccountModel.getSentRequests(accountId, done)
get requests the given user has sent

**Params**

- accountId `ObjectId` - the _id of the user  
- done `function` - required callback, passed sent requests retrieved  

<a name="AccountModel.getReceivedRequests"></a>
##AccountModel.getReceivedRequests(accountId, done)
get requests received by the given user

**Params**

- accountId `ObjectId` - the _id of the user  
- done `function` - required callback, passed received requests retrieved  

<a name="AccountModel.acceptRequest"></a>
##AccountModel.acceptRequest(requesterId, requestedId, done)
accept a friend request

**Params**

- requesterId `ObjectId` - the _id of the requester of friendship  
- requestedId `ObjectId` - the _id of the user whose friendship was requested  
- done `function` - required callback, passed the populated friendship  

<a name="AccountModel.cancelRequest"></a>
##AccountModel.cancelRequest(requesterId, requestedId, done)
cancel a friend request

**Params**

- requesterId `ObjectId` - the _id of the requester of friendship  
- requestedId `ObjectId` - the _id of the user whose friendship was requested  
- done `function` - required callback, passed the denied friendship  

<a name="AccountModel.denyRequest"></a>
##AccountModel.denyRequest(requesterId, requestedId, done)
deny a friend request

**Params**

- requesterId `ObjectId` - the _id of the requester of friendship  
- requestedId `ObjectId` - the _id of the user whose friendship was requested  
- done `function` - required callback, passed the denied friendship  

<a name="AccountModel.endFriendship"></a>
##AccountModel.endFriendship(accountId1, accountId2, done)
end a friendship between two accounts

**Params**

- accountId1 `ObjectId` - the _id of account 1  
- accountId2 `ObjectId` - the _id of account 2  
- done `function` - required callback  

<a name="AccountModel.getFriends"></a>
##AccountModel.getFriends(accountId, done)
get all friends of an account

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback, passed an array of friends  

<a name="AccountModel.getFriendsOfFriends"></a>
##AccountModel.getFriendsOfFriends(accountId, done)
get friends of an account's friends

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback, passed an array of friendsOfFriends  

<a name="AccountModel.getPendingFriends"></a>
##AccountModel.getPendingFriends(accountId, done)
get friends of an account's pending friends

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback, passed an array of friendsOfFriends  

<a name="AccountModel.areFriends"></a>
##AccountModel.areFriends(accountId1, accountId2, done)
determine if accountId1 and accountId2 are friends

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed a boolean determination  

<a name="AccountModel.areFriendsOfFriends"></a>
##AccountModel.areFriendsOfFriends(accountId1, accountId2, done)
determine if accountId1 and accountId2 have any common friends

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed a boolean determination  

<a name="AccountModel.getFriendship"></a>
##AccountModel.getFriendship(accountId1, accountId2, done)
get the friendship document itself

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed err and a Friendship document, if found  

<a name="AccountModel.getRelationship"></a>
##AccountModel.getRelationship(accountId1, accountId2, done)
get the numeric relationship between two users

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed err and a Relationship value  

<a name="AccountModel.isRequester"></a>
##AccountModel.isRequester(friendshipId, accountId, done)
check to see if the given user is the requester in a given friendship

**Params**

- friendshipId `ObjectId` - the _id of the friendship document  
- accountId `ObjectId` - the _id of the account  
- done `function` - required callback  

<a name="AccountModel.isRequested"></a>
##AccountModel.isRequested(friendshipId, accountId, done)
check to see if the given user is the requested in a given friendship

**Params**

- friendshipId `ObjectId` - the _id of the friendship document  
- accountId `ObjectId` - the _id of the account  
- done `function` - required callback  

<a name="AccountModel.relationships"></a>
##const: AccountModel.relationships
default relationship constants

**Type**: `Object`  
<a name="AccountDocument"></a>
#class: AccountDocument
**Members**

* [class: AccountDocument](#AccountDocument)
  * [new AccountDocument()](#new_AccountDocument)
  * [AccountDocument.friendRequest(requestedId, done)](#AccountDocument.friendRequest)
  * [AccountDocument.getRequests(done)](#AccountDocument.getRequests)
  * [AccountDocument.getSentRequests(done)](#AccountDocument.getSentRequests)
  * [AccountDocument.getReceivedRequests(done)](#AccountDocument.getReceivedRequests)
  * [AccountDocument.acceptRequest(requesterId, done)](#AccountDocument.acceptRequest)
  * [AccountDocument.cancelRequest(requestedId, done)](#AccountDocument.cancelRequest)
  * [AccountDocument.denyRequest(requesterId, done)](#AccountDocument.denyRequest)
  * [AccountDocument.getFriends(done)](#AccountDocument.getFriends)
  * [AccountDocument.getFriendsOfFriends(done)](#AccountDocument.getFriendsOfFriends)
  * [AccountDocument.getPendingFriends(accountId, done)](#AccountDocument.getPendingFriends)
  * [AccountDocument.getNonFriends(done)](#AccountDocument.getNonFriends)
  * [AccountDocument.isFriend(accountId, done)](#AccountDocument.isFriend)
  * [AccountDocument.isFriendOfFriends(accountId, done)](#AccountDocument.isFriendOfFriends)
  * [AccountDocument.getFriendship(accountId, done)](#AccountDocument.getFriendship)
  * [AccountDocument.getRelationship(accountId, done)](#AccountDocument.getRelationship)
  * [AccountDocument.isRequester(accountId, done)](#AccountDocument.isRequester)
  * [AccountDocument.isRequested(accountId, done)](#AccountDocument.isRequested)

<a name="new_AccountDocument"></a>
##new AccountDocument()
Document-accessible properties and methods

These instance methods are aliases of the Model statics as they apply to each document

example:
```javascript
 var jeff = new User({ username: "Jeff" }),
     zane = new User({ username: "Zane" });
     
 jeff.sendRequest(zane._id, function (err, request) {...});
```

<a name="AccountDocument.friendRequest"></a>
##AccountDocument.friendRequest(requestedId, done)
send a request to another account

**Params**

- requestedId `ObjectId` - the _id of the account to whom the request will be sent  
- done `function` - required callback, passed the populated request sent  

<a name="AccountDocument.getRequests"></a>
##AccountDocument.getRequests(done)
get friend requests

**Params**

- done `function` - required callback, passed the populated requests retrieved  

<a name="AccountDocument.getSentRequests"></a>
##AccountDocument.getSentRequests(done)
get friend requests the user has sent

**Params**

- done `function` - required callback, passed the populated requests retrieved  

<a name="AccountDocument.getReceivedRequests"></a>
##AccountDocument.getReceivedRequests(done)
get friend requests the user has received

**Params**

- done `function` - required callback, passed the populated requests retrieved  

<a name="AccountDocument.acceptRequest"></a>
##AccountDocument.acceptRequest(requesterId, done)
accept a friend request received from the specified user

**Params**

- requesterId `ObjectId` - the _id of the account from whom the request was received  
- done `function` - required callback, passed the populated request that was accepted  

<a name="AccountDocument.cancelRequest"></a>
##AccountDocument.cancelRequest(requestedId, done)
cancel a friend request sent to the specified user

**Params**

- requestedId `ObjectId` - the _id of the account to whom the request was sent  
- done `function` - required callback, passed the populated request that was denied  

<a name="AccountDocument.denyRequest"></a>
##AccountDocument.denyRequest(requesterId, done)
deny a friend request received from the specified user

**Params**

- requesterId `ObjectId` - the _id of the account from whom the request was received  
- done `function` - required callback, passed the populated request that was denied  

<a name="AccountDocument.getFriends"></a>
##AccountDocument.getFriends(done)
get this document's friends

**Params**

- done `function` - required callback, passed an array of friends  

<a name="AccountDocument.getFriendsOfFriends"></a>
##AccountDocument.getFriendsOfFriends(done)
get friends of this document's friends

**Params**

- done `function` - required callback, passed an array of friendsOfFriends  

<a name="AccountDocument.getPendingFriends"></a>
##AccountDocument.getPendingFriends(accountId, done)
get friends of this account's pending friends

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback, passed an array of friendsOfFriends  

<a name="AccountDocument.getNonFriends"></a>
##AccountDocument.getNonFriends(done)
get accounts which are not this document's friends

**Params**

- done `function` - required callback, passed an array of friendsOfFriends  

<a name="AccountDocument.isFriend"></a>
##AccountDocument.isFriend(accountId, done)
determine if this document is friends with the specified account

**Params**

- accountId `ObjectId` - the _id of the user to check for friendship  
- done `function` - required callback, passed a boolean determination  

<a name="AccountDocument.isFriendOfFriends"></a>
##AccountDocument.isFriendOfFriends(accountId, done)
determine if this document shares any friends with the specified account

**Params**

- accountId `ObjectId` - the _id of the user to check for friendship  
- done `function` - required callback, passed a boolean determination  

<a name="AccountDocument.getFriendship"></a>
##AccountDocument.getFriendship(accountId, done)
get the friendship document of this document and the specified account

**Params**

- accountId `ObjectId` - the _id of the friend  
- done `function` - required callback, passed the populated friendship  

<a name="AccountDocument.getRelationship"></a>
##AccountDocument.getRelationship(accountId, done)
get the relationship of this document and the specified account

**Params**

- accountId `ObjectId` - the _id of the friend  
- done `function` - required callback, passed the relationship value  

<a name="AccountDocument.isRequester"></a>
##AccountDocument.isRequester(accountId, done)
check to see if the given user is the requester in this relationship

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback  

<a name="AccountDocument.isRequested"></a>
##AccountDocument.isRequested(accountId, done)
check to see if the given user is the requested in this relationship

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback  

