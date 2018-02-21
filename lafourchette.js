var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

function loadDeals(names){
    let lafourchetteURL = "https://www.lafourchette.com"
    let url = "https://www.lafourchette.com/search-refine/"
    names.forEach(element => {
        let requestedUrl = url + element;
        request(requestedUrl, function(error, response, html){
            if(!error){
                let $ = cheerio.load(html)
                let link = $('div#results.resultContainer ul.list-unstyled li.resultItem a').attr('href')
                console.log(lafourchetteURL+link)
                request(lafourchetteURL+link, function(error, response, page){
                    if(!error){
                        let $$ = cheerio.load(page)
                        let link = $$('div#ocSaleTypeList.restaurantTabContent-section section.saleTypes.restaurantTabContent-section div.saleType.saleType--specialOffer').children().length;
                        console.log(link)
                    }
                    else{
                        console.log(error)
                    }
                })
            }
            else{
                console.log(error)
            }
        })
    });
}

function getDeals(){


}

module.exports = {loadDeals, getDeals}