const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');

class LeaveCommand extends Command {
  constructor() {
    super('leave', {
      aliases: ['leave', 'disconnect', 'dc'],
      category: 'Music',
    });
  }

  async exec(message) {
    if (musicCheck('boolean', message))
      return musicCheck('embed', message);
    message.guild.musicData.queue = [];
    message.guild.musicData.songDispatcher.end();
    return message.react('🛑');
  }
}

module.exports = LeaveCommand;
