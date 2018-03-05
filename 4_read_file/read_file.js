var SYNC = false; // true > Sync, false > Async

if (SYNC) {
  var fs = require("fs");
  var data = fs.readFileSync('test.txt');

  console.log(data.toString());
  console.log("Has run readFile.")
} else {
  var fs = require("fs");
  fs.readFile('test.txt', function (err, data) {
      if (err) return console.error(err);
      console.log(data.toString());
  });

  console.log("Has run readFile.")
}