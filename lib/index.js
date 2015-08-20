
/**
 * @author  Jeff Harris
 * @ignore
 */

var debug = require('debug')('friends-of-friends'),
    relationships = require('./relationships'),
    utils = require('techjeffharris-utils');

module.exports = FriendsOfFriends

/**
 * Create a new FriendsOfFriends Object with or without new
 * ```javascript
 * // mongoose is required
 * var mongoose = require('mongoose');
 * 
 * var FriendsOfFriends = require('friends-of-friends');
 * var fof = new FriendsOfFriends(mongoose);
 * // works with or without 'new'
 * var FriendsOfFriends = require('friends-of-friends')(mongoose);
 * ```
 * 
 * Specifying Configuration Options
 * ```javascript
 * var options = { 
 *     personModelName:             'Player',
 *     friendshipModelName:         'Friend_Relationships', 
 *     friendshipCollectionName:    'foo_bar_userRelationships',
 * };
 *  
 * var FriendsOfFriends = require('friends-of-friends');
 * var fof = new FriendsOfFriends(mongoose, options);
 * // again, works with or without 'new'
 * var FriendsOfFriends = require('friends-of-friends')(mongoose, options);
 * ```
 * @class FriendsOfFriends
 * @param {Object} mongoose - required: mongoose instance used in your application
 * @param {Object} options  - optional object containing configurable options
 */
function FriendsOfFriends(mongoose, options) {

    debug('mongoose', mongoose);
    debug('options', options);

    if (!(this instanceof FriendsOfFriends)) {
      return new FriendsOfFriends(mongoose, options);
    } 

    var friendship = require('./friendship'),
        plugin = require('./plugin');

    var defaults = { 
        personModelName:            'Person',
        friendshipModelName:        'Friendship', 
        friendshipCollectionName:   undefined,
    };

    /**
     * The options defined for the module instance
     * @member      {Object} options
     * @memberOf    FriendsOfFriends
     * @property    {String} personModelName            - The modelName of the Person Schema. Default: `'Person'`
     * @property    {String} friendshipModelName        - The name to call the model to be compiled from the Friendship Schema. Default: `'Friendship'`
     * @property    {String|undefined} friendshipCollectionName   - The name to use for the Friendship Collection. Default: `undefined`.
     */
    this.options = utils.extend(defaults, options);

    /**
     * The Friendship model 
     * @member      {Model}     friendship
     * @memberOf    FriendsOfFriends
     * @see         {@link FriendshipModel}
     * @see         [moongoose models]{@link http://mongoosejs.com/docs/models.html}
     */
    this.Friendship = friendship(mongoose, this.options);

    /**
     * Adds friends-of-friends functionality to an existing Schema
     * @function    FriendsOfFriends.plugin
     * @param       {Schema} schema     - The mongoose Schema that gets plugged
     * @param       {Object} options    - Options passed to the plugin
     * @see         {@link AccountModel}
     */
    this.plugin = plugin(mongoose);

};

/** 
 * Relationship constants
 * @constant
 * @member      {Object} relationships
 * @memberOf    FriendsOfFriends
 * @property    {String}    '0'                 - Value: `'NOT_FRIENDS'`
 * @property    {String}    '1'                 - Value: `'FRIENDS_OF_FRIENDS'`
 * @property    {String}    '2'                 - Value: `'PENDING_FRIENDS'`
 * @property    {String}    '3'                 - Value: `'FRIENDS'`
 * @property    {Number}    NOT_FRIENDS         - Value: `0`
 * @property    {Number}    FRIENDS_OF_FRIENDS  - Value: `1`
 * @property    {Number}    PENDING_FRIENDS     - Value: `2`
 * @property    {Number}    FRIENDS             - Value: `3`
 */
FriendsOfFriends.prototype.relationships = relationships;

/**
 * Return the value of a property of `this.options`
 * @param   {String} property - The property to get
 * @return  {Mixed} 
 * @see     {@link FriendsOfFriends.options}
 */
FriendsOfFriends.prototype.get = function (property) {
    return this.options[property];
};

/**
 * Set the value of a property of `this.options`
 * @param   {String}    property    - The name of the Property
 * @param   {Mixed}     value       - The new value of the property
 * @return  {Mixed}
 * @see     {@link FriendsOfFriends.options}
 */
FriendsOfFriends.prototype.set = function (property, value) {
    return this.options[property] = value;
};
