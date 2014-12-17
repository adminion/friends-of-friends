
/**
 * @author  Jeff Harris
 * @ignore
 */

var debug = require('debug')('friends-of-friends');
    friendship = require('./friendship'),
    plugin = require('./plugin'),
    privacy = require('./privacy'),
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
 *     privacyDefault:          2 // privacy.values.FRIENDS
 * };
 * 
 * var FriendsOfFriends = require('friends-of-friends')();
 * // or
 * var FriendsOfFriends = require('friends-of-friends');
 * var fof = new FriendsOfFriends(options);
 * ```
 * @constructor
 * @param {Object} options - optional object containing configurable options
 */
function FriendsOfFriends(options) {

    if (!(this instanceof FriendsOfFriends)) {
      return new FriendsOfFriends(options);
    } 

    /**
     * defines default configuration options
     * @type {Object} 
     * @property {String} modelName         - the name of the account model; default: 'Account'
     * @property {Number} privacyDefault    - the default privacy value; default: 0.
     */
    var defaults = {
        accountName:    'Account',
        friendshipName: 'Friendship', 
        privacyDefault: privacy.values.NOBODY
    };

    this.options = utils.extend(defaults, options);

    /**
     * The Friendship model
     * @type {Object}
     * @see  [friendship]{@link module:friendship}
     */
    this.friendship = friendship(this.options);

    /**
     * mongoose plugin
     * @type {Function}
     * @see  [plugin]{@link module:plugin}
     */
    this.plugin = plugin;

    debug('this.friendship', this.friendship);

};

/** 
 * privacy constants 
 * @type {Array}
 * @see  [privacy]{@link module:privacy}
 */
FriendsOfFriends.prototype.privacy = privacy;

/** 
 * relationship constants
 * @type {Object}
 * @see  [relationships]{@link module:relationships}
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
