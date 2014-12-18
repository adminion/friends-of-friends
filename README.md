friends-of-friends
==================

## Friendship-based Access Control System for Mongoose

This module is a work in progress, and may break on you because I haven't written tests to verify stuff works like I say it should.  Wanna [help out](https://github.com/adminion/friends-of-friends/labels/test)...?

If you would like to contribute, point out errors, etc, I would be much appreciative!

This module started as a core component of [adminion/off-the-record](https://github.com/adminion/off-the-record) but quickly became big enough (and useful enough) to be its own module.  The goal is to create a comprehensive Friendship-based Access Control System with a rich API to *dramatically* simplify managing Friend-Relationships for any existing mongoose schema.

## example use

```javascript
var friendsOfFriends = require('friends-of-friends')({
    privacyDefault: friendsOfFriends.PRIVACY.values.ANYBODY
}),
    mongoose = require('mongoose');
    
var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true }
});

UserSchema.plugin(friendsOfFriends.plugin);

var jeff = new UserSchema({ username: "Jeff" }).save(function (err, savedJeff) {
    if (err) throw err;
    
    var zane = new userSchema({ username: "Zane"}).save(function (err, savedZane) {
        if (err) throw err;
    
        jeff.friendRequest(zane._id, function (err, pendingFriendship) {
            if (err) throw err;    
    
            zane.acceptRequest(jeff._id, funtion (err, acceptedFriendship) {
                if (err) throw err;
    
                zane.getFriends(function (err, friends) {
                    if (err) throw err;
    
                    console.log(friends); 
                    // [{
                    //     "privacy" : {
                    //         "search" : 0,
                    //         "profile" : 0,
                    //         "friendRequests" : 0,
                    //         "chatRequests" : 0
                    //     },
                    //     "_id" : ObjectId("548fa103db733f53454670f5"),
                    //     "username" : "elgranjeff",
                    //     "__v" : 0
                    // }]
                })
            });
        });
    });
});
```

## API
See [docs/api.md](https://github.com/adminion/friends-of-friends/tree/master/docs/api.md) for API Documentation.
