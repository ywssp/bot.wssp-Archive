const { Listener } = require('discord-akairo');
const suggestionDatabase = require('../Databases/suggestionDatabase');

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
    });
  }

  exec() {
    suggestionDatabase.sync();
    const now = new Date;
    console.log('Bot.wssp started in', now.toUTCString());
    this.client.user.setActivity('Starting up...');
    this.client.setTimeout(() => {
      this.client.user.setActivity('ywssp fix some bugs', {
        type: 'WATCHING',
      });
    }, 60000);
    this.client.setInterval(() => {
      const activityArray = [
        //'watching' statuses
        'ywssp fix some bugs',
        'ywssp procrastinate',
        'anime',
        'paint dry',
        //'playing' statuses
        'with a rubiks cube',
        'with lego',
        'with my code',
        'Uno',
        //'listening' statuses
        'music',
        'total silence',
      ];
      const pickedActivity = Math.floor(
        Math.random() * activityArray.length,
      );
      if (pickedActivity < 4) {
        this.client.user.setActivity(activityArray[pickedActivity], {
          type: 'WATCHING',
        });
      } else if (pickedActivity < 8) {
        this.client.user.setActivity(activityArray[pickedActivity], {
          type: 'PLAYING',
        });
      } else if (pickedActivity < 10) {
        this.client.user.setActivity(activityArray[pickedActivity], {
          type: 'LISTENING',
        });
      }
    }, 600000);
  }
}

module.exports = ReadyListener;
