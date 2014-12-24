# Global





* * *

## Class: FriendsOfFriends
Creates a new FriendsOfFriends Object
```javascript
var options = { 
    accountName:             'Player',
    accountCollection:       'foo_userAccounts',
    friendshipName:          'Friend_Relationships', 
    friendshipCollection:    'bar_userRelationships',
};

var friendsOfFriends = require('friends-of-friends')();
// or
var Fof = require('friends-of-friends');
var friendsOfFriends = new Fof(options);
```

**defaults**: `Object` , defines default configuration options
**friendship**: `Object` , The Friendship model
**plugin**: `function` , mongoose plugin
**relationships**: `Object` , relationship constants

### FriendsOfFriends.get(property) 

return the value of a property of this.options

**Parameters**

**property**: `String`, the property to get


### FriendsOfFriends.set(property, value) 

set the value of a property of `this.options`

**Parameters**

**property**: `String`, The name of the Property

**value**: , The new value of the property




* * *










