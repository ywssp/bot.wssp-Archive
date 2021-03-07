'use strict';
const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');

class PauseCommand extends Command {
  constructor() {
    super('pause', {
      aliases: ['pause', 'resume'],
      category: 'Music',
      channel: 'guild'
    });
  }

  exec(message) {
    if (musicCheck(message)) return;
    
    if (message.guild.musicData.songDispatcher.paused) {
    message.guild.musicData.songDispatcher.resume();
    return message.react('▶');
    } else {
    message.guild.musicData.songDispatcher.pause(true);
    return message.react('⏸');
    }
  }
}

module.exports = PauseCommand;
