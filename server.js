const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Servidor do Aventura do Quadradinho está online!");
});

io.on("connection", (socket) => {
  console.log("Jogador conectado:", socket.id);

  socket.on("playerMove", (data) => {
    socket.broadcast.emit("playerMove", {
      id: socket.id,
      ...data
    });
  });

  socket.on("disconnect", () => {
    console.log("Jogador saiu:", socket.id);
    socket.broadcast.emit("playerDisconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
