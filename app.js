const michelin = require("D:/Git/Wed Architecture/top-chef/index.js")
const lafourchette = require("D:/Git/Wed Architecture/top-chef/lafourchette.js")

//michelin.scrapeRestoNames()  //Should be be up to date 
michelin.getNames().then((names) => {
      lafourchette.loadDeals(names)
})