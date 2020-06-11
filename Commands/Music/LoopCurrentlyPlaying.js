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
    if (musicCheck('boolean', message))
      return musicCheck('embed', message);
    const songToLoop = message.guild.musicData.nowPlaying;
    songToLoop.requester = message.author.tag;
    message.guild.musicData.queue.unshift(songToLoop);
    message.react('🔂');
  }
}

module.exports = LoopCommand;
