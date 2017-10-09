
try {
    var env = require('dotenv');
    env = env.config();
} catch (ex) {
    console.log('couldnt load environment vars');
}

var express = require('express');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var Web3 = require('web3');
var request = require('request');
var requestPromise = require('request-promise');

var fs = require('fs');
var waitUntil = require('wait-until');

// Load jsdom, and create a window.
var app = express();

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: true}));
//include the public folder
app.use(express.static('public'));

app.use(session({
  cookieName: 'session',
  secret: 'blahblah',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

//set a global variable so you can call on it
//web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/RpuGTgcQkvUn8HVGSJaz"));
web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/"+process.env.INFURA_KEY));
global.fs = fs;
global.web3 = web3;
global.request = request;
global.requestPromise = requestPromise;
global.waitUntil = waitUntil;


require('./routes/routes.js')(app);

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});