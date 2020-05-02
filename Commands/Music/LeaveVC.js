const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');

class LeaveCommand extends Command {
  constructor() {
    super('leave', {
      aliases: ['leave'],
      category: 'Music',
    });
  }

  async exec(message) {
    if (musicCheck(message, true)) return;
    message.react('🛑');
    message.guild.musicData.songDispatcher.end();
    message.guild.musicData.queue.length = 0;
  }
}

module.exports = LeaveCommand;
