const michelin = require("D:/Git/Wed Architecture/top-chef/index.js")
const lafourchette = require("D:/Git/Wed Architecture/top-chef/lafourchette.js")


let isLoaded = false;
const checkIfNamesAreLoaded = () =>{
    console.log("Names check");
    isLoaded = michelin.areNamesLoaded();
    if(isLoaded){
        clearInterval(interval);
        lafourchette.loadDeals([michelin.getNames()[0]])
    }
}

//michelin.getStarredRestoNames()
// let interval = setInterval(checkIfNamesAreLoaded, 1000)
lafourchette.loadDeals(['1920'])