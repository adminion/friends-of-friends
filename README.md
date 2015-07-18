# friends-of-friends 
## Friendship Mangement for Mongoose 

[![Build Status](https://travis-ci.org/adminion/friends-of-friends.svg?branch=master)](https://travis-ci.org/adminion/friends-of-friends) 
[![Coverage Status](https://coveralls.io/repos/adminion/friends-of-friends/badge.svg?branch=master)](https://coveralls.io/r/adminion/friends-of-friends?branch=master)

## Contributing
I am open to and will happily accept contributions of bug-fixes and new features.  We'll need to discuss breaking changes.

### Bugs
If you believe you have found a bug, please create an issue describing the bug with code that reproduces the bug.  Once we verify that it is in fact a bug, please provide a fix suggest how it could be fixed.

If your fix doesn't pass the tests, please either fix your code or prove to me that my tests are inadequate (and fix them, pretty please :D)

### New Features
If you would like to propose a new feature, please

1. make a fork
2. create a new branch `new-feature-x`
3. implement your new feature in `new-feature-x`
4. write tests which your new feature will pass
4. commit and push that branch to your `your_repo`
5. make a pull request from `your_repo:new-feature-x` into `adminion:master`

### Breaking Changes
Breaking changes will only be considered if they dramatically improve stability, performance, and/or usability with minimal code modifications for end-users.

## Installlation

    $ npm install friends-of-friends

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
    personModelName: 'Person',
    // define the name for the Friendship model
    friendshipModelName: 'Friendship',
    // define the name of the Friendship collection.
    friendshipCollectionName: 'Friendships'
}
```

### Specifying Configuration Options
```javascript
var mongoose = require('mongoose');

var options = { 
     personModelName:             'Player',
     accountCollection:       'foo_userAccounts',
     friendshipName:          'Friend_Relationships', 
     friendshipCollection:    'bar_userRelationships',
 };
 
var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends(mongoose, options);
// again, works with or without 'new'
var FriendsOfFriends = require('friends-of-friends')(mongoose, options);
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
var User = mongoose.model(options.personModelName), UserSchema);

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

## Tests

You can run the tests with `npm test`

    $ npm test

## API

API documentation is located in `doc/`

## License

Copyright (c) 2014-2015 Jeff Harris

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
