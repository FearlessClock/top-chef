const michelin = require("D:/Git/Wed Architecture/top-chef/index.js")

michelin.getStarredRestoNames()
while(!michelin.areNamesLoaded()){}
console.log(michelin.getNames())