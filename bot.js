const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const {
  AkairoClient,
  CommandHandler,
  ListenerHandler
} = require("discord-akairo");

class MyClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: "411089957399035904"
      },
      {
        disableEveryone: true
      }
    );
    this.commandHandler = new CommandHandler(this, {
      directory: "./cmds/",
      prefix:["bwsp ","y+", "y "]
    });
    this.listenerHandler = new ListenerHandler(this, {
      directory: "./lstnrs/"
    });

    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();
    this.commandHandler.loadAll();
  }
}

const client = new MyClient();
client.login(process.env.TOKEN);
