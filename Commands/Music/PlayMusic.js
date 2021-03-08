const { Command } = require('discord-akairo');
const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');
const createEmbed = require('../../Functions/EmbedCreator.js');
const musicCheck = require('../../Functions/MusicCheck.js');
const {
  createSongObj,
  unescapeHTML,
  formatDuration,
} = require('../../Functions/MusicFunctions.js');

const youtube = new Youtube(process.env.YOUTUBE);

class PlayCommand extends Command {
  constructor() {
    super('play', {
      aliases: ['play', 'add'],
      category: 'Music',
      channel: 'guild',
    });
  }

  async *args(message) {
    const searchTerm = yield {
      match: 'content',
      prompt: {
        start: (message) =>
          createEmbed(message, 'query', {
            title: 'Search',
            description:
              'Enter a search term or a YouTube link. Use the `--current` or `-c` flag to add the current song',
          }),
      },
    };

    let video;

    // If the '--current' flag is present, get the video id of the song currently playing
    if (/^(-c)|(--current)$/.test(searchTerm)) {
      video = message.guild.musicData.nowPlaying.id;
      // If the term is a playlist link, get all video ids of the playlist
    } else if (
      /^.*(youtu.be\/|list=)([^#\&\?]*).*/.test(searchTerm)
    ) {
      const playlist = await youtube
        .getPlaylist(searchTerm)
        .catch(() =>
          createEmbed(message, 'error', {
            description: 'The playlist cannot be found!',
            send: 'channel',
          }),
        );

      video = await playlist.getVideos().catch(() => {
        createEmbed(message, 'error', {
          descShort: 'getting one of the videos',
          send: 'channel',
        });
        return { error: true };
      });

      video.push(playlist);
      // If the term is a video link, get the video id
    } else if (
      /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/.test(
        searchTerm,
      )
    ) {
      video = searchTerm
        .replace(/(>|<)/gi, '')
        .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)[2]
        .split(/[^0-9a-z_\-]/i)[0];
    } else {
      const videoFetched = await youtube
        .searchVideos(searchTerm, 1)
        .catch(() => {
          createEmbed(message, 'error', {
            descShort: 'searching for a video',
            send: 'channel',
          });
          return { error: true };
        });

      // If there are not enough videos found while searching
      if (videoFetched.length < 1) {
        createEmbed(message, 'error', {
          description: 'No videos were found while searching',
          send: 'channel',
        });
        return { error: true };
      }
      video = videoFetched[0].id;
    }

    return { video };
  }

  async exec(message, args) {
    async function playSong(message) {
      const song =
        message.guild.musicData.loop === 'track'
          ? message.guild.musicData.nowPlaying
          : message.guild.musicData.queue[0];
      await song.voiceChannel
        .join()
        .then((connection) => {
          const dispatcher = connection
            .play(
              ytdl(song.url, {
                quality: 'highestaudio',
              }),
            )
            .on('start', async () => {
              message.guild.musicData.songDispatcher = dispatcher;
              dispatcher.setVolume(message.guild.musicData.volume);
              const songEmbed = await createEmbed(
                message,
                'default',
                {
                  title: 'Now playing:',
                  fields: [
                    {
                      name: 'Title',
                      value: song.title,
                    },
                    {
                      name: 'Channel',
                      value: song.channelName,
                    },
                    {
                      name: 'Length',
                      value: song.duration,
                    },
                    {
                      name: 'URL',
                      value: song.url,
                    },
                    {
                      name: 'Requester',
                      value: song.requester,
                    },
                  ],
                  thumbnail: song.thumbnail,
                  footer: `Paused: ${
                    message.guild.musicData.songDispatcher.paused
                      ? '✅'
                      : '❌'
                  } |  Looped: ${
                    message.guild.musicData.loop
                      ? message.guild.musicData.loop
                      : '❌'
                  } | Volume: ${message.guild.musicData.volume * 50}`,
                },
              );
              if (message.guild.musicData.loop !== 'track')
                message.guild.musicData.queue.shift();
              if (message.guild.musicData.queue[0]) {
                songEmbed.addFields(
                  { name: '\u200B', value: '\u200B' },
                  {
                    name: 'Next Song',
                    value: message.guild.musicData.queue[0].title,
                  },
                );
              }
              message.guild.musicData.nowPlaying = song;
              return message.channel.send(songEmbed);
            })
            .on('finish', () => {
              if (message.guild.musicData.loop === 'queue') {
                message.guild.musicData.queue.push(
                  message.guild.musicData.nowPlaying,
                );
              }

              if (
                message.guild.musicData.queue.length >= 1 ||
                message.guild.musicData.loop === 'track'
              ) {
                return playSong(message);
              }
              message.guild.musicData.isPlaying = false;
              message.guild.musicData.nowPlaying = null;
              message.guild.musicData.loop = false;
              message.guild.musicData.songDispatcher = null;
              return message.guild.me.voice.channel.leave();
            })
            .on('error', (e) => {
              createEmbed(message, 'error', {
                descShort: 'playing the song',
                send: 'channel',
              });
              console.error(e);
              message.guild.musicData.queue.length = 0;
              message.guild.musicData.isPlaying = false;
              message.guild.musicData.nowPlaying = null;
              message.guild.musicData.songDispatcher = null;
              return message.guild.me.voice.channel.leave();
            });
        })
        .catch((e) => {
          console.error(e);
          return message.guild.me.voice.channel.leave();
        });
    }

    const voiceChannel = message.member.voice.channel;

    if (
      musicCheck(message, {
        sameVC: false,
        playing: false,
      })
    )
      return;

    if (args.error) return;

    if (typeof args.video === 'string') {
      let video;
      try {
        video = await youtube.getVideoByID(args.video);
      } catch (e) {
        console.error(e);
        return createEmbed(message, 'error', {
          descShort: 'getting the video ID',
          authorBool: true,
          send: 'channel',
        });
      }

      if (
        video.duration.hours !== 0 ||
        (video.duration.hours >= 1 && video.duration.minutes > 20)
      ) {
        return createEmbed(message, 'error', {
          description: "I don't support videos longer than 1 hour!",
          authorBool: true,
          send: 'channel',
        });
      }

      const songObj = createSongObj(video, voiceChannel, message);
      message.guild.musicData.queue.push(songObj);
      if (!message.guild.musicData.isPlaying) {
        message.guild.musicData.isPlaying = true;
        playSong(message);
      } else if (message.guild.musicData.isPlaying) {
        return createEmbed(message, 'success', {
          title: 'New song added to queue',
          fields: [
            {
              name: 'Title',
              value: songObj.title,
            },
            {
              name: 'Channel',
              value: songObj.channelName,
            },
            {
              name: 'Length',
              value: songObj.duration,
            },
            {
              name: 'URL',
              value: songObj.url,
            },
            {
              name: 'Requester',
              value: songObj.requester,
            },
          ],
          thumbnail: songObj.thumbnail,
          authorBool: true,
          send: 'channel',
        });
      }
    } else {
      const playlistData = args.video.pop();
      const processingStatus = await message.channel.send(
        'Processing playlist...',
      );
      for (const vid of args.video) {
        if (_video.raw.status.privacyStatus !== 'private') {
          const video = await vid.fetch();
          message.guild.musicData.queue.push(
            createSongObj(video, voiceChannel, message),
          );
        }
      }
      await processingStatus.delete();
      if (!message.guild.musicData.isPlaying) {
        message.guild.musicData.isPlaying = true;
        playSong(message);
      } else {
        return createEmbed(message, 'success', {
          title: 'New playlist added to queue',
          fields: [
            {
              name: 'Title',
              value: playlistData.title,
            },
            {
              name: 'Channel',
              value: playlistData.channelName,
            },
            {
              name: 'No. of videos',
              value: playlistData.length,
            },
            {
              name: 'URL',
              value: playlistData.url,
            },
          ],
          thumbnail: playlistData.thumbnail,
          authorBool: true,
          send: 'channel',
        });
      }
    }
  }
}

module.exports = PlayCommand;
