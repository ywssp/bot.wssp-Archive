const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');

class PauseCommand extends Command {
  constructor() {
    super('pause', {
      aliases: ['pause'],
      category: 'Music',
    });
  }

  async exec(message) {
    if (musicCheck(message)) return;
    message.guild.musicData.songDispatcher.pause();
    message.react('⏸');
  }
}

module.exports = PauseCommand;
