const { Listener } = require('discord-akairo');
const activities = require('../Others/Activities.js')

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
    });
  }

  exec() {
    const now = new Date;
    console.log(this.client.user.tag, 'started in', now.toUTCString());
    this.client.user.setActivity('Starting up...');
    this.client.setTimeout(() => {
      this.client.user.setActivity('you', {
        type: 'WATCHING',
      });
    }, 30000);

    const genShuffledActs = (actObj) => {
      let activityArray = [];
      for (let actType of actObj) {
        for (let act of actType.list) {
          activityArray.push([actType.type, act])
        }
      };
      let m = activityArray.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [activityArray[m], activityArray[i]] = [activityArray[i], activityArray[m]];
      };

      return activityArray;
    };

    let shuffledActs = [];
    this.client.setInterval(() => {
      if (shuffledActs.length === 0) {
        shuffledActs = genShuffledActs(activities);
      }
      let activity = shuffledActs.pop();
      this.client.user.setActivity(activity[1], {
        type: activity[0],
      });
    }, 60000);
  }
}

module.exports = ReadyListener;
