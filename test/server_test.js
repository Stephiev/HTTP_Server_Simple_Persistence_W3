var chai = require("chai");
var chaiHttp = require("chai-http");
var expect = chai.expect;
var fs = require("fs");

var inputPost = '{"type": "chubby", "color": "black and tan"}';
var inputPut = '{"type": "skinny", "color": "black and tan", "age": "young"}';
var inputPatch = '{"type": "skinny", "color": "orange", "age": "young"}';

chai.use(chaiHttp);
require("../server.js");

describe("The server \n", function() {

  it("should GET a file \n", function(done) {
    fs.writeFileSync("./files/GET_Test.json", inputPost); // cant get async before block to work

    chai.request("localhost:3000")
      .get("/cat/GET_Test")
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.eql(inputPost);
        done();
      });

    after(function() {
      fs.unlink("./files/GET_Test.json");
    });
  });

  it("should fail to GET a file \n", function(done) {
     chai.request("localhost:3000")
      .get("/cat/does/not/exist")
      .end(function(err, res) {
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should POST a file \n", function(done) {
    chai.request("localhost:3000")
      .post("/cat/Kopi")
      .send(inputPost)
      .end(function(err, res) {
        fs.readFile("./files/Kopi.json", function(err, content) {
          expect(JSON.parse(content)).to.eql(JSON.parse(inputPost));
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          done();
        });
      });
  });

  it("should PUT a file", function(done) {
    chai.request("localhost:3000")
      .put("/cat/Kopi")
      .send(inputPut)
      .end(function(err, res) {
        fs.readFile("./files/Kopi.json", function(err, content) {
          expect(JSON.parse(content)).to.eql(JSON.parse(inputPut));
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          done();
        });
      });
  });

 it("should PATCH a file", function(done) {
  chai.request("localhost:3000")
    .patch("/cat/Kopi")
    .send(inputPatch)
    .end(function(err, res) {
      expect(err).to.eql(null);
      fs.readFile("./files/Kopi.json", function(err, content) {
        expect(JSON.parse(content)).to.eql(JSON.parse(inputPatch));
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
    });
  });

 it("should DELETE a file \n", function(done) {
  chai.request("localhost:3000")
    .del("/cat/Kopi")
    .end(function(err, res) {
      fs.open("./cat/Kopi.json", "r", function(err) {
        expect(err).to.not.eql(null);
        done();
      });
    });
  });
});
