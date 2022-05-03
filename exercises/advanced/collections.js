/**
 * Using Promise.all, write a function, combineFirstLineOfManyFiles, that:
 *    1. Reads each file at the path in the `filePaths` array
 *    2. Plucks the first line of each file
 *    3. Joins each first line into a new file
 *      - The lines should be in the same order with respect to the input array
 *      - i.e. the second line in the new file should be the first line of `filePaths[1]`
 *    4. Writes the new file to the file located at `writePath`
 */


var Promise = require('bluebird');
var fs = require('fs');
var writeFile = Promise.promisify(fs.writeFile);
var promiseConstructor = require('./../bare_minimum/promiseConstructor.js');
var pluckFirstLineFromFileAsync = promiseConstructor.pluckFirstLineFromFileAsync;

var combineFirstLineOfManyFiles = function(filePaths, writePath) {
  // TODO
  let promiseArr = [];
  filePaths.forEach((filePath) => {
    promiseArr.push(pluckFirstLineFromFileAsync(filePath));
  });

  return Promise.all(promiseArr)
    .then((lines) => {
      writeFile(writePath, lines.join('\n'));
    })
    .catch((err) => {
      throw err;
    });
};

// Export these functions so we can unit test them
module.exports = {
  combineFirstLineOfManyFiles: combineFirstLineOfManyFiles
};