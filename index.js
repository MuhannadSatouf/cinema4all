//for webserver to be created
const path = require('path')
const betterSqlite3 = require('better-sqlite3');
const db = betterSqlite3('./database/cinema_booking.db3');
const express = require("express");


//create a webserver using express
const app = express();
app.use(express.json())
//serve all the files in the frontend folder
app.use(express.static("frontend"));
//start the webserver on port 3000
app.listen(process.env.PORT || 3000, () =>
  console.log("//http:localhost:3000"));


const login = require('./login.js')

login(app, db)

const api = require("./rest-api");


app.all('/partials/*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'frontend', 'partials', 'index.html'));
});

api(app, db)




