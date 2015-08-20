# friends-of-friends 

## Add Friendship Management to any Mongoose Schema

friends-of-friends makes it nearly painless to develop custom social-networking applications by allowing you send/accept/deny friend requests, and search for friends, pending friends, friends of friends, and non-friends from a Model or Document.  

For details, see the [API](#api) and [Usage](#usage) sections below.

[![Build Status](https://travis-ci.org/adminion/friends-of-friends.svg?branch=master)](https://travis-ci.org/adminion/friends-of-friends) 
[![Coverage Status](https://coveralls.io/repos/adminion/friends-of-friends/badge.svg?branch=master)](https://coveralls.io/r/adminion/friends-of-friends?branch=master)

[![NPM](https://nodei.co/npm/friends-of-friends.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/friends-of-friends/)

[![NPM](https://nodei.co/npm-dl/friends-of-friends.png?months=6)](https://nodei.co/npm/friends-of-friends/)

### How does it work?
friends-of-friends defines a `friendships` collection that is used to store 1-to-1 friendships with pending/accepted status between users.  It also provides a mongoose plugin to add functionality to your existing user model providing support to send/get/accept/deny friendship requests as well as query for friends/non-friends/pending-friends/friends-of-friends using mongoose's rich [Model.find()](http://mongoosejs.com/docs/api.html#model_Model.find) syntax.  

### Do I need to modify my user schema to use friends-of-friends?
friends-of-friends currently (in the future, this will be configurable) depends on the `_id` field to be an [`ObjectId`](http://mongoosejs.com/docs/api.html#types_objectid_ObjectId) to track who is friends with who, but is otherwise unopinionated and leaves all design decisions up to you.  So long as you have not implemented fields/properties with the same name as any of the static/instance methods provided by the plugin, all functionality should work out-of-box.  

## Contributing
I'm sure there are bugs, please help me find/fix them!  If you make valuable contributions, I'll make you a collaborator :)

See the [Contribution Guide](CONTRIBUTING.md) for more information on how to contribute, run tests, and generate coverage reports.

## API

API documentation is located in [`doc/`](doc/)

## Installation

    $ npm install --save friends-of-friends

## Usage

### Create a new FriendsOfFriends Object
```javascript
// mongoose is required
var mongoose = require('mongoose');

var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends(mongoose);
// works with or without 'new'
var FriendsOfFriends = require('friends-of-friends')(mongoose);
```

#### Default Configuration Options
```javascript
var defaults = {
    // define the name for your Users model.
    personModelName:            'Person',
    // define the name for the Friendship model
    friendshipModelName:        'Friendship',
    // define the name of the Friendship collection.
    friendshipCollectionName:   undefined
}
```

### Specifying Configuration Options
```javascript
var options = { 
    personModelName:            'Player',
    friendshipModelName:        'Friend_Relationships', 
    friendshipCollectionName:   'foo_bar_userRelationships',
};
 
var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends(mongoose, options);
// again, works with or without 'new'
var FriendsOfFriends = require('friends-of-friends')(mongoose, options);
```

### Plug-in friends-of-friends to User Schema
```javascript
// ...

// your User schema
var UserSchema = new mongoose.Schema({
    username: String
});

// apply the friends-of-friends mongoose plugin to your User schema
UserSchema.plugin(friendsOfFriends.plugin, options);

// compile your user model
var User = mongoose.model(options.personModelName, UserSchema);

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

## License

Copyright (c) 2014-2015 Jeff Harris

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
