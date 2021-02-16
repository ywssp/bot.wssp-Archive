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
    }, 60000);
    this.client.setInterval(() => {
      const pickedActivityType = activities[
        Math.floor(
        Math.random() * activities.length,
      )];
      const pickedActivity = pickedActivityType.list[
        Math.floor(
        Math.random() * pickedActivityType.list.length,
      )];
      console.log(pickedActivityType.type, pickedActivity)
      this.client.user.setActivity(pickedActivity, {
          type: pickedActivityType.type,
        });
    }, 600000);
  }
}

module.exports = ReadyListener;
