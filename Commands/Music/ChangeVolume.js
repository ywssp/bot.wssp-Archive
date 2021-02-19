const { Command, Argument } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');
const musicCheck = require('../../Functions/MusicCheck.js');

class VolumeCommand extends Command {
  constructor() {
    super('volume', {
      aliases: ['volume', 'vol'],
      category: 'Music',
    });
  }

  *args() {
    const volume = yield {
      type: Argument.range('integer', 0, 100, true),
      prompt: {
        start: (message) =>
          createEmbed(message, {
            title: 'Volume',
            color: 'qYellow',
            description: `Enter volume to set from 0-100\nCurrent volume: ${
              message.guild.musicData.volume * 50
            }`,
            authorBool: true,
          }),
        retry: (message) => 
          createEmbed(message, {
            title: 'Whoops!',
            color: 'eRed',
            description: 'The number you entered is not within range!',
            authorBool: true,
          }),
      },
    };
    return { volume };
  }
  exec(message, args) {
    if (musicCheck('boolean', message))
      return musicCheck('embed', message);

    const volume = args.volume / 50;
    let volumeIndex = Math.ceil(volume * 5 - 1);
    volumeIndex = volumeIndex < 0?0:volumeIndex
    let volumeArray = ['│','│','│','│','│','│','│','│','│','│',];
    volumeArray[volumeIndex] = `┿ ${args.volume}`

    message.guild.musicData.volume = volume;
    message.guild.musicData.songDispatcher.setVolume(volume);
    return createEmbed(message, {
      color: 'fGreen',
      title: 'Done!',
      description: 'Changed the volume!',
      fields: [
        {
          name: 'Volume',
          value: volumeArray.reverse().join('\n'),
        },
      ],
      authorBool: true,
      send: 'channel',
    });
  }
}

module.exports = VolumeCommand;
