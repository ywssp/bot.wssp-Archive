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
    if (musicCheck('boolean', message, true))
      return musicCheck('embed', message, true);
    message.react('🛑');
    message.guild.musicData.queue = [];
    message.guild.musicData.songDispatcher.end();
  }
}

module.exports = LeaveCommand;
