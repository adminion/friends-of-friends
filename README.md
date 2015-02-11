# friends-of-friends 
## Friendship Mangement for Mongoose 

[![Build Status](https://travis-ci.org/adminion/friends-of-friends.svg?branch=master)](https://travis-ci.org/adminion/friends-of-friends) 
[![Coverage Status](https://coveralls.io/repos/adminion/friends-of-friends/badge.svg?branch=master)](https://coveralls.io/r/adminion/friends-of-friends?branch=master)

## Installlation

    $ npm install friends-of-friends

If you want run the tests, you should install with the `--dev` flag

    $ npm install --dev friends-of-friends

## Usage

### Default Configuration
```javascript

var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends();
// works with or without 'new'
var FriendsOfFriends = require('friends-of-friends')();
```

#### Defaults
```javascript
var defaults = {
    // define the name for your Users model.
    accountName: 'Account',
    // define the name of the Users colletion. See: http://mongoosejs.com/docs/guide.html#collection
    accountCollection: undefined,
    // define the name for the Friendship model
    friendshipName: 'Friendship',
    // define the name of the Friendship collection.
    friendshipCollection: undefined
}
```

### Specifying Configuration Options
```javascript

var options = { 
     accountName:             'Player',
     accountCollection:       'foo_userAccounts',
     friendshipName:          'Friend_Relationships', 
     friendshipCollection:    'bar_userRelationships',
 };
 
var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends(options);
// again, works with or without 'new'
var FriendsOfFriends = require('friends-of-friends')(options);
```

### Plugin friends-of-friends to User Schema
```javascript
var mongoose = require('mongoose');

// create you User schema
var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true }
});

// apply friends-of-friends plugin to your User schema
UserSchema.plugin(friendsOfFriends.plugin, options);

// compile your user model
var User = mongoose.model(options.accountName), UserSchema);

// create users
var Jeff = new User({ username: "Jeff" }),
    Zane = new User({ username: "Zane"}),
    Sam = new User({ username: "Sam"});

console.log('Jeff', Jeff);
console.log('Zane', Zane);
console.log('Zane', Zane);

// Jeff: { __v: 0, username: 'Jeff', _id: 54c6eb7cf2f9fe9672b90ba2 }
// Zane: { __v: 0, username: 'Zane', _id: 54c6eb7cf2f9fe9672b90ba3 }
// Sam: { __v: 0, username: 'Sam', _id: 54c6eb7cf2f9fe9672b90ba4 }

// connect to db
mongoose.connect('mongodb://localhost/test');
```

### Use Plugged-in functionality

#### Send Friend Requests 
Jeff can ask Zane to be friends
```javascript
Jeff.friendRequest(Zane._id, function (err, request) {
    if (err) throw err;

    console.log('request', request);
    // request { __v: 0,
    //   requester: { username: 'Jeff', _id: 54c6eb7cf2f9fe9672b90ba2, __v: 0 },
    //   requested: { username: 'Zane', _id: 54c6eb7cf2f9fe9672b90ba3, __v: 0 },
    //   _id: 54c6eb7cf2f9fe9672b90ba4,
    //   dateSent: Mon Jan 26 2015 17:35:56 GMT-0800 (PST),
    //   status: 'Pending' }
});
```

#### Deny Friend Requests
Zane could deny Jeff's Request...
```javascript
Zane.denyRequest(Jeff._id, function (err, denied) {
    if (err) throw err;

    console.log('denied', denied);
    // denied 1
});
```

#### Accept Friend Requests
... or Zane could accept Jeff's Request
```javascript
Zane.acceptRequest(Jeff._id, function (err, friendship) {
    if (err) throw err;

    console.log('friendship', friendship);
        // friendship { __v: 0,
        //   _id: 54c6eb7cf2f9fe9672b90ba4,
        //   dateAccepted: Mon Jan 26 2015 17:35:57 GMT-0800 (PST),
        //   requested: { username: 'Zane', _id: 54c6eb7cf2f9fe9672b90ba3, __v: 0 },
        //   requester: { username: 'Jeff', _id: 54c6eb7cf2f9fe9672b90ba2, __v: 0 },
        //   dateSent: Mon Jan 26 2015 17:35:56 GMT-0800 (PST),
        //   status: 'Accepted' }
});
```

#### Get Friends
Now Jeff can get a list of his friends
```javascript

// Zane is now Jeff's friend
Jeff.getFriends(function (err, friends) {
    if (err) throw err;

    console.log('friends', friends);
    // friends [ { username: 'Zane', _id: 54c6eb7cf2f9fe9672b90ba3, __v: 0 } ]
});
```

#### Get Friends Of Friends
When two users are not friends, but have at least one friend in common, they are friends-of-friends
```javascript
// 
Zane.friendRequest(Sam._id, function (err, request) {
    if (err) throw err;

    console.log('request', request);
    // request { __v: 0,
    //   requester: { username: 'Zane', _id: 54c6eb7cf2f9fe9672b90ba3, __v: 0 },
    //   requested: { username: 'Sam', _id: 54c6eb7cf2f9fe9672b90ba4, __v: 0 },
    //   _id: 54c6eb7cf2f9fe9672b90ba5,
    //   dateSent: Mon Jan 26 2015 17:35:58 GMT-0800 (PST),
    //   status: 'Pending' }
    
    Sam.acceptRequest(Zane._id, function (err, friendship) {
        if (err) throw err;

        console.log('friendship', friendship);
        // friendship { __v: 0,
        //   _id: 54c6eb7cf2f9fe9672b90ba5,
        //   dateAccepted: Mon Jan 26 2015 17:35:59 GMT-0800 (PST),
        //   requested: { username: 'Sam', _id: 54c6eb7cf2f9fe9672b90ba4, __v: 0 },
        //   requester: { username: 'Zane', _id: 54c6eb7cf2f9fe9672b90ba3, __v: 0 },
        //   dateSent: Mon Jan 26 2015 17:35:58 GMT-0800 (PST),
        //   status: 'Accepted' }
    
        Jeff.getFriendsOfFriends(function (err, friendsOfJeffsFriends) {
            if (err) throw (err)

            console.log('friendsOfJeffsFriends', friendsOfJeffsFriends);
            // friendsOfJeffsFriends [ { username: 'Sam', _id: 54c6eb7cf2f9fe9672b90ba4, __v: 0 } ]
        });
    });
});
```

## API

You may generate local docs (located in `docs/`) using `npm`

    $ npm run docs

**Classes**

* [class: FriendshipModel](#FriendshipModel)
  * [FriendshipModel.relationships](#FriendshipModel.relationships)
  * [FriendshipModel.getRequests(accountId, done)](#FriendshipModel.getRequests)
  * [FriendshipModel.getSentRequests(accountId, done)](#FriendshipModel.getSentRequests)
  * [FriendshipModel.getReceivedRequests(accountId, done)](#FriendshipModel.getReceivedRequests)
  * [FriendshipModel.acceptRequest(requesterId, requestedId, done)](#FriendshipModel.acceptRequest)
  * [FriendshipModel.denyRequest(requesterId, requestedId, done)](#FriendshipModel.denyRequest)
  * [FriendshipModel.getFriends(accountId, done)](#FriendshipModel.getFriends)
  * [FriendshipModel.getFriendsOfFriends(accountId, done)](#FriendshipModel.getFriendsOfFriends)
  * [FriendshipModel.areFriends(accountId1, accountId2, done)](#FriendshipModel.areFriends)
  * [FriendshipModel.areFriendsOfFriends(accountId1, accountId2, done)](#FriendshipModel.areFriendsOfFriends)
  * [FriendshipModel.getRelationship(accountId1, accountId2, done)](#FriendshipModel.getRelationship)
  * [FriendshipModel.isRequester(friendshipId, accountId, done)](#FriendshipModel.isRequester)
  * [FriendshipModel.isRequested(friendshipId, accountId, done)](#FriendshipModel.isRequested)
* [class: FriendshipDocument](#FriendshipDocument)
  * [FriendshipDocument.isRequester(accountId, done)](#FriendshipDocument.isRequester)
  * [FriendshipDocument.isRequested(accountId, done)](#FriendshipDocument.isRequested)
* [class: FriendsOfFriends](#FriendsOfFriends)
  * [new FriendsOfFriends(options)](#new_FriendsOfFriends)
  * [FriendsOfFriends.options](#FriendsOfFriends.options)
  * [FriendsOfFriends.friendship](#FriendsOfFriends.friendship)
  * [FriendsOfFriends.relationships](#FriendsOfFriends.relationships)
  * [FriendsOfFriends.plugin(schema, options)](#FriendsOfFriends.plugin)
  * [friendsOfFriends.get(property)](#FriendsOfFriends#get)
  * [friendsOfFriends.set(property, value)](#FriendsOfFriends#set)
* [class: AccountModel](#AccountModel)
  * [AccountModel.getFriendship(accountId1, accountId2, done)](#AccountModel.getFriendship)
  * [AccountModel.friendRequest(requesterId, requested_Id, done)](#AccountModel.friendRequest)
  * [AccountModel.getRequests(accountId, done)](#AccountModel.getRequests)
  * [AccountModel.getSentRequests(accountId, done)](#AccountModel.getSentRequests)
  * [AccountModel.getReceivedRequests(accountId, done)](#AccountModel.getReceivedRequests)
  * [AccountModel.acceptRequest(requesterId, requestedId, done)](#AccountModel.acceptRequest)
  * [AccountModel.denyRequest(requesterId, requestedId, done)](#AccountModel.denyRequest)
  * [AccountModel.endFriendship(accountId1, accountId2, done)](#AccountModel.endFriendship)
  * [AccountModel.getFriends(accountId, done)](#AccountModel.getFriends)
  * [AccountModel.getFriendsOfFriends(accountId, done)](#AccountModel.getFriendsOfFriends)
  * [AccountModel.areFriends(accountId1, accountId2, done)](#AccountModel.areFriends)
  * [AccountModel.areFriendsOfFriends(accountId1, accountId2, done)](#AccountModel.areFriendsOfFriends)
  * [AccountModel.getFriendship(accountId1, accountId2, done)](#AccountModel.getFriendship)
  * [AccountModel.getRelationship(accountId1, accountId2, done)](#AccountModel.getRelationship)
  * [const: AccountModel.relationships](#AccountModel.relationships)
* [class: AccountDocument](#AccountDocument)
  * [new AccountDocument()](#new_AccountDocument)
  * [AccountDocument.friendRequest(requestedId, done)](#AccountDocument.friendRequest)
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
 
<a name="FriendshipModel"></a>
#class: FriendshipModel
**Members**

* [class: FriendshipModel](#FriendshipModel)
  * [FriendshipModel.relationships](#FriendshipModel.relationships)
  * [FriendshipModel.getRequests(accountId, done)](#FriendshipModel.getRequests)
  * [FriendshipModel.getSentRequests(accountId, done)](#FriendshipModel.getSentRequests)
  * [FriendshipModel.getReceivedRequests(accountId, done)](#FriendshipModel.getReceivedRequests)
  * [FriendshipModel.acceptRequest(requesterId, requestedId, done)](#FriendshipModel.acceptRequest)
  * [FriendshipModel.denyRequest(requesterId, requestedId, done)](#FriendshipModel.denyRequest)
  * [FriendshipModel.getFriends(accountId, done)](#FriendshipModel.getFriends)
  * [FriendshipModel.getFriendsOfFriends(accountId, done)](#FriendshipModel.getFriendsOfFriends)
  * [FriendshipModel.areFriends(accountId1, accountId2, done)](#FriendshipModel.areFriends)
  * [FriendshipModel.areFriendsOfFriends(accountId1, accountId2, done)](#FriendshipModel.areFriendsOfFriends)
  * [FriendshipModel.getRelationship(accountId1, accountId2, done)](#FriendshipModel.getRelationship)
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

<a name="FriendsOfFriends"></a>
#class: FriendsOfFriends
**Members**

* [class: FriendsOfFriends](#FriendsOfFriends)
  * [new FriendsOfFriends(options)](#new_FriendsOfFriends)
  * [FriendsOfFriends.options](#FriendsOfFriends.options)
  * [FriendsOfFriends.friendship](#FriendsOfFriends.friendship)
  * [FriendsOfFriends.relationships](#FriendsOfFriends.relationships)
  * [FriendsOfFriends.plugin(schema, options)](#FriendsOfFriends.plugin)
  * [friendsOfFriends.get(property)](#FriendsOfFriends#get)
  * [friendsOfFriends.set(property, value)](#FriendsOfFriends#set)

<a name="new_FriendsOfFriends"></a>
##new FriendsOfFriends(options)
Creates a new FriendsOfFriends Object with or without new
```javascript
var options = { 
    accountName:             'Player',
    accountCollection:       'foo_userAccounts',
    friendshipName:          'Friend_Relationships', 
    friendshipCollection:    'bar_userRelationships',
};

var FriendsOfFriends = require('friends-of-friends')();
// or
var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends(options);
```

**Params**

- options `Object` - optional object containing configurable options  

<a name="FriendsOfFriends.options"></a>
##FriendsOfFriends.options
The options defined for the module instance

**Properties**

- accountName `String` - The name to call the model to be compiled from the Account Schema. Default: `'Account'`  
- FriendshipName `String` - The name to call the model to be compiled from the Friendship Schema. Default: `'Friendship'`  

**Type**: `Object`  
<a name="FriendsOfFriends.friendship"></a>
##FriendsOfFriends.friendship
The Friendship model

**Type**: `Model`  
<a name="FriendsOfFriends.relationships"></a>
##FriendsOfFriends.relationships
Relationship constants

**Properties**

- 0 `String` - Value: `'NOT_FRIENDS'`  
- 1 `String` - Value: `'FRIENDS_OF_FRIENDS'`  
- 2 `String` - Value: `'FRIENDS'`  
- NOT_FRIENDS `Number` - Value: `0`  
- FRIENDS_OF_FRIENDS `Number` - Value: `1`  
- FRIENDS `Number` - Value: `2`  

**Type**: `Object`  
<a name="FriendsOfFriends.plugin"></a>
##FriendsOfFriends.plugin(schema, options)
Adds friends-of-friends functionality to an existing Schema

**Params**

- schema `Schema` - The mongoose Schema that gets plugged  
- options `Object` - Options passed to the plugin  

<a name="FriendsOfFriends#get"></a>
##friendsOfFriends.get(property)
Return the value of a property of `this.options`

**Params**

- property `String` - The property to get  

**Returns**: `Mixed`  
<a name="FriendsOfFriends#set"></a>
##friendsOfFriends.set(property, value)
Set the value of a property of `this.options`

**Params**

- property `String` - The name of the Property  
- value `Mixed` - The new value of the property  

**Returns**: `Mixed`  
<a name="AccountModel"></a>
#class: AccountModel
**Members**

* [class: AccountModel](#AccountModel)
  * [AccountModel.getFriendship(accountId1, accountId2, done)](#AccountModel.getFriendship)
  * [AccountModel.friendRequest(requesterId, requested_Id, done)](#AccountModel.friendRequest)
  * [AccountModel.getRequests(accountId, done)](#AccountModel.getRequests)
  * [AccountModel.getSentRequests(accountId, done)](#AccountModel.getSentRequests)
  * [AccountModel.getReceivedRequests(accountId, done)](#AccountModel.getReceivedRequests)
  * [AccountModel.acceptRequest(requesterId, requestedId, done)](#AccountModel.acceptRequest)
  * [AccountModel.denyRequest(requesterId, requestedId, done)](#AccountModel.denyRequest)
  * [AccountModel.endFriendship(accountId1, accountId2, done)](#AccountModel.endFriendship)
  * [AccountModel.getFriends(accountId, done)](#AccountModel.getFriends)
  * [AccountModel.getFriendsOfFriends(accountId, done)](#AccountModel.getFriendsOfFriends)
  * [AccountModel.areFriends(accountId1, accountId2, done)](#AccountModel.areFriends)
  * [AccountModel.areFriendsOfFriends(accountId1, accountId2, done)](#AccountModel.areFriendsOfFriends)
  * [AccountModel.getFriendship(accountId1, accountId2, done)](#AccountModel.getFriendship)
  * [AccountModel.getRelationship(accountId1, accountId2, done)](#AccountModel.getRelationship)
  * [const: AccountModel.relationships](#AccountModel.relationships)

<a name="AccountModel.getFriendship"></a>
##AccountModel.getFriendship(accountId1, accountId2, done)
get the friendship document of two accounts

**Params**

- accountId1 `ObjectId` - the _id of account1  
- accountId2 `ObjectId` - the _id of account2  
- done `function` - required callback, passed err and a Friendship document, if found  

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
get friends of this account's friends

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
```javascript
 var jeff = new User({ username: "Jeff" });
 user.sendRequest(requestedEmail, function (err, request) {...})
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

