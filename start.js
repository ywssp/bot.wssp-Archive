const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Server Ok!');
});
server.listen(3000);

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
        volume: 0.8,
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
        ownerID: process.env.OWNER,
      },
      {
        disableEveryone: true,
      },
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
