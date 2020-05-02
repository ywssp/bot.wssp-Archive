const { Command } = require('discord-akairo');
const musicCheck = require('../../Functions/MusicCheck.js');
const createEmbed = require('../../Functions/EmbedCreator.js');

class SkipToCommand extends Command {
  constructor() {
    super('skipto', {
      aliases: ['skipto'],
      category: 'Music',
    });
  }

  *args() {
    const songNumber = yield {
      type: 'integer',
      prompt: {
        start: (message) =>
          createEmbed(message, {
            title: 'Skip to track',
            color: 'defaultBlue',
            description:
              'Enter the number of the song you want to skip to\nTo see the queue, do `y+queue` or `y+queue --advanced`',
            authorBool: true,
          }),
      },
    };
    return { songNumber };
  }

  async exec(message, args) {
    if (musicCheck(message, true, args.songNumber)) return;
    message.guild.musicData.queue.splice(0, args.songNumber - 1);
    message.guild.musicData.songDispatcher.end();
    message.react('⏭');
  }
}

module.exports = SkipToCommand;
