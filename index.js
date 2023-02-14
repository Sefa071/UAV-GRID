const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// starting point coordinates
const startLat = 43.839767;
const startLng = 18.343170;

// step distance
const step = 0.01;

// current point coordinates
let currentLat = startLat;
let currentLng = startLng;

// grid of 25 points
const grid = [];
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        grid.push({
            lat: startLat + i * step,
            lng: startLng + j * step
        });
    }
}

// current point index
let currentIndex = 0;

app.get("/uav/location", (req, res) => {
    res.render("index", { grid, currentPoint: grid[currentIndex] });
});

io.on("connection", socket => {
    console.log("a user connected");
    let gridIndex = 0;
    let intervalId = setInterval(() => {
        currentLat = grid[gridIndex].lat;
        currentLng = grid[gridIndex].lng;
        socket.emit("updateCurrentPoint", { lat: currentLat, lng: currentLng });

        gridIndex++;
        if (gridIndex === grid.length) {
            clearInterval(intervalId);
        }
    }, 2000);
});

http.listen(3000, () => {
    console.log("listening on *:3000");
});






























































