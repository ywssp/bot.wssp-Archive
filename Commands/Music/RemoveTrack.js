const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');
const musicCheck = require('../../Functions/MusicCheck.js');

class RemoveCommand extends Command {
  constructor() {
    super('remove', {
      aliases: ['remove'],
      category: 'Music',
    });
  }

  *args() {
    const songNumber = yield {
      type: 'integer',
      prompt: {
        start: (message) =>
          createEmbed(message, {
            title: 'Remove track',
            color: 'defaultBlue',
            description:
              'Enter the number of the song you want to remove\nTo see the queue, do `y+queue` or `y+queue --advanced`',
            authorBool: true,
          }),
      },
    };
    return { songNumber };
  }
  async exec(message, args) {
    if (musicCheck('boolean', message, true, args.songNumber))
      return musicCheck('embed', message, true, args.songNumber);
    const songBeingRemoved =
      message.guild.musicData.queue[args.songNumber - 1];
    createEmbed(message, {
      color: 'errorRed',
      title: 'Removed song:',
      fields: [
        {
          name: 'Title',
          value: songBeingRemoved.title,
        },
        {
          name: 'Length',
          value: songBeingRemoved.duration,
        },
        {
          name: 'URL',
          value: songBeingRemoved.url,
        },
        {
          name: 'Requester',
          value: songBeingRemoved.requester,
        },
      ],
      thumbnail: songBeingRemoved.thumbnail,
      authorBool: true,
      send: 'channel',
    });
    message.guild.musicData.queue.splice(args.songNumber - 1, 1);
  }
}

module.exports = RemoveCommand;
