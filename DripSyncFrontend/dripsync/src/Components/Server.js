// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let userVisitCount = 0;
let clickCount = 0;
let hoverCount = 0;

io.on("connection", (socket) => {
  userVisitCount++;
  
  // Emit initial counts to the client
  socket.emit("updateCounts", { userVisitCount, clickCount, hoverCount });

  socket.on("incrementClick", () => {
    clickCount++;
    io.emit("updateCounts", { userVisitCount, clickCount, hoverCount });
  });

  socket.on("incrementHover", () => {
    hoverCount++;
    io.emit("updateCounts", { userVisitCount, clickCount, hoverCount });
  });

  socket.on("disconnect", () => {
    userVisitCount--;
    io.emit("updateCounts", { userVisitCount, clickCount, hoverCount });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
