// server.js
// where your node app starts

// init project
var express = require('express');
var basicAuth = require('basic-auth');
var bodyParser = require("body-parser");
var uuid = require("uuid");
var app = express();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  }

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === 'another' && user.pass === 'one') {
    return next();
  } else {
    return unauthorized(res);
  }
};

app.get('/login', auth, function (req, res) {
  res.send(200, 'Authenticated');
});


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/documentation", function (request, response) {
  response.sendFile(__dirname + '/views/documentation.html');
});

app.get("/dreams", function (request, response) {
  response.send({"dreams": dreams});
});

app.get('/dreams/:id', function(request, response){
  if (!dreams[request.params.id]) {
    response.sendStatus(404);
  } else {
    response.send({"dream": dreams[request.params.id]});
  }
});

app.put('/dreams/:id', function(request, response){
  if(!request.body.dream && !request.query.dream) {
    response.sendStatus(400);
  } else if(!request.body.dream) {
    dreams[request.params.id] = request.query.dream;
    response.sendStatus(200);
  } else {
    dreams[request.params.id] = request.body.dream;
    response.sendStatus(200);
  }
});

app.delete('/dreams/:id', auth, function(request, response){
  if (!dreams[request.params.id]) {
    response.sendStatus(404);
  } else {
    delete dreams[request.params.id];
    response.sendStatus(200);
  }
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  if(!request.body.dream && !request.query.dream) {
    response.sendStatus(400);
  } else if(!request.body.dream) {
    dreams[uuid.v4()] = request.query.dream;
    response.sendStatus(201);
  } else {
    dreams[uuid.v4()] = request.body.dream;
    response.sendStatus(201);
  }
});

// Simple in-memory store for now
var dreams = {
  "90788874-10b6-45f1-a405-b4e59d01d537": "Send POST requests with Postman",
  "e8a8f784-58e3-438f-9d85-1d0cf4f57544": "Write automated tests",
  "61dab576-579f-523e-62bf-beb2b7a681ca": "Increase test coverage to 100%"
  };

//app.get('*', function(request, response){
//  response.sendStatus(404);
//});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

