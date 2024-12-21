const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
// const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: true,
});

// Serve static files (if using a frontend build)
app.use(express.static("public"));

const NameToSocket = new Map();
const SocketToName = new Map();
// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("room:join", (data) => {
    const { Name, Room } = data;
    NameToSocket.set(Name, socket.id);
    SocketToName.set(socket.id, Name);
    io.to(Room).emit("user:joined", { Name, id: socket.id });
    socket.join(Room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", (data) => {
    const { to, offer } = data;
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });
  socket.on("call:accepted", (data) => {
    const { to, answer } = data;
    io.to(to).emit("call:accepted", { from: socket.id, answer });
  });
  socket.on("peer:nego:needed",(data)=>{
    const {to,offer} = data
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });


  })
  socket.on("peer:nego:done",(data)=>{
    const {to,ans} = data
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });

  })
  // Handle disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
