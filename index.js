const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the Render-provided port or default to 3000 locally

app.get('/', (req, res) => {
  res.send('Hello World! My bot is running.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

import dotenv from "dotenv";
dotenv.config();

import "colors";
import Client from "./src/client.mjs";
import clients from "./Assets/Global/clients.mjs";
import antiCrash from "./src/utils/antiCrash.mjs";
import mongoose from "mongoose";
import globalConfig from "./Assets/Global/config.mjs";
import logger from "./src/utils/logger.mjs";
import "./src/utils/Command.mjs";
import boxen from "boxen";

let aio = `Welcome to ${"Console".blue.bold} by ${
  "phs | Development".red
}`;

let aio_server = `\nSupport:- ${`no`.brightGreen}`;
let Uo = `\nCoded By ${`@phs`.brightCyan.bold}`;

console.log(
  boxen(aio + aio_server + Uo, {
    padding: 1,
    borderStyle: "round",
    textAlignment: "center",
  })
);

antiCrash(); //? anti charsh handling

//? mongodb checking...
if (
  !globalConfig.API.MongoDB ||
  !globalConfig.API.MongoDB.startsWith("mongodb")
) {
  logger(
    "Please Provide a Valid MongoDB Connection String - Support: patreon.com/uoaio"
      .red.bold
  );
  process.exit(1);
}

let count = 0; //? counter for clients/bots

mongoose.set("strictQuery", true); //? mongoose strict mode (mongodb framework)
//? connecting to mongodb
mongoose
  .connect(globalConfig.API.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger(`Connected To MongoDB`.underline.blue.bold);

    clients
      .filter((c) => c.TOKEN && c.CLIENT_ID)
      .forEach(async (config) => {
        new Client(config).start(); //? connecting to client
        count++;
      });

    if (count) logger(`Loading ${count}/${clients.length} Clients...`.magenta);
  })
  .catch((e) => logger(e, "error")); //? logging error if occurs
