const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');

class LoopCommand extends Command {
  constructor() {
    super('loop', {
      aliases: ['loop'],
      category: 'Music',
    });
  }

  async exec(message) {
    if (musicCheck(message)) return;
    message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
    message.react('🔂');
  }
}

module.exports = LoopCommand;
