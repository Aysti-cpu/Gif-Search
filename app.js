const express = require('express');
const app = express();
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');


const fs = require("fs");
const { reduce } = require('async');

// Fix cors issue
app.use(cors());


app.set('view engine', 'ejs');

// const bodyParser = require('body-parser');
// const url = require('url');
// const querystring = require('querystring');


// Serve static files
app.use(express.static('public'));


// Use body parser and return statusCode 400 if provided json is invalid
app.use((req, res, next) => {
    bodyParser.json()(req, res, (err) => {
      if (err) {
        return res.status(statusCode.BAD_REQUEST)
          .json({ statusCode: statusCode.BAD_REQUEST, errorMsg: 'Bad request' }); // Bad request
      }
      return next();
    });
  });


const fetchGifs = async (searchTerm) => {
    const urlEncoded = encodeURI(`https://api.giphy.com/v1/gifs/search?api_key=oSsbrp8cPx8GrwfC33KIesQAHAX4E3gJ&q=${searchTerm}&limit=5&offset=0&rating=G&lang=de`, {mode: 'no-cors'});
    const response = await fetch(urlEncoded);
    return response.json();
};

const addFavToJson = (url) => {
    const favs = fs.readFileSync("favs.json");
    const parsedFavs = JSON.parse(favs);
    parsedFavs.push(url);
    fs.writeFileSync("favs.json", JSON.stringify(parsedFavs), 'utf8');

    // await fs.writeFile( "favs.json", JSON.stringify(newFavs), "utf8" );

};


app.get('/', (req, res) => {
    res.render("index/index");
});

app.get('/favs', (req, res) => {
    const favs = fs.readFileSync("favs.json");
    gifs = JSON.parse(favs);
    res.render("index/favs", { gifs });
});

app.post('/search', async (req, res) => {
    const { body } = req;
    const { searchTerm } = body;
    
    if(!searchTerm)
        return res.json([]);
    
    // Fetch Gifs
    const gifs = await fetchGifs(searchTerm);
    res.json(gifs.data);
});

app.post('/fav', async (req, res) => {
    const { body } = req;
    const { url } = body;

    if(!url)
        return res.json({ response: "No gif provided" });
    
    // Save fav
    addFavToJson(url);

    return res.json({ response: "Fav saved" });
});

app.listen(8080, () => {
    console.log('Listening to PORT 8080');
});


