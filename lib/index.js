
/**
 * @author  Jeff Harris
 * @ignore
 */

var debug = require('debug')('friends-of-friends'),
    relationships = require('./relationships'),
    utils = require('techjeffharris-utils');

/**
 * FriendsOfFriends constructor - works with or without new
 * @type {Function}
 */
module.exports = FriendsOfFriends;

/**
 * Creates a new FriendsOfFriends Object
 * ```javascript
 * var options = { 
 *     accountName:             'Player',
 *     accountCollection:       'foo_userAccounts',
 *     friendshipName:          'Friend_Relationships', 
 *     friendshipCollection:    'bar_userRelationships',
 * };
 * 
 * var FriendsOfFriends = require('friends-of-friends')();
 * // or
 * var FriendsOfFriends = require('friends-of-friends');
 * var fof = new FriendsOfFriends(options);
 * ```
 * @class
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
     * @member      {Object} options - the options defined for the module instance
     * @memberOf    FriendsOfFriends
     */
    this.options = utils.extend(defaults, options);

    /**
     * @member      {Model}     friendship - The Friendship model
     * @memberOf    FriendsOfFriends
     * @see         [friendship]{@link module:friendship}
     */
    this.friendship = friendship(this.options);

    /**
     * @member      {Function} plugin   - the mongoose plugin to add friendship methods
     * @memberOf    FriendsOfFriends
     * @see         [plugin]{@link module:plugin}
     */
    this.plugin = plugin;

};

/** 
 * @member  {Object} relationships  - relationship constants
 * @memberOf    FriendsOfFriends
 * @see     [relationships]{@link module:relationships}
 */
FriendsOfFriends.prototype.relationships = relationships;

/**
 * return the value of a property of this.options
 * @param  {String} property the property to get
 */
FriendsOfFriends.prototype.get = function (property) {
    return this.options[property];
};

/**
 * set the value of a property of `this.options`
 * @param {String} property The name of the Property
 * @param value The new value of the property
 */
FriendsOfFriends.prototype.set = function (property, value) {
    return this.options[property] = value;
};
