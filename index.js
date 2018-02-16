var fs      = require('fs');
var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/michelinResto');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

var names = []
var doneLoading = false
  //All the web scraping magic will happen here
function getStarredRestoNames(){
    
  let restoNameSchema = mongoose.Schema({
    name: String
  });

  let restoName = mongoose.model('RestoName', restoNameSchema);

  url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
  var options = {
    uri: url,
    transform: function (body) {
        return cheerio.load(body);
    }
  };
  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  var nmbrOfPages = 0
  rp(options).then( function($){
    // First we'll check to make sure no errors occurred when making the request
      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

    $('div.pager-wrapper div.item-list-first div.item-list .pager').filter(function(){
      nmbrOfPages = parseInt($(this).children().last().prev().children().attr('attr-page-number'))
      console.log(nmbrOfPages)
    })

    let doneCounter = 0
    let links = [];
    for (let i = 1; i < nmbrOfPages+1; i++) {
      let urlPage = url+"/page-"+i;
      links.push(urlPage);
    }
      let promises = links.map(link => {
        let option = {
          uri: link,
          transform: function (body) {
              return cheerio.load(body);
          }
        };
        return rp(option)
              .then(function($){
                  $('.poi-search-result').filter(function(){
                    let listOfRest = $(this).children()
                    listOfRest.each(function(i, elem) {
                      let title = new restoName({ name: $(this).children().attr('attr-gtm-title') });
                      title.save(function (err, product) {
                        if (err) console.log(err, product)
                      })
                    });
                  })
              })
        })
    Promise.all(promises).then(() => console.log("Done"));
    })
}

function getNames(){
  return names;
}

function areNamesLoaded(){
  return doneLoading;
}
getStarredRestoNames()
module.exports = {getStarredRestoNames, getNames, areNamesLoaded}

