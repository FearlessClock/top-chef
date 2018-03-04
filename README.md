# Top chef

**Running the web application**
To start the web application, all you have to do is run:<br>
Yarn install <br>
Then you have to run RunMe.bat with the command line parameters
"Path to MongoDB\bin" and "Path to data folder".
The bat file will launch the Mongodb server,
the Node.js server and the live-server for React.
For example, on my PC, the command was
'RunMe.bat D:\MongoDB\bin "D:\Git\Wed Architecture\top-chef\data"'

The server is running a MongoDB server to store all the information
such as restaurant names and Deals. A Node server with express serves up
the information via an API to the React web page.

The scraping is done using Cheerio for the Michelin site and for
the lafourchette site, we are using the mobile API provided by lafourchette.

To load the Restaurants. Go to the path /LoadRestaurents
To load the deals. Go to the path /LoadDeals