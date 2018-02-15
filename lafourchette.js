var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

function loadDeals(names){
    let url = "https://www.lafourchette.com/search-refine/"
    names.forEach(element => {
        let requestedUrl = url + element;
        request(requestedUrl, function(error, response, html){
            if(!error){
                let $ = cheerio.load(html)

                console.log($('div#results.resultContainer ul.list-unstyled li.resultItem a').attr('href'))
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