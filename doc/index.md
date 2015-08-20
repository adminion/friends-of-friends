<a name="FriendsOfFriends"></a>
## FriendsOfFriends
**Kind**: global class  

* [FriendsOfFriends](#FriendsOfFriends)
  * [new FriendsOfFriends(mongoose, options)](#new_FriendsOfFriends_new)
  * _instance_
    * [.get(property)](#FriendsOfFriends+get) ⇒ <code>Mixed</code>
    * [.set(property, value)](#FriendsOfFriends+set) ⇒ <code>Mixed</code>
  * _static_
    * [.options](#FriendsOfFriends.options) : <code>Object</code>
    * [.friendship](#FriendsOfFriends.friendship) : <code>Model</code>
    * [.relationships](#FriendsOfFriends.relationships) : <code>Object</code>
    * [.plugin(schema, options)](#FriendsOfFriends.plugin)

<a name="new_FriendsOfFriends_new"></a>
### new FriendsOfFriends(mongoose, options)
Create a new FriendsOfFriends Object with or without new
```javascript
// mongoose is required
var mongoose = require('mongoose');

var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends(mongoose);
// works with or without 'new'
var FriendsOfFriends = require('friends-of-friends')(mongoose);
```

Specifying Configuration Options
```javascript
var options = { 
    personModelName:             'Player',
    friendshipModelName:         'Friend_Relationships', 
    friendshipCollectionName:    'foo_bar_userRelationships',
};
 
var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends(mongoose, options);
// again, works with or without 'new'
var FriendsOfFriends = require('friends-of-friends')(mongoose, options);
```


| Param | Type | Description |
| --- | --- | --- |
| mongoose | <code>Object</code> | required: mongoose instance used in your application |
| options | <code>Object</code> | optional object containing configurable options |

<a name="FriendsOfFriends+get"></a>
### friendsOfFriends.get(property) ⇒ <code>Mixed</code>
Return the value of a property of `this.options`

**Kind**: instance method of <code>[FriendsOfFriends](#FriendsOfFriends)</code>  
**See**: [options](#FriendsOfFriends.options)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>String</code> | The property to get |

<a name="FriendsOfFriends+set"></a>
### friendsOfFriends.set(property, value) ⇒ <code>Mixed</code>
Set the value of a property of `this.options`

**Kind**: instance method of <code>[FriendsOfFriends](#FriendsOfFriends)</code>  
**See**: [options](#FriendsOfFriends.options)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>String</code> | The name of the Property |
| value | <code>Mixed</code> | The new value of the property |

<a name="FriendsOfFriends.options"></a>
### FriendsOfFriends.options : <code>Object</code>
The options defined for the module instance

**Kind**: static property of <code>[FriendsOfFriends](#FriendsOfFriends)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| personModelName | <code>String</code> | The modelName of the Person Schema. Default: `'Person'` |
| friendshipModelName | <code>String</code> | The name to call the model to be compiled from the Friendship Schema. Default: `'Friendship'` |
| friendshipCollectionName | <code>String</code> &#124; <code>undefined</code> | The name to use for the Friendship Collection. Default: `undefined`. |

<a name="FriendsOfFriends.friendship"></a>
### FriendsOfFriends.friendship : <code>Model</code>
The Friendship model

**Kind**: static property of <code>[FriendsOfFriends](#FriendsOfFriends)</code>  
**See**

- [FriendshipModel](FriendshipModel)
- [moongoose models](http://mongoosejs.com/docs/models.html)

<a name="FriendsOfFriends.relationships"></a>
### FriendsOfFriends.relationships : <code>Object</code>
Relationship constants

**Kind**: static property of <code>[FriendsOfFriends](#FriendsOfFriends)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| &#x27;0&#x27; | <code>String</code> | Value: `'NOT_FRIENDS'` |
| &#x27;1&#x27; | <code>String</code> | Value: `'FRIENDS_OF_FRIENDS'` |
| &#x27;2&#x27; | <code>String</code> | Value: `'PENDING_FRIENDS'` |
| &#x27;3&#x27; | <code>String</code> | Value: `'FRIENDS'` |
| NOT_FRIENDS | <code>Number</code> | Value: `0` |
| FRIENDS_OF_FRIENDS | <code>Number</code> | Value: `1` |
| PENDING_FRIENDS | <code>Number</code> | Value: `2` |
| FRIENDS | <code>Number</code> | Value: `3` |

<a name="FriendsOfFriends.plugin"></a>
### FriendsOfFriends.plugin(schema, options)
Adds friends-of-friends functionality to an existing Schema

**Kind**: static method of <code>[FriendsOfFriends](#FriendsOfFriends)</code>  
**See**: [AccountModel](AccountModel)  

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>Schema</code> | The mongoose Schema that gets plugged |
| options | <code>Object</code> | Options passed to the plugin |

