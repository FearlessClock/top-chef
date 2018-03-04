//Project important stuff
const michelin = require("D:/Git/Wed Architecture/top-chef/michelin.js")
const lafourchette = require("D:/Git/Wed Architecture/top-chef/lafourchette.js")


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/michelinResto');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

var restoNameSchema = mongoose.Schema({
  name: String,
  zipCode: String
});

var restoName = mongoose.model('RestoName', restoNameSchema);
    
let dealSchema = mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    zipCode: String,
    distinction: String,
    deals: []
  });

let dealName = mongoose.model('dealName', dealSchema);

//Scrape the restaurent names from michelin and then the deals from lafourchette
//michelin.scrapeRestoNames(restoName)  //Should be be up to date 
// michelin.getNames(restoName).then((names) => {
//       lafourchette.loadDeals(names, dealName)
// })

const express = require("express");
const ip = "127.0.0.1";

var http = require('http');
const app = express()

var server = http.createServer(app);
app.use(express.static('public'))
server.on('listening', onListening);
server.listen(1234);

app.get('/getNames', (req, res) => {
  michelin.getNames(restoName).then((names) => {
    res.jsonp(names);
  })
})

app.get('/getDeals', (req, res) => {
  lafourchette.getDeals(dealName).then((names) => {
    res.jsonp(names);
  })
})

app.get('/LoadDeals', (req, res) => {
    michelin.getNames(restoName).then((names) => {
      lafourchette.loadDeals(names, dealName)
  })
  res.send("Loading data, check console");
})

app.get('/LoadRestaurents', (req, res) => {
  michelin.scrapeRestoNames(restoName)
  res.send("Loading data, check console");
})

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

