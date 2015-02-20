
/**
 * @author  Jeff Harris
 * @ignore
 */

var debug = require('debug')('friends-of-friends'),
    relationships = require('./relationships'),
    utils = require('techjeffharris-utils');

module.exports = FriendsOfFriends

/**
 * Creates a new FriendsOfFriends Object with or without new
 * ```javascript
 * 
 * var FriendsOfFriends = require('friends-of-friends');
 * var fof = new FriendsOfFriends();
 * // works with or without 'new'
 * var FriendsOfFriends = require('friends-of-friends')();
 * ```
 * 
 *  Default Configuration 
 * ```javascript
 * var defaults = {
 *     // define the name for your Users model.
 *     accountName: 'Account',
 *     // define the name of the Users colletion. 
 *     accountCollection: undefined,
 *     // define the name for the Friendship model
 *     friendshipName: 'Friendship',
 *     // define the name of the Friendship collection.
 *     friendshipCollection: undefined
 * }
 * ```
 * 
 *  Specifying Configuration Options
 * ```javascript
 * 
 * var options = { 
 *      accountName:             'Player',
 *      accountCollection:       'foo_userAccounts',
 *      friendshipName:          'Friend_Relationships', 
 *      friendshipCollection:    'bar_userRelationships',
 *  };
 *  
 * var FriendsOfFriends = require('friends-of-friends');
 * var fof = new FriendsOfFriends(options);
 * // again, works with or without 'new'
 * var FriendsOfFriends = require('friends-of-friends')(options);
 * ```
 * @class FriendsOfFriends
 * @param {Object} options - optional object containing configurable options
 */
function FriendsOfFriends(options) {

    debug('options', options)

    if (!(this instanceof FriendsOfFriends)) {
      return new FriendsOfFriends(options);
    } 

    var friendship = require('./friendship'),
        plugin = require('./plugin');

    var defaults = {
        accountName:    'Account',
        friendshipName: 'Friendship',
    };

    /**
     * The options defined for the module instance
     * @member      {Object} options
     * @memberOf    FriendsOfFriends
     * @property    {String} accountName            - The name to call the model to be compiled from the Account Schema. Default: `'Account'`
     * @property    {String} accountCollection      - The name to use for the Account Collection. Default: `undefined`.
     * @property    {String} friendshipName         - The name to call the model to be compiled from the Friendship Schema. Default: `'Friendship'`
     * @property    {String} friendshipCollection   - The name to use for the Account Collection. Default: `undefined`.
     */
    this.options = utils.extend(defaults, options);

    /**
     * The Friendship model 
     * @member      {Model}     friendship
     * @memberOf    FriendsOfFriends
     * @see         {@link FriendshipModel}
     * @see         [moongoose models]{@link http://mongoosejs.com/docs/models.html}
     */
    this.friendship = friendship(this.options);

    /**
     * Adds friends-of-friends functionality to an existing Schema
     * @function    FriendsOfFriends.plugin
     * @param       {Schema} schema     - The mongoose Schema that gets plugged
     * @param       {Object} options    - Options passed to the plugin
     * @see         {@link AccountModel}
     */
    this.plugin = plugin;

};

/** 
 * Relationship constants
 * @constant
 * @member      {Object} relationships
 * @memberOf    FriendsOfFriends
 * @property    {String}    '0'                 - Value: `'NOT_FRIENDS'`
 * @property    {String}    '1'                 - Value: `'FRIENDS_OF_FRIENDS'`
 * @property    {String}    '1.5'               - Value: `'PENDING_FRIENDS'`
 * @property    {String}    '2'                 - Value: `'FRIENDS'`
 * @property    {Number}    NOT_FRIENDS         - Value: `0`
 * @property    {Number}    FRIENDS_OF_FRIENDS  - Value: `1`
 * @property    {Number}    PENDING_FRIENDS     - Value: `1.5`
 * @property    {Number}    FRIENDS             - Value: `2`
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
