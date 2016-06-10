var supertest = require("supertest");
var should = require("should");
// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://nodejsdiplom-openshdiplom.rhcloud.com/");


// UNIT test begin
var boundary = Math.random();
var filename = "test.png";
describe("SAMPLE unit test",function(){


  it("correct request",function(done){
    server
    .post('/enter')
    .send({idphone : "testMOcha", fsm : 20, id :"21423", friendsId: ["first", "sec", "third" ], type : "vk"})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('1');
	res.status.should.equal(200);
      done();
    });
  });

  it("correct request", function(done){
    server
    .post('/enter')
    .send({idphone : "testMochaid", fsm : 20, id :"21423", friendsId: ["first", "sec", "third" ], type : "vk"})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('1');
	res.status.should.equal(200);
      done();
    });
  });


  it("START_GAME VALID ",function(done){
   
    server
    .post('/startgame')
   .field('idphone', 'testMochaid')
   .field('word', 'MochaTestWord')
   .attach('file', 'test.png')
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('1');
	res.status.should.equal(200);
      done();
    });
  });
  it("START_GAME NOT VALID ",function(done){
   
    server
    .post('/startgame')
   .field('idphone', 'mochaIDPhone')
   .field('word', 'MochaTestWord')
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('0');
	res.status.should.equal(200);
      done();
    });
  });
  it("START_GAME NOT VALID NOT  Word ",function(done){
   
    server
    .post('/startgame')
   .field('idphone', 'mochaIDPhone')
   .attach('file', 'test.png') 
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('0');
	res.status.should.equal(200);
      done();
    });
  });
  it("START_GAME NOT VALID NOT Id phone ",function(done){
   
    server
    .post('/startgame')
   .field('word', 'mWorde')
   .attach('file', 'test.png') 
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('0');
	res.status.should.equal(200);
      done();
    });
  });
  it("START_GAME INVALID idphone",function(done){
   
    server
    .post('/startgame')
   .field('idphone', 'testUnknownIdPhone')
   .field('word', 'MochaTestWord')
   .attach('file', 'test.png')
    .end(function(err,res){
 //	console.dir(res.body.data[0].user.vk);
        res.body.code.should.equal('0');
	res.status.should.equal(200);
      done();
    });
   });
 });
require("./socketio"); 
