import express from "express";
import * as dotenv from "dotenv";
import routers from "./routers/index.js";
import mongoose from "mongoose";
import checkToken from "./auth/authentication.js";
import cors from "cors";
import { createServer } from "http";
import cookie from "cookie-parser";
import { Server } from "socket.io";
import CommentController from "./controller/CommentController.js";

//create web server
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//define data type receive from front-end as json
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", async (data) => {
    const { message, token, blogid, commentFatherId } = JSON.parse(data);
    const res = await CommentController.createNewComment({ message, token, blogid, commentFatherId });
    socket.broadcast.emit("response", JSON.stringify(res));
  });
  socket.on("delete_message", async (data) => {
    const { token, commentID } = JSON.parse(data);
    console.log(data);
    const res = await CommentController.deleteComments({ token, commentID });
    console.log(res)
    socket.broadcast.emit("delete_response", JSON.stringify(res));
  });
});

app.use(express.json());
app.use(checkToken);
app.use(cookie());

dotenv.config();

routers(app);

const port = process.env.PORT;
const socket = process.env.PORT_SOCKET;
server.listen(socket, () => {
  console.log("Server is running on port " + socket);
});
app.listen(port, async () => {
  await mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Connect db successfully");
    })
    .catch(() => {
      console.error("Error connecting");
    });

  console.log("Node listen on port " + port);
});
