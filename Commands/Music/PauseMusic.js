const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');

class PauseCommand extends Command {
  constructor() {
    super('pause', {
      aliases: ['pause'],
      category: 'Music',
    });
  }

  exec(message) {
    if (musicCheck('boolean', message))
      return musicCheck('embed', message);
    message.guild.musicData.songDispatcher.pause();
    message.react('⏸');
  }
}

module.exports = PauseCommand;
