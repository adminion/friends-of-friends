/**
 * @module privacy
 */

/**
 * a map of privacy values to their human readable names 
 * ```javascript
 * [
 *     "ANYBODY",
 *     "FRIENDS_OF_FRIENDS", 
 *     "FRIENDS", 
 *     "NOBODY"
 * ];
 * ```
 * @constant
 * @type {Array} 
 */
exports.names = [
    "ANYBODY",
    "FRIENDS_OF_FRIENDS", 
    "FRIENDS", 
    "NOBODY"
];

/** 
 * a map of privacy names to their respective values
 * ```javascript
 * {
 *     ANYBODY:              0,
 *     FRIENDS_OF_FRIENDS:   1,
 *     FRIENDS:              2,
 *     NOBODY:               3
 * };
 * ```
 * @constant
 * @type {Object}
 */
exports.values = {
    ANYBODY:              0,
    FRIENDS_OF_FRIENDS:   1,
    FRIENDS:              2,
    NOBODY:               3
};