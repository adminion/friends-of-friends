
// var debug = require('debug')('friends-of-friends:relationships');

/** @module relationships */

/**
 * a map of relationship values to their human readable names 
 * ```javascript
 * [
 *     "NOT_FRIENDS",
 *     "FRIENDS_OF_FRIENDS",
 *     "FRIENDS"
 * ];
 * ```
 * @constant
 * @type {Array} 
 */
 Object.defineProperty(module.exports, 'names', {
	enumerable: true,
	value: [
	    "NOT_FRIENDS",
	    "FRIENDS_OF_FRIENDS",
	    "FRIENDS"
	]
});

/** 
 * a map of relationship names to their respective values 
 * ```javascript
 * {
 *     NOT_FRIENDS:         0,
 *     FRIENDS_OF_FRIENDS:  1,
 *     FRIENDS:             2
 * };
 * ```
 * @constant
 * @type {Object}
 */
Object.defineProperty(module.exports, 'values', {
	enumerable: true,
	value: {
	    NOT_FRIENDS:            0,
	    FRIENDS_OF_FRIENDS:     1,
	    FRIENDS:                2
	}
});

// debug('module.exports', module.exports);
