const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');
const playSong = require('../../Functions/PlayMusic.js');

class ShuffleCommand extends Command {
  constructor() {
    super('shuffle', {
      aliases: ['shuffle'],
      category: 'Music',
    });
  }

  async exec(message) {
    if (musicCheck('boolean', message, true))
      return musicCheck('embed', message, true);
    const shuffle = ([...arr]) => {
      let m = arr.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      return arr;
    };
    message.guild.musicData.queue = shuffle(
      message.guild.musicData.queue,
    );
    message.react('🔀');
  }
}

module.exports = ShuffleCommand;
