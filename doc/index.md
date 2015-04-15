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

var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends();
// works with or without 'new'
var FriendsOfFriends = require('friends-of-friends')();
```

 Default Configuration 
```javascript
var defaults = {
    // define the name for your Users model.
    accountName: 'Account',
    // define the name of the Users colletion. 
    accountCollection: undefined,
    // define the name for the Friendship model
    friendshipName: 'Friendship',
    // define the name of the Friendship collection.
    friendshipCollection: undefined
}
```

 Specifying Configuration Options
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

**Params**

- options `Object` - optional object containing configurable options  

<a name="FriendsOfFriends.options"></a>
##FriendsOfFriends.options
The options defined for the module instance

**Properties**

- accountName `String` - The name to call the model to be compiled from the Account Schema. Default: `'Account'`  
- accountCollection `String` - The name to use for the Account Collection. Default: `undefined`.  
- friendshipName `String` - The name to call the model to be compiled from the Friendship Schema. Default: `'Friendship'`  
- friendshipCollection `String` - The name to use for the Account Collection. Default: `undefined`.  

**Type**: `Object`  
<a name="FriendsOfFriends.friendship"></a>
##FriendsOfFriends.friendship
The Friendship model

**Type**: `Model`  
<a name="FriendsOfFriends.relationships"></a>
##FriendsOfFriends.relationships
Relationship constants

**Properties**

- '0' `String` - Value: `'NOT_FRIENDS'`  
- '1' `String` - Value: `'FRIENDS_OF_FRIENDS'`  
  - '1.5' `String` - Value: `'PENDING_FRIENDS'`  
- '2' `String` - Value: `'FRIENDS'`  
- NOT_FRIENDS `Number` - Value: `0`  
- FRIENDS_OF_FRIENDS `Number` - Value: `1`  
- PENDING_FRIENDS `Number` - Value: `1.5`  
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
