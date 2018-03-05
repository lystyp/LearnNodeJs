var showPage = require("./handlePathName");
 
function route(res, pathname, postData) {

 
  var handle = {}
  handle["/"] = showPage.home;
  handle["/blog"] = showPage.blog;
  handle["/user"] = showPage.user;
 
  if (typeof handle[pathname] === 'function') {
    var s = handle[pathname](res);
    return s;
  } else {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("404 Not Found " + pathname);
  }
}
 
exports.route = route;