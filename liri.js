// At the top of the liri.js file, add code to read and set any environment variables with the dotenv package:
require("dotenv").config();

var http = require("http");

// Load the fs package to read and write
var fs = require("fs");
// Loading Axios
var axios = require("axios");
// Loading Moment.js
var moment = require('moment');
var Spotify = require('node-spotify-api');
// Add the code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");
// You should then be able to access your keys information
var spotify = new Spotify(keys.spotify);

const prompt = process.argv[2];
let searchType = prompt;
process.argv.splice(0, 3);
// Using LET since search term might be blank, in which case can be null instead of a string.
let searchTerm = process.argv.join(' ');
// Search term as multiple word strings, found advice on Stack Overflow:
// https://stackoverflow.com/questions/37189537/how-do-you-pass-a-string-as-an-argument-to-node-from-the-command-line

// TA recommended put this in a function in order to pass it around.
// Make it so liri.js can take in one of the following commands:
function path() {
  switch (searchType) {
    case "concert-this":
        concert();
        break;
    case "spotify-this-song":
        useSpotify();
        break;
    case "movie-this":
        movie();
        break;
    case "do-what-it-says":
        onTheTin();
        break;
  }
}

// node liri.js concert-this <artist/band name here>
function concert() {
    axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp")
    // search the Bands in Town Artist Events API 
    .then(function(response) {
        console.log("Upcoming concerts for " + searchTerm + ":");
        console.log("\n---------------------------------")
        for(let i = 0; i < response.data.length; i++) {
            console.log("Venue: " + response.data[i].venue.name);
            console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);
            console.log("On: " + moment(response.data[i].datetime).format("MM/DD/YYYY"))
            console.log("---------------------------------");
        }
        console.log("\n")
    });
}



// node liri.js spotify-this-song '<song name here>'
function useSpotify() {
    if (!searchTerm) {
        searchTerm = "The Sign Ace of Base"};
// If no song is provided then your program will default to "The Sign" by Ace of Base.
    spotify
    .search({type: "track", query: searchTerm })
    .then(function(response) {
        console.log("\n---------------------------------")
        console.log("Title: " + response.tracks.items[0].name)
        console.log("Performed by: " + response.tracks.items[0].artists[0].name)
        console.log("Found on Album: " + response.tracks.items[0].album.name)
        console.log("30-second sample at: " + response.tracks.items[0].preview_url)
        console.log("---------------------------------\n")
    })
}
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from


// node liri.js movie-this '<movie name here>'
function movie() {
    if (!searchTerm) {
        searchTerm = "Mr. Nobody"};
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    axios.get("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
        console.log("Title: " + response.data.Title);
        console.log("\n---------------------------------")
        console.log("Year of release: " + response.data.Year);
        console.log("Rating on IMDB: " + response.data.imdbRating);
        console.log("Rating on Rotten Tomatoes: " + response.data.Ratings[1].Value);
        console.log("Produced in: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot summary: " + response.data.Plot);
        console.log("Starring: " + response.data.Actors)
    })
};
// You'll use the axios package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.



// node liri.js do-what-it-says

function onTheTin() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        let directions = data.split(",");
        searchType = directions[0];
        searchTerm = directions[1];
        path();     
    });
}
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Edit the text in random.txt to test out the feature for movie-this and concert-this.

path();

// ** BONUS **
// In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file. 
// Do not overwrite your file each time you run a command.





// Include screenshots (or a GIF/Video) of the typical user flow of your application. Make sure to include the use of Spotify, Bands in Town, and OMDB.
// Include any other screenshots you deem necessary to help someone who has never been introduced to your application understand the purpose and function of it. This is how you will communicate to potential employers/other developers in the future what you built and why, and to show how it works.
// Because screenshots (and well-written READMEs) are extremely important in the context of GitHub, this will be part of the grading.