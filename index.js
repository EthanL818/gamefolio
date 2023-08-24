import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// authorization variables for API
const CLIENT_ID = "2ufvpnnvsjit50apeq7yeb5u2cwjab";
const TOKEN = "oswsbnvgem4a5d0vd6b8yzplhfr8vx"
const API_URL = "https://api.igdb.com/v4/";

// variable to store current game and array for all games
let currentGame = "";
var gamesList = [];

// include stylesheet
app.use(express.static("public"));  

// initial get method to render page
app.get("/", async (req, res) => {
    res.render ("index.ejs", {content: gamesList});
});

// post method triggered on item add
app.post("/", async (req, res) => {

    try {

        // fields configured to retrieve game id, name, rating, summary, genres, and cover img url from user input
        let data = `fields id,name,rating,summary,cover.url,genres.name,release_dates.date; where name ~ "${req.body["new-game"]}" & rating != null; sort popularity desc; limit 10;`;

        // config for post method 
        let config = {
          method: 'post',
          url: `${API_URL}games/`,
          headers: { 
            'Client-ID': CLIENT_ID, 
            'Authorization': `Bearer ${TOKEN}`, 
          },
          data:data
        };
        
        // request from IGDB server for game information
        axios.request(config)
        .then((response) => {

          var responseString = JSON.stringify(response.data); // converts JSON response to readable string format

          if (responseString != "[]" && req.body["new-game"].length != 0) { // if the JSON returned is not an empty object, continue.

            currentGame = JSON.parse(responseString)[0]; // sets current game to parsed version of responseString
            gamesList.push(currentGame); //pushes the current game into the games list array
          }

          res.redirect("/"); // redirects to get method
        })
    }
    
    catch (error) {
         console.log(error);
    }
});

app.post('/deleteItem', async(req, res) => {
  console.log('Request Body:', req.body)
  const itemId = req.body.id;

  gamesList.splice(itemId, 1);
  res.redirect("/"); // redirects to get method
});

app.listen(port, () => {
    console.log(`Live on port ${port}.`);
});

