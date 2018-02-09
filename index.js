var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

  //All the web scraping magic will happen here

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
    var names = []
    $('.poi-search-result').filter(function(){
      let listOfRest = $(this).children()
      let count = 0
      listOfRest.each(function(i, elem) {
          let title = $(this).children().attr('attr-gtm-title')
          names.push(title)
        });

  })
  let doneCounter = 0
  for (let i = 1; i < nmbrOfPages; i++) {
    let urlPage = url+"/page-"+i;
    console.log(urlPage)
    request(urlPage, function(error, response, html){
      var $ = cheerio.load(html)
        $('.poi-search-result').filter(function(){
        let listOfRest = $(this).children()
        let count = 0
        listOfRest.each(function(i, elem) {
            let title = $(this).children().attr('attr-gtm-title')
            names.push(title)
          });
      doneCounter++;
    })
    })
  }
  setInterval(function(){
    console.log(names.length)
    if(doneCounter == nmbrOfPages-1)
    {
      console.log("Launch the lafourchette code")
    }
  }, 1000)
}
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;