CHANGES
=======

# v3.x

## 2015-09-03, v3.1.1, @techjeffharris
* [[`c6e0d9c268`](https://github.com/adminion/friends-of-friends/commit/c6e0d9c268)] - removing experimental friends reference path (Jeff Harris) 

## 2015-09-03, v3.1.0, @techjeffharris
* [[`26344898e5`](https://github.com/adminion/friends-of-friends/commit/26344898e5)] - give PersonModel static access to Friendship model (Jeff Harris) 

## v3.0.2
* [[`c4d89f61b4`](https://github.com/adminion/friends-of-friends/commit/c4d89f61b4)] - updated coverage report for v3.0.2 (Jeff Harris) 
* [[`ab78d04ec9`](https://github.com/adminion/friends-of-friends/commit/ab78d04ec9)] - generating new docs to fix #39 (Jeff Harris) 

## v3.0.1
* [[`10b43550b9`](https://github.com/adminion/friends-of-friends/commit/10b43550b9)] - updated CHANGES.md with current proposed changes (Jeff Harris) 
* [[`afb445fa25`](https://github.com/adminion/friends-of-friends/commit/afb445fa25)] - findParams.projection now properly handles strings (Jeff Harris) 
* [[`dcf5ad8378`](https://github.com/adminion/friends-of-friends/commit/dcf5ad8378)] - fix package.json LICENSE, add npm badge to README.md (Jeff Harris) 
* [[`052f159b1d`](https://github.com/adminion/friends-of-friends/commit/052f159b1d)] - i really don't care what you name your branch (Jeff Harris) 
* [[`c4cf88198e`](https://github.com/adminion/friends-of-friends/commit/c4cf88198e)] - fixes #37 (Jeff Harris) 
* [[`ccdae8f529`](https://github.com/adminion/friends-of-friends/commit/ccdae8f529)] - **doc**: fix erroneous (v1.x) documentation or relationship (Jeff Harris) 
* [[`d71e7fea09`](https://github.com/adminion/friends-of-friends/commit/d71e7fea09)] - **doc**: another small change to README.md (Jeff Harris) 
* [[`4da1424697`](https://github.com/adminion/friends-of-friends/commit/4da1424697)] - **doc**: a few minor changes to README.md (Jeff Harris) 

## v3.0.0
* set default `friendshipCollectionName` to `undefined`. fixes #33
* Fixed: PersonModel.getNonFriends() missing from API docs #34

# v2.x

## v2.0.1
* Documentation was incomplete for v2.0.0, this fixed that.

## v2.0.0

### Major
* `getNonFriends` now includes `pendingFriends` and `friendsOfFriends`.  fixes #32
* Changed `AccountModel` and `AccountDocument` to `PersonModel` and `PersonDocument`, respectively. fixes #31
* Updated `FriendsOfFriends.options` property names and default values. fixes #30
*  `FriendsOfFriends.prototype.relationships` now uses sequential integers instead of `PENDING_FRIENDS` being `1.5`. fixes #29
*  `FriendsOfFriends.friendship` is now `FriendsOfFriends.Friendship` to properly signify that it is a constructor. fixes #28.
*  `FriendsOfFriends` constructor now requires `mongoose` parameter. fixes #27.
*  Bumped Mongoose to 4.x. fixes #26

## Minor
* Updated `getFriends`, `getFriendsOfFriends`, `getPendingFriends`, and `getNonFriends` on `PersonModel` and `PersonDocument` to accept optional parameter `findParams` with `conditions`, `projection`, and `options` properties in order to fine-tune queries. fixes #25. see [`model.find()`](http://mongoosejs.com/docs/api.html#model_Model.find)

# v1.x

## v1.4.1
* Removed (outdated) API docs from README.md
* API documentation now available in `doc/`
* Test Coverage data now available in `coverage/`
* Updated LICENSE copyright year

## v1.4.0
* added `cancelRequest()` to `FriendshipModel`, `AccountModel`, and `AccountDocument`

## v1.3.1
* updated `AccountModel.getNonFriends` to filter for pending Friends

## v1.3.0
* added `getPendingFriends()` to `FriendshipDocument`, `AccountModel`, and `AccountDocument`
* added travis-ci build support for node v0.12 and iojs latest
* removed travis-ci build support for node v0.11

## v1.2.0
* `Friendship.getRelationship` now checks for `PENDING_FRIENDS`.
* Added `arePendingFriends` and `isPendingFriend `to Model and Document Classes
* updated tests for above additions
* `acceptRequest` and `denyRequest` now accept two accounts `_ids` in either order instead of requester then requested
* added `isRequester` and `isRequested` to `AccountModel` and `AccountDocument`

## v1.1.0
* `lib/relationships.js` now includes relationship state `PENDING_FRIENDS` with value `1.5` for backward compatibility

## v1.0.4 
* Added/fixed examples in README.md
* Added/fixed API links
* Added npm script `coverage` to generate html coverage info
* Improved coverage in `lib/friendship.js`

## v1.0.3
* REALLY fixes #24 this time, I promise!

## v1.0.2 

* Fixed #24 - generate_docs.sh error
* Fixed typo in README.md

## v1.0.1

* Created this file, CHANGES.md
* Updated README.md
* `Friendship.getFriendship` was only finding those with status `'Accepted'`. Now finds those with status `'Pending'` as well.
* implemented `async` module to improve test performance and coverage
* fixed jsdoc comments to improve html and markdown API generated
* using jsdoc2md instead of jsdox for markdown API
* removed docs from repo and added `docs` to `.gitignore`
* created "docs" npm script to generate html and markdown APIs in `docs/`
* fixed bad version in package.json 

## v1.0.0

* All functions covered by tests, 97% coverage.

