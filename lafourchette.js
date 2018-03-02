var fs      = require('fs');
var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');

function getCorrectResto(objectJson, restaurant){
    let restoId = undefined;
    return new Promise((resolve, reject) =>{
        if(objectJson.length > 1){
            for(i = 0; i < objectJson.length; i++){
                if(objectJson[i].address.postal_code === restaurant.zipCode){
                    return resolve(objectJson[i].id);
                }
            }
        }
        else{
            return resolve(objectJson[0].id);
        }
    });
}

function loadDeals(restos, dealName){
    let lafourchetteAPI = "https://m.lafourchette.com/api/restaurant/"
    let url = "https://m.lafourchette.com/api/restaurant-prediction?name="

    // Stat data
    var statData = {}
    statData.NmbrOfErrors = 0
    statData.NmbrOfGoodDeals = 0
    statData.NmbrOfSkippedRestos = 0
    statData.NmbrOfNoDeals = 0
    
    console.log("Nmbr of restos: " + restos.length);
    let promises = restos.map(restaurant => {
        let requestedUrl = url + restaurant.name.replace(/ /g, "+").eraseAccent();
        
        var options = {
            url: requestedUrl
        };
        return new Promise((resolve, reject) => rp(options)
            .then((json) => {
                let objectJson = JSON.parse(json)
                if(objectJson.length > 0){

                    getCorrectResto(objectJson, restaurant)
                        .then(res => {
                            let restoId = res;
                            let dealInformation = {"id": restoId}
                            let firstPromise = new Promise((resolve, reject) => rp({url: lafourchetteAPI+restoId}).then((json) => {
                                    let objectJson = JSON.parse(json)
                                    dealInformation.name = objectJson.name;
                                    dealInformation.description = objectJson.description;
                                    dealInformation.zipCode = objectJson.address.postal_code;
                                    dealInformation.distinction = objectJson.aggregate_rating.distinction
                                    return resolve()
                            }).catch((error) => {statData.NmbrOfErrors++;}));


                            let saleAPI = "https://m.lafourchette.com/api/restaurant/";
                            let secondPromise = new Promise((resolve, reject) => rp({url: saleAPI + restoId+"/sale-type"}).then((json) => {
                                    let objectJson = JSON.parse(json)
                                    dealInformation.deals = []
                                    let promises = objectJson.map(element => {
                                        return new Promise((res, reject) => {
                                            if(element.title !== "Simple booking"){
                                                dealInformation.deals.push(element.title)
                                            }
                                            return res();
                                        });
                                    });
                                    Promise.all(promises).then(()=>{return resolve()})

                            }).catch((error) => {statData.NmbrOfErrors++; console.log("Error! " + restaurant.name + " " + error)}));

                            Promise.all([firstPromise, secondPromise]).then(() => {
                                if(dealInformation.deals.length > 0){
                                    console.log(dealInformation)
                                    console.log(statData)
                                    statData.NmbrOfGoodDeals++;
                                    let deal = new dealName(dealInformation);
                                    deal.save(function (err, product) {
                                    if (err) console.log(err, product)
                                    })
                                }
                                else{
                                    statData.NmbrOfNoDeals++;
                                }
                            })
                })
            }else{
                statData.NmbrOfSkippedRestos++;
                console.log("Skipped: " + restaurant.name);
                console.log(statData)
            }
        }).catch((error) => {statData.NmbrOfErrors++; console.log("Error! " + restaurant.name + " " + error)}));
    });
    Promise.all(promises).then((res) => {
        console.log(statData);
    })
}

async function getDeals(dealName){
    let deals = await new Promise((resolve, reject) => {
        dealName.find({}).exec(function (err, deals) {
        if (err) return handleError(err);
          resolve(deals)
      })
    })
    return deals
}


String.prototype.eraseAccent = function(){
    const accents = [
        "\306","\346",                  //AE, ae
        /[\300-\305]/g, /[\340-\345]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    const noaccent = ["AE","ae",'A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
     
    let str = this;
  
    for(var i = 0; i < accents.length; i++){
        str = str.replace(accents[i], noaccent[i]);
    }
    return str;
  }

module.exports = {loadDeals, getDeals}