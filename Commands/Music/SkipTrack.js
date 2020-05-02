const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');

class SkipCommand extends Command {
  constructor() {
    super('skip', {
      aliases: ['skip'],
      category: 'Music',
    });
  }

  async exec(message) {
    if (musicCheck(message)) return;
    message.guild.musicData.songDispatcher.end();
    message.react('⏭');
  }
}

module.exports = SkipCommand;
