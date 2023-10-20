import express from "express";
import * as dotenv from "dotenv";
import routers from "./routers/index.js";
import mongoose from "mongoose";
import checkToken from "./auth/authentication.js";
import cors from 'cors'
import cookie  from 'cookie-parser'

//create web server
const app = express();

//define data type receive from front-end as json
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(checkToken);
app.use(cookie());

//load .env file: config file
dotenv.config();

routers(app);

const port = process.env.PORT;
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
