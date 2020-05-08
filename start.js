const http = require('http');
const express = require('express');
const app = express();
app.get('/', (request, response) => {
  let now = new Date;
  console.log(now.toUTCString() + ' Ping Received');
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} = require('discord-akairo');
const { Structures } = require('discord.js');
Structures.extend('Guild', (Guild) => {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        volume: 1,
        songDispatcher: null,
      };
    }
  }
  return MusicGuild;
});

class MyClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: process.env.YWSSP,
      },
      {
        disableEveryone: true,
      }
    );
    this.commandHandler = new CommandHandler(this, {
      directory: './Commands/',
      prefix: ['y+', 'y '],
    });
    this.listenerHandler = new ListenerHandler(this, {
      directory: './Listeners/',
    });

    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();
    this.commandHandler.loadAll();
  }
}

const client = new MyClient();
client.login(process.env.TOKEN);
