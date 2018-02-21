var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/LaFourchetteDeals');
    
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

function loadDeals(names){
    
    let dealSchema = mongoose.Schema({
        id: Number,
        name: String,
        description: String,
        zipCode: String,
        distinction: String,
        deals: []
      });
    
      let dealName = mongoose.model('dealName', dealSchema);
    

    
    let lafourchetteAPI = "https://m.lafourchette.com/api/restaurant/"
    let url = "https://m.lafourchette.com/api/restaurant-prediction?name="
    names.forEach(element => {
        let requestedUrl = url + element;
        console.log("Search: " + requestedUrl)
        request(requestedUrl, function(error, response, json){
            if(!error){
                let objectJson = JSON.parse(json)
                let restoId = objectJson[0].id;
                console.log(objectJson[0].id)
                let dealInformation = {"id": objectJson[0].id}

                request(lafourchetteAPI+restoId, function(error, response, json){
                    if(!error){
                        let objectJson = JSON.parse(json)
                        dealInformation.name = objectJson.name;
                        dealInformation.description = objectJson.description;
                        dealInformation.zipCode = objectJson.address.postal_code;
                        dealInformation.distinction = objectJson.aggregate_rating.distinction
                        console.log(objectJson.name)
                    }
                    else{
                        console.log(error)
                    }
                })


                let saleAPI = "https://m.lafourchette.com/api/restaurant/";
                request(saleAPI + restoId+"/sale-type", function(error, response, json){
                    if(!error){
                        let objectJson = JSON.parse(json)
                        dealInformation.deals = []
                        objectJson.forEach(element => {
                            if(element.title !== "Simple booking"){
                                dealInformation.deals.push(element.title)
                            }
                        });
                        console.log(dealInformation)
                    }
                    else{
                        console.log(error)
                    }
                })

                let deal = new dealName(dealInformation);
                deal.save(function (err, product) {
                  if (err) console.log(err, product)
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