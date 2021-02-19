const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');

class ClearCommand extends Command {
  constructor() {
    super('clear', {
      aliases: ['clear'],
      category: 'Music',
    });
  }

  exec(message) {
    if (musicCheck('boolean', message, true))
      return musicCheck('embed', message, true);
    message.guild.musicData.queue = [];
    return message.react('🧹');
  }
}

module.exports = ClearCommand;
