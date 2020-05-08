const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');

class ResumeCommand extends Command {
  constructor() {
    super('resume', {
      aliases: ['resume'],
      category: 'Music',
    });
  }

  async exec(message) {
    if (musicCheck('boolean', message))
      return musicCheck('embed', message);
    message.guild.musicData.songDispatcher.resume();
    message.react('▶️');
  }
}

module.exports = ResumeCommand;
