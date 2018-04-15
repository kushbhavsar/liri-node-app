require("dotenv").config();
var keys = require("./keys");
var request = require("request");
var twitter = require("twitter");
var spot = require("node-spotify-api");
var fs = require("fs");

var liRi = process.argv[2];
var uInput = process.argv[3];

var spotify = new spot(keys.spotify);
var client = new twitter(keys.twitter);

function tweet() {

    var params = {
        user_id: "hrdave3",
        count: 10,
    }
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("\n--------------------------------------------");
                console.log("\n You tweeted: " + tweets[i].text);
            }
        }
        if (error) {
            console.log(error);
        }
    });
}

function spotiFy() {

    var paramas = {
        type: 'track',
        query: uInput,
        limit: 1
    }
    spotify.search(paramas).then(function (response) {

        var track = response.tracks.items[0]
        console.log("\n--------------------------------------------");
        console.log("\nArtist names: " + track.artists[0].name);
        console.log("\nSong name: " + track.name);
        console.log("\nLink: " + track.preview_url);
        console.log("\nAlbum name: " + track.album.name);
        console.log("\n--------------------------------------------");

    }).catch(function (err) {
        console.log(err);
    });
}

function omdb() {

    var movieName = uInput;
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        if (!error && response.statusCode === 200) {

            console.log("\n--------------------------------------------");
            console.log("\nTitle: " + JSON.parse(body).Title);
            console.log("\nYear: " + JSON.parse(body).Year);
            console.log("\nIMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("\nRotten Tomatoes score: " + JSON.parse(body).Ratings[1].Value);
            console.log("\nCountry: " + JSON.parse(body).Country);
            console.log("\nLanguage: " + JSON.parse(body).Language);
            console.log("\nPlot: " + JSON.parse(body).Plot);
            console.log("\nActors: " + JSON.parse(body).Actors);
            console.log("\n--------------------------------------------");
        }
    });

}

if (liRi === "my-tweets") {
    tweet();
} else if (liRi === "spotify-this-song") {
    spotiFy();
} else if (liRi === "movie-this") {
    omdb();
} else if (liRi === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }
        var dataArr = data.split(",");

        liRi = dataArr[0];
        uInput = dataArr[1];
        spotiFy();
    });
}

