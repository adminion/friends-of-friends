## Classes
<dl>
<dt><a href="#FriendshipModel">FriendshipModel</a></dt>
<dd></dd>
<dt><a href="#FriendshipDocument">FriendshipDocument</a></dt>
<dd></dd>
</dl>
<a name="FriendshipModel"></a>
## FriendshipModel
**Kind**: global class  

* [FriendshipModel](#FriendshipModel)
  * [.relationships](#FriendshipModel.relationships) : <code>Object</code>
  * [.getRequests(accountId, done)](#FriendshipModel.getRequests)
  * [.getSentRequests(accountId, done)](#FriendshipModel.getSentRequests)
  * [.getReceivedRequests(accountId, done)](#FriendshipModel.getReceivedRequests)
  * [.acceptRequest(requesterId, requestedId, done)](#FriendshipModel.acceptRequest)
  * [.cancelRequest(requesterId, requestedId, done)](#FriendshipModel.cancelRequest)
  * [.denyRequest(requesterId, requestedId, done)](#FriendshipModel.denyRequest)
  * [.getFriends(accountId, done)](#FriendshipModel.getFriends)
  * [.getFriendsOfFriends(accountId, done)](#FriendshipModel.getFriendsOfFriends)
  * [.getPendingFriends(accountId, done)](#FriendshipModel.getPendingFriends)
  * [.areFriends(accountId1, accountId2, done)](#FriendshipModel.areFriends)
  * [.areFriendsOfFriends(accountId1, accountId2, done)](#FriendshipModel.areFriendsOfFriends)
  * [.getRelationship(accountId1, accountId2, done)](#FriendshipModel.getRelationship)
  * [.getFriendship(accountId1, accountId2, done)](#FriendshipModel.getFriendship)
  * [.isRequester(friendshipId, accountId, done)](#FriendshipModel.isRequester)
  * [.isRequested(friendshipId, accountId, done)](#FriendshipModel.isRequested)

<a name="FriendshipModel.relationships"></a>
### FriendshipModel.relationships : <code>Object</code>
default relationship constants

**Kind**: static property of <code>[FriendshipModel](#FriendshipModel)</code>  
**See**: [FriendsOfFriends.relationships](FriendsOfFriends.relationships)  
<a name="FriendshipModel.getRequests"></a>
### FriendshipModel.getRequests(accountId, done)
get all friend requests involving a given user

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>ObjectId</code> | the _id of the user |
| done | <code>function</code> | required callback, passed requests retrieved |

<a name="FriendshipModel.getSentRequests"></a>
### FriendshipModel.getSentRequests(accountId, done)
get requests the given user has sent

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>ObjectId</code> | the _id of the user |
| done | <code>function</code> | required callback, passed sent requests retrieved |

<a name="FriendshipModel.getReceivedRequests"></a>
### FriendshipModel.getReceivedRequests(accountId, done)
get requests received by the given user

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>ObjectId</code> | the _id of the user |
| done | <code>function</code> | required callback, passed received requests retrieved |

<a name="FriendshipModel.acceptRequest"></a>
### FriendshipModel.acceptRequest(requesterId, requestedId, done)
accept a friend request

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| requesterId | <code>ObjectId</code> | the _id of the requester of friendship |
| requestedId | <code>ObjectId</code> | the _id of the user whose friendship was requested |
| done | <code>function</code> | required callback, passed the populated friendship accepted |

<a name="FriendshipModel.cancelRequest"></a>
### FriendshipModel.cancelRequest(requesterId, requestedId, done)
cancel a friend request

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| requesterId | <code>ObjectId</code> | the _id of the requester of friendship |
| requestedId | <code>ObjectId</code> | the _id of the user whose friendship was requested |
| done | <code>function</code> | required callback, passed the denied friendship |

<a name="FriendshipModel.denyRequest"></a>
### FriendshipModel.denyRequest(requesterId, requestedId, done)
deny a friend request

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| requesterId | <code>ObjectId</code> | the _id of the requester of friendship |
| requestedId | <code>ObjectId</code> | the _id of the user whose friendship was requested |
| done | <code>function</code> | required callback, passed the denied friendship |

<a name="FriendshipModel.getFriends"></a>
### FriendshipModel.getFriends(accountId, done)
get a list ids of friends of an account

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>ObjectId</code> | the _id of the account |
| done | <code>function</code> | required callback, passed an array of friendIds |

<a name="FriendshipModel.getFriendsOfFriends"></a>
### FriendshipModel.getFriendsOfFriends(accountId, done)
get friendIds of this account's friends

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>ObjectId</code> | the _id of the account |
| done | <code>function</code> | required callback, passed an array of friendsOfFriends |

<a name="FriendshipModel.getPendingFriends"></a>
### FriendshipModel.getPendingFriends(accountId, done)
get a list ids of pending friends of an account

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>ObjectId</code> | the _id of the account |
| done | <code>function</code> | required callback, passed an array of friendIds |

<a name="FriendshipModel.areFriends"></a>
### FriendshipModel.areFriends(accountId1, accountId2, done)
determine if accountId1 and accountId2 are friends

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| accountId1 | <code>ObjectId</code> | the _id of account1 |
| accountId2 | <code>ObjectId</code> | the _id of account2 |
| done | <code>function</code> | required callback, passed a boolean determination |

<a name="FriendshipModel.areFriendsOfFriends"></a>
### FriendshipModel.areFriendsOfFriends(accountId1, accountId2, done)
determine if accountId1 and accountId2 have any common friends

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| accountId1 | <code>ObjectId</code> | the _id of account1 |
| accountId2 | <code>ObjectId</code> | the _id of account2 |
| done | <code>function</code> | required callback, passed a boolean determination |

<a name="FriendshipModel.getRelationship"></a>
### FriendshipModel.getRelationship(accountId1, accountId2, done)
get the numeric relationship of two accounts

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| accountId1 | <code>ObjectId</code> | the _id of account 1 |
| accountId2 | <code>ObjectId</code> | the _id of account 2 |
| done | <code>function</code> | required callback |

<a name="FriendshipModel.getFriendship"></a>
### FriendshipModel.getFriendship(accountId1, accountId2, done)
get the friendship document of two accounts

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| accountId1 | <code>ObjectId</code> | the _id of account1 |
| accountId2 | <code>ObjectId</code> | the _id of account2 |
| done | <code>function</code> | required callback, passed err and a Friendship document, if found |

<a name="FriendshipModel.isRequester"></a>
### FriendshipModel.isRequester(friendshipId, accountId, done)
check to see if the given user is the requester in a given friendship

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| friendshipId | <code>ObjectId</code> | the _id of the friendship document |
| accountId | <code>ObjectId</code> | the _id of the account |
| done | <code>function</code> | required callback |

<a name="FriendshipModel.isRequested"></a>
### FriendshipModel.isRequested(friendshipId, accountId, done)
check to see if the given user is the requested in a given friendship

**Kind**: static method of <code>[FriendshipModel](#FriendshipModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| friendshipId | <code>ObjectId</code> | the _id of the friendship |
| accountId | <code>ObjectId</code> | the _id of the account |
| done | <code>function</code> | required callback |

<a name="FriendshipDocument"></a>
## FriendshipDocument
**Kind**: global class  

* [FriendshipDocument](#FriendshipDocument)
  * [.isRequester(accountId, done)](#FriendshipDocument.isRequester)
  * [.isRequested(accountId, done)](#FriendshipDocument.isRequested)

<a name="FriendshipDocument.isRequester"></a>
### FriendshipDocument.isRequester(accountId, done)
check to see if the given user is the requester in this relationship

**Kind**: static method of <code>[FriendshipDocument](#FriendshipDocument)</code>  
**See**: [isRequester](#FriendshipModel.isRequester)  

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>ObjectId</code> | the _id of the account |
| done | <code>function</code> | required callback |

<a name="FriendshipDocument.isRequested"></a>
### FriendshipDocument.isRequested(accountId, done)
check to see if the given user is the requested in this relationship

**Kind**: static method of <code>[FriendshipDocument](#FriendshipDocument)</code>  
**See**: [isRequested](#FriendshipModel.isRequested)  

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>ObjectId</code> | the _id of the account |
| done | <code>function</code> | required callback |

