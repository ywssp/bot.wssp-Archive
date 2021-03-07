'use strict';
const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');

class ClearCommand extends Command {
  constructor() {
    super('clear', {
      aliases: ['clear'],
      category: 'Music',
      channel: 'guild'
    });
  }

  exec(message) {
    if (musicCheck(message)) return;
      
    message.guild.musicData.queue = 0;
    return message.react('🧹');
  }
}

module.exports = ClearCommand;
