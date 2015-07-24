## Classes
<dl>
<dt><a href="#PersonModel">PersonModel</a></dt>
<dd></dd>
<dt><a href="#PersonDocument">PersonDocument</a></dt>
<dd></dd>
</dl>
<a name="PersonModel"></a>
## PersonModel
**Kind**: global class  

* [PersonModel](#PersonModel)
  * [new PersonModel()](#new_PersonModel_new)
  * [.relationships](#PersonModel.relationships) : <code>Object</code>
  * [.friendRequest(requesterId, requested_Id, done)](#PersonModel.friendRequest)
  * [.getRequests(personId, done)](#PersonModel.getRequests)
  * [.getSentRequests(personId, done)](#PersonModel.getSentRequests)
  * [.getReceivedRequests(personId, done)](#PersonModel.getReceivedRequests)
  * [.acceptRequest(requesterId, requestedId, done)](#PersonModel.acceptRequest)
  * [.cancelRequest(requesterId, requestedId, done)](#PersonModel.cancelRequest)
  * [.denyRequest(requesterId, requestedId, done)](#PersonModel.denyRequest)
  * [.endFriendship(personId1, personId2, done)](#PersonModel.endFriendship)
  * [.getFriends(personId, findParams, done)](#PersonModel.getFriends)
  * [.getFriendsOfFriends(personId, findParams, done)](#PersonModel.getFriendsOfFriends)
  * [.getPendingFriends(personId, findParams, done)](#PersonModel.getPendingFriends)
  * [.getNonFriends(personId, findParams, done)](#PersonModel.getNonFriends)
  * [.areFriends(personId1, personId2, done)](#PersonModel.areFriends)
  * [.areFriendsOfFriends(personId1, personId2, done)](#PersonModel.areFriendsOfFriends)
  * [.getFriendship(personId1, personId2, done)](#PersonModel.getFriendship)
  * [.getRelationship(personId1, personId2, done)](#PersonModel.getRelationship)
  * [.isRequester(friendshipId, personId, done)](#PersonModel.isRequester)
  * [.isRequested(friendshipId, personId, done)](#PersonModel.isRequested)

<a name="new_PersonModel_new"></a>
### new PersonModel()
Functions called on the Person Model itself

example:
```javascript
Model.getFriends(Jeff._id, function (err, friends) {
     
    console.log('friends', friends);
 
});
```

<a name="PersonModel.relationships"></a>
### PersonModel.relationships : <code>Object</code>
default relationship constants

**Kind**: static constant of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendsOfFriends.relationships](FriendsOfFriends.relationships)  
<a name="PersonModel.friendRequest"></a>
### PersonModel.friendRequest(requesterId, requested_Id, done)
sends a friend request to a another user

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| requesterId | <code>ObjectId</code> | the ObjectId of the person sending the request |
| requested_Id | <code>ObjectId</code> | the ObjectId of the person to whom the request will be sent |
| done | <code>function</code> | required callback |

<a name="PersonModel.getRequests"></a>
### PersonModel.getRequests(personId, done)
get all friend requests for a given user

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.getRequests](FriendshipModel.getRequests)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the user |
| done | <code>function</code> | required callback, passed requests retrieved |

<a name="PersonModel.getSentRequests"></a>
### PersonModel.getSentRequests(personId, done)
get requests the given user has sent

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.getSentRequests](FriendshipModel.getSentRequests)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the user |
| done | <code>function</code> | required callback, passed sent requests retrieved |

<a name="PersonModel.getReceivedRequests"></a>
### PersonModel.getReceivedRequests(personId, done)
get requests received by the given user

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.getReceivedRequests](FriendshipModel.getReceivedRequests)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the user |
| done | <code>function</code> | required callback, passed received requests retrieved |

<a name="PersonModel.acceptRequest"></a>
### PersonModel.acceptRequest(requesterId, requestedId, done)
accept a friend request

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.acceptRequest](FriendshipModel.acceptRequest)  

| Param | Type | Description |
| --- | --- | --- |
| requesterId | <code>ObjectId</code> | the _id of the requester of friendship |
| requestedId | <code>ObjectId</code> | the _id of the user whose friendship was requested |
| done | <code>function</code> | required callback, passed the populated friendship |

<a name="PersonModel.cancelRequest"></a>
### PersonModel.cancelRequest(requesterId, requestedId, done)
cancel a friend request

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.cancelRequest](FriendshipModel.cancelRequest)  

| Param | Type | Description |
| --- | --- | --- |
| requesterId | <code>ObjectId</code> | the _id of the requester of friendship |
| requestedId | <code>ObjectId</code> | the _id of the user whose friendship was requested |
| done | <code>function</code> | required callback, passed the denied friendship |

<a name="PersonModel.denyRequest"></a>
### PersonModel.denyRequest(requesterId, requestedId, done)
deny a friend request

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.denyRequest](FriendshipModel.denyRequest)  

| Param | Type | Description |
| --- | --- | --- |
| requesterId | <code>ObjectId</code> | the _id of the requester of friendship |
| requestedId | <code>ObjectId</code> | the _id of the user whose friendship was requested |
| done | <code>function</code> | required callback, passed the denied friendship |

<a name="PersonModel.endFriendship"></a>
### PersonModel.endFriendship(personId1, personId2, done)
end a friendship between two persons

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.endFriendship](FriendshipModel.endFriendship)  

| Param | Type | Description |
| --- | --- | --- |
| personId1 | <code>ObjectId</code> | the _id of person 1 |
| personId2 | <code>ObjectId</code> | the _id of person 2 |
| done | <code>function</code> | required callback |

<a name="PersonModel.getFriends"></a>
### PersonModel.getFriends(personId, findParams, done)
get a perons's friends

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.getFriends](FriendshipModel.getFriends)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the person |
| findParams | <code>Object</code> | optional mongoose `Model.find()` parameters. @see [Model.find](http://mongoosejs.com/docs/api.html#model_Model.find) |
| done | <code>function</code> | required callback, passed an array of friends |

<a name="PersonModel.getFriendsOfFriends"></a>
### PersonModel.getFriendsOfFriends(personId, findParams, done)
get a person's friends-of-friends.  friends-of-friends are non-friends with whom this person has at least one mutual friend.
 get friends of a person's friends

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.getFriendsOfFriends](FriendshipModel.getFriendsOfFriends)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the person |
| findParams | <code>Object</code> | optional mongoose find params. @see [Model.find](http://mongoosejs.com/docs/api.html#model_Model.find) |
| done | <code>function</code> | required callback, passed an array of friendsOfFriends |

<a name="PersonModel.getPendingFriends"></a>
### PersonModel.getPendingFriends(personId, findParams, done)
get a person's pending friends
 get friends of a person's pending friends

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.getPendingFriends](FriendshipModel.getPendingFriends)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the person |
| findParams | <code>Object</code> | optional mongoose find params. @see [Model.find](http://mongoosejs.com/docs/api.html#model_Model.find) |
| done | <code>function</code> | required callback, passed an array of friendsOfFriends |

<a name="PersonModel.getNonFriends"></a>
### PersonModel.getNonFriends(personId, findParams, done)
get all users that are not the given user's friends

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.getNonFriends](FriendshipModel.getNonFriends)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the user |
| findParams | <code>Object</code> | optional mongoose find params. @see [Model.find](http://mongoosejs.com/docs/api.html#model_Model.find) |
| done | <code>function</code> | required callback |

<a name="PersonModel.areFriends"></a>
### PersonModel.areFriends(personId1, personId2, done)
determine if personId1 and personId2 are friends

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.areFriends](FriendshipModel.areFriends)  

| Param | Type | Description |
| --- | --- | --- |
| personId1 | <code>ObjectId</code> | the _id of person1 |
| personId2 | <code>ObjectId</code> | the _id of person2 |
| done | <code>function</code> | required callback, passed a boolean determination |

<a name="PersonModel.areFriendsOfFriends"></a>
### PersonModel.areFriendsOfFriends(personId1, personId2, done)
determine if personId1 and personId2 have any common friends

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.areFriendsOfFriends](FriendshipModel.areFriendsOfFriends)  

| Param | Type | Description |
| --- | --- | --- |
| personId1 | <code>ObjectId</code> | the _id of person1 |
| personId2 | <code>ObjectId</code> | the _id of person2 |
| done | <code>function</code> | required callback, passed a boolean determination |

<a name="PersonModel.getFriendship"></a>
### PersonModel.getFriendship(personId1, personId2, done)
get the friendship document itself

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.getFriendship](FriendshipModel.getFriendship)  

| Param | Type | Description |
| --- | --- | --- |
| personId1 | <code>ObjectId</code> | the _id of person1 |
| personId2 | <code>ObjectId</code> | the _id of person2 |
| done | <code>function</code> | required callback, passed err and a Friendship document, if found |

<a name="PersonModel.getRelationship"></a>
### PersonModel.getRelationship(personId1, personId2, done)
get the numeric relationship between two users

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  
**See**: [FriendshipModel.getRelationship](FriendshipModel.getRelationship)  

| Param | Type | Description |
| --- | --- | --- |
| personId1 | <code>ObjectId</code> | the _id of person1 |
| personId2 | <code>ObjectId</code> | the _id of person2 |
| done | <code>function</code> | required callback, passed err and a Relationship value |

<a name="PersonModel.isRequester"></a>
### PersonModel.isRequester(friendshipId, personId, done)
check to see if the given user is the requester in a given friendship

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| friendshipId | <code>ObjectId</code> | the _id of the friendship document |
| personId | <code>ObjectId</code> | the _id of the person |
| done | <code>function</code> | required callback |

<a name="PersonModel.isRequested"></a>
### PersonModel.isRequested(friendshipId, personId, done)
check to see if the given user is the requested in a given friendship

**Kind**: static method of <code>[PersonModel](#PersonModel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| friendshipId | <code>ObjectId</code> | the _id of the friendship document |
| personId | <code>ObjectId</code> | the _id of the person |
| done | <code>function</code> | required callback |

<a name="PersonDocument"></a>
## PersonDocument
**Kind**: global class  

* [PersonDocument](#PersonDocument)
  * [new PersonDocument()](#new_PersonDocument_new)
  * [.friendRequest(requestedId, done)](#PersonDocument.friendRequest)
  * [.getRequests(done)](#PersonDocument.getRequests)
  * [.getSentRequests(done)](#PersonDocument.getSentRequests)
  * [.getReceivedRequests(done)](#PersonDocument.getReceivedRequests)
  * [.acceptRequest(requesterId, done)](#PersonDocument.acceptRequest)
  * [.cancelRequest(requestedId, done)](#PersonDocument.cancelRequest)
  * [.denyRequest(requesterId, done)](#PersonDocument.denyRequest)
  * [.getFriends(done)](#PersonDocument.getFriends)
  * [.getFriendsOfFriends(done)](#PersonDocument.getFriendsOfFriends)
  * [.getPendingFriends(personId, done)](#PersonDocument.getPendingFriends)
  * [.getNonFriends(done)](#PersonDocument.getNonFriends)
  * [.isFriend(personId, done)](#PersonDocument.isFriend)
  * [.isFriendOfFriends(personId, done)](#PersonDocument.isFriendOfFriends)
  * [.getFriendship(personId, done)](#PersonDocument.getFriendship)
  * [.getRelationship(personId, done)](#PersonDocument.getRelationship)
  * [.isRequester(personId, done)](#PersonDocument.isRequester)
  * [.isRequested(personId, done)](#PersonDocument.isRequested)

<a name="new_PersonDocument_new"></a>
### new PersonDocument()
Document-accessible properties and methods

These instance methods are aliases of the Model statics as they apply to each document

example:
```javascript
 var jeff = new User({ username: "Jeff" }),
     zane = new User({ username: "Zane" });
     
 jeff.sendRequest(zane._id, function (err, request) {...});
```

<a name="PersonDocument.friendRequest"></a>
### PersonDocument.friendRequest(requestedId, done)
send a request to another person

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [friendRequest](#PersonModel.friendRequest)  

| Param | Type | Description |
| --- | --- | --- |
| requestedId | <code>ObjectId</code> | the _id of the person to whom the request will be sent |
| done | <code>function</code> | required callback, passed the populated request sent |

<a name="PersonDocument.getRequests"></a>
### PersonDocument.getRequests(done)
get friend requests

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [getRequests](#PersonModel.getRequests)  

| Param | Type | Description |
| --- | --- | --- |
| done | <code>function</code> | required callback, passed the populated requests retrieved |

<a name="PersonDocument.getSentRequests"></a>
### PersonDocument.getSentRequests(done)
get friend requests the user has sent

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [getSentRequests](#PersonModel.getSentRequests)  

| Param | Type | Description |
| --- | --- | --- |
| done | <code>function</code> | required callback, passed the populated requests retrieved |

<a name="PersonDocument.getReceivedRequests"></a>
### PersonDocument.getReceivedRequests(done)
get friend requests the user has received

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [getReceivedRequests](#PersonModel.getReceivedRequests)  

| Param | Type | Description |
| --- | --- | --- |
| done | <code>function</code> | required callback, passed the populated requests retrieved |

<a name="PersonDocument.acceptRequest"></a>
### PersonDocument.acceptRequest(requesterId, done)
accept a friend request received from the specified user

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [acceptRequest](#PersonModel.acceptRequest)  

| Param | Type | Description |
| --- | --- | --- |
| requesterId | <code>ObjectId</code> | the _id of the person from whom the request was received |
| done | <code>function</code> | required callback, passed the populated request that was accepted |

<a name="PersonDocument.cancelRequest"></a>
### PersonDocument.cancelRequest(requestedId, done)
cancel a friend request sent to the specified user

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [cancelRequest](#PersonModel.cancelRequest)  

| Param | Type | Description |
| --- | --- | --- |
| requestedId | <code>ObjectId</code> | the _id of the person to whom the request was sent |
| done | <code>function</code> | required callback, passed the populated request that was denied |

<a name="PersonDocument.denyRequest"></a>
### PersonDocument.denyRequest(requesterId, done)
deny a friend request received from the specified user

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [denyRequest](#PersonModel.denyRequest)  

| Param | Type | Description |
| --- | --- | --- |
| requesterId | <code>ObjectId</code> | the _id of the person from whom the request was received |
| done | <code>function</code> | required callback, passed the populated request that was denied |

<a name="PersonDocument.getFriends"></a>
### PersonDocument.getFriends(done)
get this document's friends

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [getFriends](#PersonModel.getFriends)  

| Param | Type | Description |
| --- | --- | --- |
| done | <code>function</code> | required callback, passed an array of friends |

<a name="PersonDocument.getFriendsOfFriends"></a>
### PersonDocument.getFriendsOfFriends(done)
get friends of this document's friends

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [getFriendsOfFriends](#PersonModel.getFriendsOfFriends)  

| Param | Type | Description |
| --- | --- | --- |
| done | <code>function</code> | required callback, passed an array of friendsOfFriends |

<a name="PersonDocument.getPendingFriends"></a>
### PersonDocument.getPendingFriends(personId, done)
get this person's pending friends

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [getPendingFriends](#PersonModel.getPendingFriends)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the person |
| done | <code>function</code> | required callback, passed an array of friendsOfFriends |

<a name="PersonDocument.getNonFriends"></a>
### PersonDocument.getNonFriends(done)
get persons which are not this document's friends

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [getNonFriends](#PersonModel.getNonFriends)  

| Param | Type | Description |
| --- | --- | --- |
| done | <code>function</code> | required callback, passed an array of friendsOfFriends |

<a name="PersonDocument.isFriend"></a>
### PersonDocument.isFriend(personId, done)
determine if this document is friends with the specified person

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [PersonModel.isFriend](PersonModel.isFriend)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the user to check for friendship |
| done | <code>function</code> | required callback, passed a boolean determination |

<a name="PersonDocument.isFriendOfFriends"></a>
### PersonDocument.isFriendOfFriends(personId, done)
determine if this document shares any friends with the specified person

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [PersonModel.isFriendOfFriends](PersonModel.isFriendOfFriends)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the user to check for friendship |
| done | <code>function</code> | required callback, passed a boolean determination |

<a name="PersonDocument.getFriendship"></a>
### PersonDocument.getFriendship(personId, done)
get the friendship document of this document and the specified person

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [AccofuntModel.getFriendship](#PersonModel.getFriendship)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the friend |
| done | <code>function</code> | required callback, passed the populated friendship |

<a name="PersonDocument.getRelationship"></a>
### PersonDocument.getRelationship(personId, done)
get the relationship of this document and the specified person

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [getRelationship](#PersonModel.getRelationship)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the friend |
| done | <code>function</code> | required callback, passed the relationship value |

<a name="PersonDocument.isRequester"></a>
### PersonDocument.isRequester(personId, done)
check to see if the given user is the requester in this relationship

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [isRequester](#PersonModel.isRequester)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the person |
| done | <code>function</code> | required callback |

<a name="PersonDocument.isRequested"></a>
### PersonDocument.isRequested(personId, done)
check to see if the given user is the requested in this relationship

**Kind**: static method of <code>[PersonDocument](#PersonDocument)</code>  
**See**: [isRequested](#PersonModel.isRequested)  

| Param | Type | Description |
| --- | --- | --- |
| personId | <code>ObjectId</code> | the _id of the person |
| done | <code>function</code> | required callback |

