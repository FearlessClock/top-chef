var fs      = require('fs');
var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');

var names = []
var doneLoading = false
  //All the web scraping magic will happen here
function scrapeRestoNames(restoName){
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
        
        return new Promise((resolve, reject) => rp(option)
              .then(function($){
                  $('.poi-search-result').filter(function(){
                    let listOfRest = $(this).children()
                    let addresses = []
                    listOfRest.each(function(i, elem) {
                      let addressURL = $(this).children().children().attr('href');
                      addresses.push("https://restaurant.michelin.fr/" + addressURL);
                    });
                    return resolve(addresses);
                  })
              })
      )}
    );

    Promise.all(promises).then((result) => {
      result.forEach(element => {

          let promises = element.map((value) => {
            let option = {
              uri: value,
              transform: function (body) {
                  return cheerio.load(body);
              }
            };

            return new Promise((resolve, reject) => rp(option)
              .then(function($){
                let title = new restoName({ name: $("div.panel-pane-inside ol.restaurant_base-breadcrumbs-list").children().last().children().text(), 
                                            zipCode: $("span.postal-code").html() });
                console.log(title)
                title.save(function (err, product) {
                  if (err) console.log(err, product)
                })
                return resolve();
              })
            )
          })
          Promise.all(promises).then((results) => console.log("Done"));
      });
    });
    
    })
}

async function getNames(restoName){
  let restos = await new Promise((resolve, reject) => {
      restoName.find({}).exec(function (err, restos) {
      if (err) return handleError(err);
        resolve(restos)
    })
  })
  return restos
  // then((results) => {
  //   console.log("index.js: " + results)
  //   return results});
}

module.exports = {scrapeRestoNames, getNames}

