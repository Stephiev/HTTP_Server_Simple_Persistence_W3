var http =  require("http");
var router = require("./lib/router.js");
var routes = {};
routes.cat = router;

var server = http.createServer(function(req, res) {
  var path = req.url.split("/");
  var root = path[1];

  if (typeof routes[root] === "function") {
    routes[root](req, res);
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json"
    });

    res.write(JSON.stringify({ msg: "404: Not Found" }));
    res.end();
  }
}).listen(3000, function() {
  console.log("Server started at port 3000.");
});
