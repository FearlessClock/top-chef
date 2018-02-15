var fs      = require('fs');
var request = require('request');
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

  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  var nmbrOfPages = 0
  request(url, function(error, response, html){
    // First we'll check to make sure no errors occurred when making the request

    if(!error){
      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

      var $ = cheerio.load(html);
      $('div.pager-wrapper div.item-list-first div.item-list .pager').filter(function(){
        nmbrOfPages = $(this).children().last().prev().children().attr('attr-page-number')
      })
      $('.poi-search-result').filter(function(){
        let listOfRest = $(this).children()
        let count = 0
        listOfRest.each(function(i, elem) {
            let title = new restoName({ name: $(this).children().attr('attr-gtm-title') });
            title.save(function (err, product) {
              if (err) console.log(err, product)
            })
          });

    })
    let doneCounter = 0
    for (let i = 2; i < nmbrOfPages-20; i++) {
      let urlPage = url+"/page-"+i;
      request(urlPage, function(error, response, html){
        var $ = cheerio.load(html)

        $('.poi-search-result').filter(function(){
          let listOfRest = $(this).children()
          let count = 0
          listOfRest.each(function(i, elem) {
            let title = new restoName({ name: $(this).children().attr('attr-gtm-title') });
            title.save(function (err, product) {
              if (err) console.log(err, product)
            })
            });
          doneCounter++;
      })
      })
    }
    let inter = setInterval(function(){
      console.log(doneCounter)
      if(doneCounter == nmbrOfPages-21)
      {
        doneLoading = true
        clearInterval(inter)
      }
    }, 1000)
  }
  })
}

function getNames(){
  return names;
}

function areNamesLoaded(){
  return doneLoading;
}
module.exports = {getStarredRestoNames, getNames, areNamesLoaded}

