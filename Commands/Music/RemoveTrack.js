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
            color: 'qYellow',
            description:
              'Enter the number of the song you want to remove\nTo see the queue, do `y+queue`',
            authorBool: true,
          }),
      },
    };
    return { songNumber };
  }
  exec(message, args) {
    if (musicCheck('boolean', message, true, args.songNumber))
      return musicCheck('embed', message, true, args.songNumber);
    const removedSong = message.guild.musicData.queue[args.songNumber - 1];
    message.guild.musicData.queue.splice(args.songNumber - 1, 1);
    return createEmbed(message, {
      color: 'eRed',
      title: 'Removed song:',
      fields: [
        {
          name: 'Title',
          value: removedSong.title,
        },
        {
          name: 'Length',
          value: removedSong.duration,
        },
        {
          name: 'URL',
          value: removedSong.url,
        },
        {
          name: 'Requester',
          value: removedSong.requester,
        },
      ],
      thumbnail: removedSong.thumbnail,
      authorBool: true,
      send: 'channel',
    });
  }
}

module.exports = RemoveCommand;
