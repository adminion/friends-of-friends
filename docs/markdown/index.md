# Global





* * *

## Class: FriendsOfFriends
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

**options**: `Object` , The options defined for the module instance
**friendship**: `Model` , The Friendship model
**relationships**: `Object` , Relationship constants
### FriendsOfFriends.plugin(schema, options) 

Adds friends-of-friends functionality to an existing Schema

**Parameters**

**schema**: `Schema`, The mongoose Schema that gets plugged

**options**: `Object`, Options passed to the plugin


### FriendsOfFriends.get(property) 

Return the value of a property of `this.options`

**Parameters**

**property**: `String`, The property to get

**Returns**: `Mixed`

### FriendsOfFriends.set(Property, value) 

Set the value of a property of `this.options`

**Parameters**

**Property**: `String`, The name of the Property

**value**: `Mixed`, The new value of the property

**Returns**: `Mixed`



* * *










