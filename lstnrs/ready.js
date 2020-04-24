const { Listener } = require('discord-akairo');
const suggestionTable = require('../suggestionTable.js');

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  exec() {
    suggestionTable.sync();
    this.client.user.setActivity(
      'ywssp suffer from using sequelize databases',
      { type: 'WATCHING' }
    );
    this.client.setInterval(() => {
      const activityArray = [
        //'watching' statuses
        'ywssp suffer from using sequelize databases',
        'ywssp procrastinate',
        'anime',
        'paint dry',
        'people build a house',
        'an ad on my game that plays every 1 minute',
        //'playing' statuses
        'with a rubiks cube',
        'with lego',
        'with my code',
        'Uno',
        //'listening' statuses
        'music',
        'total silence'
      ];
      const pickedActivity = Math.floor(Math.random() * activityArray.length);
      if (pickedActivity < 6) {
        this.client.user.setActivity(activityArray[pickedActivity], {
          type: 'WATCHING'
        });
      } else if (pickedActivity < 10) {
        this.client.user.setActivity(activityArray[pickedActivity], {
          type: 'PLAYING'
        });
      } else if (pickedActivity < 12) {
        this.client.user.setActivity(activityArray[pickedActivity], {
          type: 'LISTENING'
        });
      }
    }, 600000);
  }
}

module.exports = ReadyListener;
