const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');
const musicCheck = require('../../Functions/MusicCheck.js');

class VolumeCommand extends Command {
  constructor() {
    super('volume', {
      aliases: ['volume'],
      category: 'Music',
    });
  }

  *args() {
    const volume = yield {
      type: 'integer',
      prompt: {
        start: (message) =>
          createEmbed(message, {
            title: 'Color',
            color: 'defaultBlue',
            description: `Enter volume to set from 1-100\nCurrent volume: ${
              message.guild.musicData.volume * 50
            }`,
            authorBool: true,
          }),
      },
    };
    return { volume };
  }
  async exec(message, args) {
    if (musicCheck('boolean', message))
      return musicCheck('embed', message);
    if (!(0 < args.volume < 101))
      return createEmbed(message, {
        color: 'errorRed',
        authorBool: true,
        title: 'Whoops!',
        description: 'The number you entered is not within range!',
        send: 'channel',
      });
    const volume = args.volume / 50;
    function volumeVisualisation(volume) {
      let volumeArray = [];
      let arrowPlaced = false;
      for (let i = 9; i >= 0; i--) {
        if (volume > i / 5 && !arrowPlaced) {
          volumeArray.push(`┿ ${volume * 50}`);
          arrowPlaced = true;
        } else volumeArray.push('│');
      }
      return volumeArray.join(' \n');
    }
    message.guild.musicData.volume = volume;
    message.guild.musicData.songDispatcher.setVolume(volume);
    createEmbed(message, {
      color: 'successGreen',
      title: 'Done!',
      description: 'Changed the volume!',
      fields: [
        {
          name: 'Volume',
          value: volumeVisualisation(volume),
        },
      ],
      authorBool: true,
      send: 'channel',
    });
  }
}

module.exports = VolumeCommand;
