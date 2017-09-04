
var express = require('express');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var Web3 = require('web3');
var tokenTracker = require('eth-token-tracker');

var fs = require('fs');
var waitUntil = require('wait-until');

global.waitUntil = waitUntil;

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
web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/RpuGTgcQkvUn8HVGSJaz"));
global.fs = fs;
global.web3 = web3;
global.tokenTrucker = tokenTracker;

require('./routes/routes.js')(app);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});