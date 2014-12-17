#Index

**Modules**

* [friendship](#module_friendship)
  * [module.exports ⏏](#exp_module_friendship)
    * [friendship~friendshipInit(options)](#module_friendship..friendshipInit)
* [plugin](#module_plugin)
  * [module.exports ⏏](#exp_module_plugin)
    * [plugin~friendshipPlugin(schema, options)](#module_plugin..friendshipPlugin)
      * [friendshipPlugin~settingDef](#module_plugin..friendshipPlugin..settingDef)
* [privacy](#module_privacy)
  * [const: privacy.names](#module_privacy.names)
  * [const: privacy.values](#module_privacy.values)
* [relationships](#module_relationships)
  * [const: relationships.names](#module_relationships.names)
  * [const: relationships.values](#module_relationships.values)

**Classes**

* [class: FriendshipModel](#FriendshipModel)
  * [FriendshipModel.getRequests(accountId, done)](#FriendshipModel.getRequests)
  * [FriendshipModel.getSentRequests(accountId, done)](#FriendshipModel.getSentRequests)
  * [FriendshipModel.getReceivedRequests(accountId, done)](#FriendshipModel.getReceivedRequests)
  * [FriendshipModel.acceptRequest(requesterId, requestedId, done)](#FriendshipModel.acceptRequest)
  * [FriendshipModel.denyRequest(requesterId, requestedId, done)](#FriendshipModel.denyRequest)
  * [FriendshipModel.getFriends(accountId, done)](#FriendshipModel.getFriends)
  * [FriendshipModel.getFriendsOfFriends(accountId, done)](#FriendshipModel.getFriendsOfFriends)
  * [FriendshipModel.isFriend(accountId1, accountId2, done)](#FriendshipModel.isFriend)
  * [FriendshipModel.isFriendOfFriends(accountId1, accountId2, done)](#FriendshipModel.isFriendOfFriends)
  * [FriendshipModel.getRelationship(accountId1, accountId2, done)](#FriendshipModel.getRelationship)
  * [FriendshipModel.isRequester(friendshipId, accountId, done)](#FriendshipModel.isRequester)
  * [FriendshipModel.isRequested(friendshipId, accountId, done)](#FriendshipModel.isRequested)
  * [const: FriendshipModel.privacy](#FriendshipModel.privacy)
  * [const: FriendshipModel.relationships](#FriendshipModel.relationships)
* [class: FriendshipDocument](#FriendshipDocument)
  * [FriendshipDocument.isRequester(accountId, done)](#FriendshipDocument.isRequester)
  * [FriendshipDocument.isRequested(accountId, done)](#FriendshipDocument.isRequested)
* [class: FriendsOfFriends](#FriendsOfFriends)
  * [new FriendsOfFriends(options)](#new_FriendsOfFriends)
  * [FriendsOfFriends~defaults](#FriendsOfFriends..defaults)
  * [friendsOfFriends.friendship](#FriendsOfFriends#friendship)
  * [friendsOfFriends.plugin](#FriendsOfFriends#plugin)
  * [friendsOfFriends.privacy](#FriendsOfFriends#privacy)
  * [friendsOfFriends.relationships](#FriendsOfFriends#relationships)
  * [friendsOfFriends.get(property)](#FriendsOfFriends#get)
  * [friendsOfFriends.set(property, value)](#FriendsOfFriends#set)
* [class: AccountModel](#AccountModel)
  * [AccountModel.friendRequest(requesterId, requested_Id, done)](#AccountModel.friendRequest)
  * [AccountModel.getRequests(accountId, done)](#AccountModel.getRequests)
  * [AccountModel.getSentRequests(accountId, done)](#AccountModel.getSentRequests)
  * [AccountModel.getReceivedRequests(accountId, done)](#AccountModel.getReceivedRequests)
  * [AccountModel.acceptRequest(requesterId, requestedId, done)](#AccountModel.acceptRequest)
  * [AccountModel.denyRequest(requesterId, requestedId, done)](#AccountModel.denyRequest)
  * [AccountModel.getFriends(accountId, done)](#AccountModel.getFriends)
  * [AccountModel.getFriendsOfFriends(accountId, done)](#AccountModel.getFriendsOfFriends)
  * [AccountModel.isFriend(accountId1, accountId2, done)](#AccountModel.isFriend)
  * [AccountModel.isFriendOfFriends(accountId1, accountId2, done)](#AccountModel.isFriendOfFriends)
  * [AccountModel.getFriendship(accountId1, accountId2, done)](#AccountModel.getFriendship)
  * [AccountModel.getRelationship(accountId1, accountId2, done)](#AccountModel.getRelationship)
  * [const: AccountModel.privacy](#AccountModel.privacy)
  * [const: AccountModel.relationships](#AccountModel.relationships)
* [class: AccountDocument](#AccountDocument)
  * [new AccountDocument()](#new_AccountDocument)
  * [AccountDocument.friendRequest(requestedEmail, done)](#AccountDocument.friendRequest)
  * [AccountDocument.getRequests(done)](#AccountDocument.getRequests)
  * [AccountDocument.getSentRequests(done)](#AccountDocument.getSentRequests)
  * [AccountDocument.getReceivedRequests(done)](#AccountDocument.getReceivedRequests)
  * [AccountDocument.acceptRequest(requesterId, done)](#AccountDocument.acceptRequest)
  * [AccountDocument.denyRequest(requesterId, done)](#AccountDocument.denyRequest)
  * [AccountDocument.getFriends(done)](#AccountDocument.getFriends)
  * [AccountDocument.getFriendsOfFriends(done)](#AccountDocument.getFriendsOfFriends)
  * [AccountDocument.getNonFriends(done)](#AccountDocument.getNonFriends)
  * [AccountDocument.isFriend(accountId, done)](#AccountDocument.isFriend)
  * [AccountDocument.isFriendOfFriends(accountId, done)](#AccountDocument.isFriendOfFriends)
  * [AccountDocument.getFriendship(accountId, done)](#AccountDocument.getFriendship)
  * [AccountDocument.getRelationship(accountId, done)](#AccountDocument.getRelationship)
 
<a name="module_friendship"></a>
#friendship
<a name="module_friendship..friendshipInit"></a>
##friendship~friendshipInit(options)
Configure then compile Friendship model

**Params**

- options `Object` - configuration options  

**Scope**: inner function of [friendship](#module_friendship)  
**Returns**: `Model` - - the compiled Friendship model  
<a name="module_plugin"></a>
#plugin
<a name="module_plugin..friendshipPlugin"></a>
##plugin~friendshipPlugin(schema, options)
adds friends-of-friends functionality to an existing Schema

**Params**

- schema `Schema` - The mongoose Schema that gets plugged  
- options `Object` - Options passed to the plugin  

**Scope**: inner function of [plugin](#module_plugin)  
<a name="module_privacy"></a>
#privacy
**Members**

* [privacy](#module_privacy)
  * [const: privacy.names](#module_privacy.names)
  * [const: privacy.values](#module_privacy.values)

<a name="module_privacy.names"></a>
##const: privacy.names
a map of privacy values to their human readable names 
```javascript
[
    "ANYBODY",
    "FRIENDS_OF_FRIENDS", 
    "FRIENDS", 
    "NOBODY"
];
```

**Type**: `Array`  
<a name="module_privacy.values"></a>
##const: privacy.values
a map of privacy names to their respective values
```javascript
{
    ANYBODY:              0,
    FRIENDS_OF_FRIENDS:   1,
    FRIENDS:              2,
    NOBODY:               3
};
```

**Type**: `Object`  
<a name="module_relationships"></a>
#relationships
**Members**

* [relationships](#module_relationships)
  * [const: relationships.names](#module_relationships.names)
  * [const: relationships.values](#module_relationships.values)

<a name="module_relationships.names"></a>
##const: relationships.names
a map of relationship values to their human readable names 
```javascript
[
    "NOT_FRIENDS",
    "FRIENDS_OF_FRIENDS",
    "FRIENDS"
];
```

**Type**: `Array`  
<a name="module_relationships.values"></a>
##const: relationships.values
a map of relationship names to their respective values 
```javascript
{
    NOT_FRIENDS:         0,
    FRIENDS_OF_FRIENDS:  1,
    FRIENDS:             2
};
```

**Type**: `Object`  
<a name="FriendshipModel"></a>
#class: FriendshipModel
**Members**

* [class: FriendshipModel](#FriendshipModel)
  * [FriendshipModel.getRequests(accountId, done)](#FriendshipModel.getRequests)
  * [FriendshipModel.getSentRequests(accountId, done)](#FriendshipModel.getSentRequests)
  * [FriendshipModel.getReceivedRequests(accountId, done)](#FriendshipModel.getReceivedRequests)
  * [FriendshipModel.acceptRequest(requesterId, requestedId, done)](#FriendshipModel.acceptRequest)
  * [FriendshipModel.denyRequest(requesterId, requestedId, done)](#FriendshipModel.denyRequest)
  * [FriendshipModel.getFriends(accountId, done)](#FriendshipModel.getFriends)
  * [FriendshipModel.getFriendsOfFriends(accountId, done)](#FriendshipModel.getFriendsOfFriends)
  * [FriendshipModel.isFriend(accountId1, accountId2, done)](#FriendshipModel.isFriend)
  * [FriendshipModel.isFriendOfFriends(accountId1, accountId2, done)](#FriendshipModel.isFriendOfFriends)
  * [FriendshipModel.getRelationship(accountId1, accountId2, done)](#FriendshipModel.getRelationship)
  * [FriendshipModel.isRequester(friendshipId, accountId, done)](#FriendshipModel.isRequester)
  * [FriendshipModel.isRequested(friendshipId, accountId, done)](#FriendshipModel.isRequested)
  * [const: FriendshipModel.privacy](#FriendshipModel.privacy)
  * [const: FriendshipModel.relationships](#FriendshipModel.relationships)

<a name="FriendshipModel.getRequests"></a>
##FriendshipModel.getRequests(accountId, done)
get all friend requests for a given user

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

<a name="FriendshipModel.isFriend"></a>
##FriendshipModel.isFriend(accountId1, accountId2, done)
determine if accountId2 is a friend of accountId1

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed a boolean determination  

<a name="FriendshipModel.isFriendOfFriends"></a>
##FriendshipModel.isFriendOfFriends(accountId1, accountId2, done)
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

<a name="FriendshipModel.isRequester"></a>
##FriendshipModel.isRequester(friendshipId, accountId, done)
check to see if the given user is the requester in a given friendship

**Params**

- friendshipId `ObjectId` - the _id of the friendship document  
- accountId `ObjectId` - the _id of the account  
- done `function` - required callback  

<a name="FriendshipModel.isRequested"></a>
##FriendshipModel.isRequested(friendshipId, accountId, done)
check to see if the given user is requested in a given friendship

**Params**

- friendshipId `ObjectId` - the _id of the friendship  
- accountId `ObjectId` - the _id of the account  
- done `function` - required callback  

<a name="FriendshipModel.privacy"></a>
##const: FriendshipModel.privacy
Default privacy constants

**Type**: `Object`  
<a name="FriendshipModel.relationships"></a>
##const: FriendshipModel.relationships
default relationship constants

**Type**: `Object`  
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

<a name="FriendsOfFriends"></a>
#class: FriendsOfFriends
**Members**

* [class: FriendsOfFriends](#FriendsOfFriends)
  * [new FriendsOfFriends(options)](#new_FriendsOfFriends)
  * [FriendsOfFriends~defaults](#FriendsOfFriends..defaults)
  * [friendsOfFriends.friendship](#FriendsOfFriends#friendship)
  * [friendsOfFriends.plugin](#FriendsOfFriends#plugin)
  * [friendsOfFriends.privacy](#FriendsOfFriends#privacy)
  * [friendsOfFriends.relationships](#FriendsOfFriends#relationships)
  * [friendsOfFriends.get(property)](#FriendsOfFriends#get)
  * [friendsOfFriends.set(property, value)](#FriendsOfFriends#set)

<a name="new_FriendsOfFriends"></a>
##new FriendsOfFriends(options)
Creates a new FriendsOfFriends Object
```javascript
var options = { 
    accountName:             'Player',
    accountCollection:       'foo_userAccounts',
    friendshipName:          'Friend_Relationships', 
    friendshipCollection:    'bar_userRelationships',
    privacyDefault:          2 // privacy.values.FRIENDS
};

var FriendsOfFriends = require('friends-of-friends')();
// or
var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends(options);
```

**Params**

- options `Object` - optional object containing configurable options  

<a name="FriendsOfFriends..defaults"></a>
##FriendsOfFriends~defaults
defines default configuration options

**Properties**

- modelName `String` - the name of the account model; default: 'Account'  
- privacyDefault `Number` - the default privacy value; default: 0.  

**Scope**: inner member of [FriendsOfFriends](#FriendsOfFriends)  
**Type**: `Object`  
<a name="FriendsOfFriends#friendship"></a>
##friendsOfFriends.friendship
The Friendship model

**Type**: `Object`  
<a name="FriendsOfFriends#plugin"></a>
##friendsOfFriends.plugin
mongoose plugin

**Type**: `function`  
<a name="FriendsOfFriends#privacy"></a>
##friendsOfFriends.privacy
privacy constants

**Type**: `Array`  
<a name="FriendsOfFriends#relationships"></a>
##friendsOfFriends.relationships
relationship constants

**Type**: `Object`  
<a name="FriendsOfFriends#get"></a>
##friendsOfFriends.get(property)
return the value of a property of this.options

**Params**

- property `String` - the property to get  

<a name="FriendsOfFriends#set"></a>
##friendsOfFriends.set(property, value)
set the value of a property of `this.options`

**Params**

- property `String` - The name of the Property  
- value  - The new value of the property  

<a name="AccountModel"></a>
#class: AccountModel
**Members**

* [class: AccountModel](#AccountModel)
  * [AccountModel.friendRequest(requesterId, requested_Id, done)](#AccountModel.friendRequest)
  * [AccountModel.getRequests(accountId, done)](#AccountModel.getRequests)
  * [AccountModel.getSentRequests(accountId, done)](#AccountModel.getSentRequests)
  * [AccountModel.getReceivedRequests(accountId, done)](#AccountModel.getReceivedRequests)
  * [AccountModel.acceptRequest(requesterId, requestedId, done)](#AccountModel.acceptRequest)
  * [AccountModel.denyRequest(requesterId, requestedId, done)](#AccountModel.denyRequest)
  * [AccountModel.getFriends(accountId, done)](#AccountModel.getFriends)
  * [AccountModel.getFriendsOfFriends(accountId, done)](#AccountModel.getFriendsOfFriends)
  * [AccountModel.isFriend(accountId1, accountId2, done)](#AccountModel.isFriend)
  * [AccountModel.isFriendOfFriends(accountId1, accountId2, done)](#AccountModel.isFriendOfFriends)
  * [AccountModel.getFriendship(accountId1, accountId2, done)](#AccountModel.getFriendship)
  * [AccountModel.getRelationship(accountId1, accountId2, done)](#AccountModel.getRelationship)
  * [const: AccountModel.privacy](#AccountModel.privacy)
  * [const: AccountModel.relationships](#AccountModel.relationships)

<a name="AccountModel.friendRequest"></a>
##AccountModel.friendRequest(requesterId, requested_Id, done)
sends a friend request to a another user

**Params**

- requesterId `ObjectId` - the ObjectId of the account sending the request  
- requested_Id `ObjectId` - the ObjectId of the account to whom the request will be sent  
- done `function` - required callback, passed the populated request  

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
- done `function` - required callback, passed the populated friendship accepted  

<a name="AccountModel.denyRequest"></a>
##AccountModel.denyRequest(requesterId, requestedId, done)
deny a friend request

**Params**

- requesterId `ObjectId` - the _id of the requester of friendship  
- requestedId `ObjectId` - the _id of the user whose friendship was requested  
- done `function` - required callback, passed the denied friendship  

<a name="AccountModel.getFriends"></a>
##AccountModel.getFriends(accountId, done)
get all friends of an account

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback, passed an array of friends  

<a name="AccountModel.getFriendsOfFriends"></a>
##AccountModel.getFriendsOfFriends(accountId, done)
get friends of this account's friends

**Params**

- accountId `ObjectId` - the _id of the account  
- done `function` - required callback, passed an array of friendsOfFriends  

<a name="AccountModel.isFriend"></a>
##AccountModel.isFriend(accountId1, accountId2, done)
determine if accountId2 is a friend of accountId1

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed a boolean determination  

<a name="AccountModel.isFriendOfFriends"></a>
##AccountModel.isFriendOfFriends(accountId1, accountId2, done)
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
determine the relationship between two users

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed err and a Relationship value  

<a name="AccountModel.privacy"></a>
##const: AccountModel.privacy
default privacy constants

**Type**: `Object`  
<a name="AccountModel.relationships"></a>
##const: AccountModel.relationships
default relationship constants

**Type**: `Object`  
<a name="AccountDocument"></a>
#class: AccountDocument
**Members**

* [class: AccountDocument](#AccountDocument)
  * [new AccountDocument()](#new_AccountDocument)
  * [AccountDocument.friendRequest(requestedEmail, done)](#AccountDocument.friendRequest)
  * [AccountDocument.getRequests(done)](#AccountDocument.getRequests)
  * [AccountDocument.getSentRequests(done)](#AccountDocument.getSentRequests)
  * [AccountDocument.getReceivedRequests(done)](#AccountDocument.getReceivedRequests)
  * [AccountDocument.acceptRequest(requesterId, done)](#AccountDocument.acceptRequest)
  * [AccountDocument.denyRequest(requesterId, done)](#AccountDocument.denyRequest)
  * [AccountDocument.getFriends(done)](#AccountDocument.getFriends)
  * [AccountDocument.getFriendsOfFriends(done)](#AccountDocument.getFriendsOfFriends)
  * [AccountDocument.getNonFriends(done)](#AccountDocument.getNonFriends)
  * [AccountDocument.isFriend(accountId, done)](#AccountDocument.isFriend)
  * [AccountDocument.isFriendOfFriends(accountId, done)](#AccountDocument.isFriendOfFriends)
  * [AccountDocument.getFriendship(accountId, done)](#AccountDocument.getFriendship)
  * [AccountDocument.getRelationship(accountId, done)](#AccountDocument.getRelationship)

<a name="new_AccountDocument"></a>
##new AccountDocument()
Document-accessible properties and methods

these instance methods are aliases of the Model statics as they apply to each document

example:
 var user = new Accounts({...});
 user.sendRequest(requestedEmail, function (err, request) {...})

<a name="AccountDocument.friendRequest"></a>
##AccountDocument.friendRequest(requestedEmail, done)
send a request to another account

**Params**

- requestedEmail `ObjectId` - the _id of the account to whom the request will be sent  
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

