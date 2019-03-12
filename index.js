"use strict";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import paths from "path";
import socketIo from "socket.io";
import { Array } from "core-js";

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const locationMap = new Map();

app.use(express.static(paths.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.send("hello");
});

io.on("connection", socket => {
  socket.on("updateLocation", pos => {
    locationMap.set(socket.id, pos);
  });

  socket.on("requestLocations", () => {
    socket.emit("locationUpdate", Array.from(locationMap));
  });

  socket.on("disconnect", () => {
    locationMap.delete(socket.id);
  });
});
server.listen(process.env.PORT || 3000, function(){
  console.log('listening on', server.address().port);
});
