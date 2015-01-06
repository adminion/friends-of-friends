# friends-of-friends [![Build Status](https://travis-ci.org/adminion/friends-of-friends.svg?branch=master)](https://travis-ci.org/adminion/friends-of-friends)

## Friendship Mangement System for Mongoose 

This module is a work in progress, and may break on you because I haven't written tests to verify stuff works like I say it should.  Wanna [help out](https://github.com/adminion/friends-of-friends/labels/test)...?  I would be much appreciative!

This module started as a core component of [adminion/off-the-record](https://github.com/adminion/off-the-record) but quickly became big enough (and useful enough) to be its own module.  The goal is to create a unopinionated tool with a rich API that simplifies managing Friend-Relationships for any existing mongoose "user" schema.

## example use

```javascript
var friendsOfFriends = require('friends-of-friends')(),
    mongoose = require('mongoose');
    
var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true }
});

UserSchema.plugin(friendsOfFriends.plugin);

new UserSchema({ username: "Jeff" }).save(function (err, jeff) {
    if (err) throw err;

    console.log(jeff);
    // {
    //     "_id" : ObjectId("5462a8748337aa9e306b5094"),
    //     "username" : "Jeff",
    //     "__v" : 0
    // }
    
    new userSchema({ username: "Zane"}).save(function (err, zane) {
        if (err) throw err;

        console.log(zane);
        // {
        //     "_id" : ObjectId("548a9f64728158187fb53319"),
        //     "username" : "Zane",
        //     "__v" : 0
        // }
    
        jeff.friendRequest(zane._id, function (err, pendingFriendship) {
            if (err) throw err; 

            console.log(pendingFriendship);
            // {
            //     "requester" : ObjectId("5462a8748337aa9e306b5094"),
            //     "requested" : ObjectId("548a9f64728158187fb53319"),
            //     "_id" : ObjectId("548e86c96eb8f64370d90215"),
            //     "dateSent" : ISODate("2014-12-04T05:21:29.908Z"),
            //     "status" : "Pending",
            //     "__v" : 0
            // }
            
            zane.acceptRequest(jeff._id, funtion (err, acceptedFriendship) {
                if (err) throw err;

                console.log(acceptedFriendship);
                // {
                //     "__v" : 0,
                //     "_id" : ObjectId("548e86c96eb8f64370d90215"),
                //     "dateAccepted" : ISODate("2014-12-04T05:26:09.583Z"),
                //     "dateSent" : ISODate("2014-12-04T05:21:29.908Z"),
                //     "requested" : ObjectId("548a9f64728158187fb53319"),
                //     "requester" : ObjectId("5462a8748337aa9e306b5094"),
                //     "status" : "Accepted"
                // }
    
                zane.getFriends(function (err, friends) {
                    if (err) throw err;
    
                    console.log(friends); 
                    // [{
                    //     "_id" : ObjectId("5462a8748337aa9e306b5094"),
                    //     "username" : "Jeff",
                    //     "__v" : 0
                    // }]
                })
            });
        });
    });
});
```

## API
See [docs/](https://github.com/adminion/friends-of-friends/tree/master/docs/) for API Documentation in both rich HTML/JavaScript and Markdown.
