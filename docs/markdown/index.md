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

var FriendsOfFriends = require('friends-of-friends')();
// or
var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends(options);
```

**options**: `Object` , the options defined for the module instance
**friendship**: `Model` , The Friendship model
**plugin**: `function` , the mongoose plugin to add friendship methods
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










