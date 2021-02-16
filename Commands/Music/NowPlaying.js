const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');
const visualiseDuration = require('../../Functions/GenerateDurationVisualisation');

class NowPlayingCommand extends Command {
  constructor() {
    super('np', {
      aliases: ['np', 'playing', 'nowplaying'],
      category: 'Music',
    });
  }

  async exec(message) {
    if (
      !message.guild.musicData.isPlaying &&
      !message.guild.musicData.nowPlaying
    ) {
      return createEmbed(message, {
        color: 'eRed',
        title: 'Whoops!',
        description: 'There is no song playing!',
        authorBool: true,
        send: 'channel',
      });
    }

    const video = message.guild.musicData.nowPlaying;
    let description;
    if (video.duration == 'Live Stream') {
      description = 'Live Stream';
    } else {
      description = visualiseDuration(message, video);
    }

    createEmbed(message, {
      color: 'defaultBlue',
      title: 'Now Playing',
      thumbnail: video.thumbnail,
      fields: [
        {
          name: 'Title',
          value: video.title,
        },
        {
          name: 'Channel',
          value: video.channelName,
        },
        {
          name: 'Length',
          value: description,
        },
        {
          name: 'URL',
          value: video.url,
        },
        {
          name: 'Requester',
          value: video.requester,
        },
      ],
      authorBool: true,
      send: 'channel',
    });
  }
}

module.exports = NowPlayingCommand;
