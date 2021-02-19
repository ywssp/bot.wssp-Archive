const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');
const musicCheck = require('../../Functions/MusicCheck.js');
const visualiseDuration = require('../../Functions/GenerateDurationVisualisation');

class NowPlayingCommand extends Command {
  constructor() {
    super('np', {
      aliases: ['np', 'playing', 'nowplaying'],
      category: 'Music',
    });
  }

  async exec(message) {
    if (musicCheck('boolean', message))
      return musicCheck('embed', message);

    const playing = message.guild.musicData.nowPlaying;
    let duration;
    if (playing.duration === '🔴 Live Stream') {
      duration = '🔴 Live Stream';
    } else {
      duration = visualiseDuration(message, playing);
    }

    return createEmbed(message, {
      color: 'defaultBlue',
      title: 'Now Playing',
      thumbnail: playing.thumbnail,
      fields: [
        {
          name: 'Title',
          value: playing.title,
        },
        {
          name: 'Channel',
          value: playing.channelName,
        },
        {
          name: 'Length',
          value: duration,
        },
        {
          name: 'URL',
          value: playing.url,
        },
        {
          name: 'Requester',
          value: playing.requester,
        },
      ],
      authorBool: true,
      send: 'channel',
    });
  }
}

module.exports = NowPlayingCommand;
