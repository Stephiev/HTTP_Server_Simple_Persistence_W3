var fs = require("fs");

module.exports = function(req, res) {

  var path = req.url.split("/");
  var fileName = path[path.length - 1];
  var pathToFile = "./files/" + fileName + ".json";

if (req.method === "GET" ) { // Read the file requested

  fs.readFile(pathToFile, function(err, data) {
  if (err) {
        res.writeHead(404);
        console.log("Could not serve the file at " + pathToFile + ". File does not exist." + "\n");

      } else {
        res.writeHead(200, {
              "Content-Type": "application/json"
        });

        console.log("Successful GET request to " + pathToFile + "\n");
        res.write(data);
      }
      res.end();
});
} else if (req.method === "POST") { // Creates a new instance
    fs.open(pathToFile, "wx", function(err) {
      if (err) {
        console.log("A POST to an existing file ("  + pathToFile + ") is not permitted."  + "\n");
        res.writeHead(405);
        res.end();

      } else {
        console.log("Successful POST request to " + pathToFile + "\n"); //200
        var body = " ";
        req.on("data", function(data) {
          body += data.toString("utf-8");
        });
        req.on("end", function() {
          fs.writeFile(pathToFile, body, function(err) {
            res.writeHead(err ? 405 : 200);
            res.end();
          });
        });
        res.end();
      }
    });
} else if (req.method === "PUT") { // Overwrites an already existing file, don't need fs.open
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    req.on("data", function(data) {
      body = data.toString("utf-8");
    });
    req.on("end", function() {
      console.log("Successful PUT request to " + pathToFile + "\n");
      fs.writeFile(pathToFile, body, function(err) {
        res.writeHead(err ? 404 : 200);
        res.end();
      });
    });
} else if (req.method === "DELETE") {
    fs.unlink(pathToFile, function(err) {
      console.log("Successful DELETE of " + pathToFile + "\n");
      res.writeHead(err ? 404 : 200);
      res.end();
    });
} else if (req.method === "PATCH") {
    fs.open(pathToFile, "r+", function(err) {  //  Open file for reading and writing. An exception occurs if the file does not exist.
      if (err) {
        console.log("Failed PATCH to " + pathToFile + ". File does not exist." + "\n");
        res.writeHead(404);
        res.end();
      } else {
        console.log("Successful PATCH to " + pathToFile + "\n");
        req.on("data", function(data) {
          input = data.toString("utf8");
          input = JSON.parse(input);
        });
        fs.readFile(pathToFile, function(err, content) {
          if (err) {
            res.writeHead(404);
            res.end();
          } else {
            inFile = content.toString("utf8");
            inFile = JSON.parse(inFile);

            // Replace the key/value pairs in the file with those inputed.
            // Should not use this, should not interate over an object.
            // Should iterate over an array but ran out of time.
            for (var key in input) {
              inFile[key] = input[key];
            }
          }

          inFile = JSON.stringify(inFile);

          fs.writeFile(pathToFile, inFile, function(err) {
            res.writeHead(err ? 404 : 200);
            res.end();
          });
        });
      }
    });
  }
};
