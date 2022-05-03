/**
 * Your task is to write a function that uses a deep learning
 * algorithm to determine the common set of concepts between
 * multiple github profile pictures
 *
 * Given an array of github handles, searchCommonConceptsFromGitHubProfiles should:
 *   1) get the public profile associated with each handle
 *   2) extract the avatar_url of each profile
 *   4) get the set of concepts for each avatar_url (requires API key)
 *   5) find the intersection of the concepts
 *
 * Much of the heavy lifting has been done already in `lib/advancedChainingHelpers`,
 * you just have to wire everything up together! Once you pass this one, you'll
 * be a promise chaining master! Have fun!
 */

var Promise = require('bluebird');
var request = require('needle');
var lib = require('../../lib/advancedChainingLib');

var getGitHubAvatar = function (user) {
  var url = 'https://api.github.com/users/' + user;
  var options = {
    headers: { 'User-Agent': 'request' },
  };

  return new Promise(function (resolve, reject) {
    request.get(url, options, function (err, res, body) {
      if (err) {
        return reject(err);
      }

      var simpleProfile = {
        handle: body.login,
        name: body.name,
        avatarUrl: body.avatar_url + '.jpg', // extension necessary for image tagger
      };
      resolve(simpleProfile.avatarUrl);
    });
  });
};


// We're using Clarifai's API to recognize concepts in an image into a list of concepts
// Visit the following url to sign up for a free account
//     https://portal.clarifai.com/signup
// Once you're in, create a new application on your Clarifai User Dashboard. Clarifai will
// automatically generate an API key which you can find by opening up the new
// application tile.  Accept the default 'all scopes' setting for the key or modify it
// to give it the `Predict on Public and Custom Models` scope. When your key
// is ready, copy and add it to the `advancedChainingLib.js` file.

var searchCommonConceptsFromGitHubProfiles = function (githubHandles) {

  let promArr = [];
  githubHandles.forEach(handle => {
    promArr.push(getGitHubAvatar(handle));
  });
  return Promise.all(promArr)
    .then(urls => {
      let promArr2 = [];
      urls.forEach(url => {
        promArr2.push(lib.predictImage(url));
      });
      return Promise.all(promArr2);
    })
    .then(lib.getIntersection)
    .catch(err => {
      throw err;
    });

};

// Export these functions so we can unit test them
module.exports = {
  searchCommonConceptsFromGitHubProfiles,
};
