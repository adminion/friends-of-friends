# friends-of-friends 
## Friendship Mangement for Mongoose 

[![Build Status](https://travis-ci.org/adminion/friends-of-friends.svg?branch=master)](https://travis-ci.org/adminion/friends-of-friends) 
[![Coverage Status](https://coveralls.io/repos/adminion/friends-of-friends/badge.svg?branch=master)](https://coveralls.io/r/adminion/friends-of-friends?branch=master)

This module is almost finished, but I'm still writing tests to make sure it does what I say it should do.  

This module started as a core component of [adminion/off-the-record](https://github.com/adminion/off-the-record) but quickly became big enough (and useful enough) to be its own module.  The goal is to create a unopinionated tool with a rich API that simplifies managing Friend-Relationships for any existing mongoose "user" schema.  

    $ npm install friends-of-friends

## example use

```javascript

var async = require('async'),
    options = {accountName: 'User'},
    friendsOfFriends = require('./lib/')(options),
    mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true }
});

// plugin friends-of-friends functionality
UserSchema.plugin(friendsOfFriends.plugin, options);

var User = mongoose.model(friendsOfFriends.get('accountName'), UserSchema);

var db = mongoose.connection;

mongoose.connect('mongodb://localhost/someDB')

db.once('open', function () {
    async.parallel({
        jeff: function (done) {
            new User({ username: "Jeff" }).save(function (err, jeff) {
                done(err, jeff)
            });
        },
        zane: function (done) {
            new User({ username: "Zane"}).save(function (err, zane) {
                done(err, zane)
            });
        }
    },
    function (err, results) {

        if (err) throw err;


        console.log('results', results);
        // results { jeff: { __v: 0, username: 'Jeff', _id: 54c6eb7cf2f9fe9672b90ba2 },
        //   zane: { __v: 0, username: 'Zane', _id: 54c6eb7cf2f9fe9672b90ba3 } }

        async.series({
            request: function (next) {
                results.jeff.friendRequest(results.zane._id, function (err, request) {
                    next(err, request);
                });
            },
            friendship: function (next) {
                results.zane.acceptRequest(results.jeff._id, next);
            },
            friends: function (next) {
                async.parallel({
                    jeff: function (done) {
                        results.jeff.getFriends(done);
                    }, 
                    zane: function (done) {
                        results.zane.getFriends(done);
                    }
                }, function (err, results) {
                    next(err, results);
                })
            }
        }, function (err, results) {
            if (err) throw err;

            console.log('results.sent', results.sent);
            // results.request { __v: 0,
            //   requester: { username: 'Jeff', _id: 54c6eb7cf2f9fe9672b90ba2, __v: 0 },
            //   requested: { username: 'Zane', _id: 54c6eb7cf2f9fe9672b90ba3, __v: 0 },
            //   _id: 54c6eb7cf2f9fe9672b90ba4,
            //   dateSent: Mon Jan 26 2015 17:35:56 GMT-0800 (PST),
            //   status: 'Pending' }
            
            console.log('results.accepted', results.accepted);
            // results.friendship { __v: 0,
            //   _id: 54c6eb7cf2f9fe9672b90ba4,
            //   dateAccepted: Mon Jan 26 2015 17:35:56 GMT-0800 (PST),
            //   requested: { username: 'Zane', _id: 54c6eb7cf2f9fe9672b90ba3, __v: 0 },
            //   requester: { username: 'Jeff', _id: 54c6eb7cf2f9fe9672b90ba2, __v: 0 },
            //   dateSent: Mon Jan 26 2015 17:35:56 GMT-0800 (PST),
            //   status: 'Accepted' }


            console.log('results.friends.jeff', results.friends.jeff);
            // results.friends.jeff [ { username: 'Zane', _id: 54c6eb7cf2f9fe9672b90ba3, __v: 0 } ]

            console.log('results.friends.zane', results.friends.zane);
            // results.friends.zane [ { username: 'Jeff', _id: 54c6eb7cf2f9fe9672b90ba2, __v: 0 } ]

            db.close()
        });
    });
});

```

## API
See [docs/](https://github.com/adminion/friends-of-friends/tree/master/docs/) for API Documentation in both rich HTML/JavaScript and Markdown.
