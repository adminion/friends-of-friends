CHANGES
=======

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

