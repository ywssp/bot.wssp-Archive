const { Command } = require('discord-akairo');
const ytdl = require('ytdl-core');
const createEmbed = require('../../Functions/EmbedCreator.js');
const Youtube = require('simple-youtube-api');
const youtube = new Youtube(process.env.YOUTUBE);
const formatDuration = require('../../Functions/FormatDuration.js');

class PlayCommand extends Command {
  constructor() {
    super('play', {
      aliases: ['play'],
      category: 'Music',
    });
  }
  *args() {
    const searchTerm = yield {
      type: 'string',
      prompt: {
        start: (message) =>
          createEmbed(message, {
            title: 'Search',
            description: 'Enter a search term or a youtube link',
            fields: [
              {
                name: 'Example',
                value: '```Search term\nhttps://youtu.be/bbJkJ8T6ZBQ```',
              },
            ],
            authorBool: true,
          }),
      },
    };
    return { searchTerm };
  }
  async exec(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return createEmbed(message, {
        color: 'errorRed',
        title: 'Whoops!',
        description: "You aren't in a voice channel! Join one and try again",
        authorBool: true,
        send: 'channel',
      });
    }
    let query;
    if (
      args.searchTerm.match(
        /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
      )
    ) {
      const playlist = await youtube
        .getPlaylist(args.searchTerm)
        .catch(function () {
          return createEmbed(message, {
            color: 'errorRed',
            title: 'Whoops!',
            description:
              "The playlist cannot be found. It's probably:\nA. The playlist is private, or\nB. The playlist doesn't exist",
            authorBool: true,
            send: 'channel',
          });
        });
      const videosObj = await playlist.getVideos().catch(function () {
        return createEmbed(message, {
          color: 'errorRed',
          title: 'Whoops!',
          description:
            'An error occurred whill getting one of the videos in the playlist',
          authorBool: true,
          send: 'channel',
        });
      });
      for (let i = 0; i < videosObj.length; i++) {
        const video = await videosObj[i].fetch();
        message.guild.musicData.queue.push(
          constructSongObj(video, voiceChannel, message)
        );
      }
      if (message.guild.musicData.isPlaying == false) {
        message.guild.musicData.isPlaying = true;
        return playSong(message.guild.musicData.queue, message);
      } else if (message.guild.musicData.isPlaying == true) {
        return createEmbed(message, {
          color: 'defaultBlue',
          title: 'Done!',
          description: `The playlist has been added to the queue!`,
          fields: [
            {
              name: 'Playlist title',
              value: playlist.title,
            },
            {
              name: 'Amount of videos',
              value: videosObj.length,
            },
          ],
          authorBool: true,
          send: 'channel',
        });
      }
    }
    if (
      args.searchTerm.match(
        /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/
      )
    ) {
      query = args.searchTerm
        .replace(/(>|<)/gi, '')
        .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      const id = query[2].split(/[^0-9a-z_\-]/i)[0];
      const video = await youtube.getVideoByID(id).catch(function () {
        return createEmbed(message, {
          color: 'errorRed',
          title: 'Whoops!',
          description: 'There was an error while getting the video!',
          authorBool: true,
          send: 'channel',
        });
      });
      if (
        video.duration.hours !== 0 ||
        (video.duration.hours < 1 && video.duration.minutes < 31)
      ) {
        return createEmbed(message, {
          color: 'errorRed',
          title: 'Whoops!',
          description: "I don't support videos longer than 1 hour!",
          authorBool: true,
          send: 'channel',
        });
      }
      message.guild.musicData.queue.push(
        constructSongObj(video, voiceChannel, message)
      );
      if (
        message.guild.musicData.isPlaying == false ||
        typeof message.guild.musicData.isPlaying == 'undefined'
      ) {
        message.guild.musicData.isPlaying = true;
        return playSong(message.guild.musicData.queue, message);
      } else if (message.guild.musicData.isPlaying == true) {
        return createEmbed(message, {
          color: 'defaultBlue',
          title: 'New song added to queue',
          fields: [
            {
              name: 'Title',
              value: video.title,
            },
            {
              name: 'Length',
              value: formatDuration(video.duration),
            },
            {
              name: 'URL',
              value: video.url,
            },
          ],
          thumbnail: video.thumbnail.default.url,
          authorBool: true,
          send: 'channel',
        });
      }
    }

    const videos = await youtube
      .searchVideos(args.searchTerm, 5)
      .catch(function () {
        return createEmbed(message, {
          color: 'errorRed',
          title: 'Whoops!',
          description: 'There was an error while searching for a video!',
          authorBool: true,
          send: 'channel',
        });
      });
    if (videos.length < 5) {
      return createEmbed(message, {
        color: 'errorRed',
        title: 'Whoops!',
        description: 'No videos were found while searching',
        authorBool: true,
        send: 'channel',
      });
    }
    const vidNameArr = [];
    for (let i = 0; i < videos.length; i++) {
      vidNameArr.push(`${i + 1}: ${videos[i].title}`);
    }
    const songEmbed = await createEmbed(message, {
      color: 'defaultBlue',
      title: 'Music selection',
      description: 'Pick a song from below using the reactions below',
      fields: [
        {
          name: 'Song 1',
          value: vidNameArr[0],
        },
        {
          name: 'Song 2',
          value: vidNameArr[1],
        },
        {
          name: 'Song 3',
          value: vidNameArr[2],
        },
        {
          name: 'Song 4',
          value: vidNameArr[3],
        },
        {
          name: 'Song 5',
          value: vidNameArr[4],
        },
      ],
      authorBool: true,
      send: 'channel',
    })[('1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '🛑')].forEach(
      async (emoji) => await songEmbed.react(emoji)
    );
    songEmbed
      .awaitReactions(
        (reaction, user) => {
          return (
            ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '🛑'].some(
              (emoji) => reaction.emoji.name === emoji
            ) && user.id === message.author.id
          );
        },
        { max: 1, time: 60000, errors: ['time'] }
      )
      .then(function (response) {
        const reaction = response.first().emoji.name;
        if (reaction === '🛑') return songEmbed.delete();
        const videoIndex = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '🛑'].indexOf(
          reaction
        );
        youtube
          .getVideoByID(videos[videoIndex].id)
          .then(function (video) {
            if (
              video.duration.hours !== 0 ||
              (video.duration.hours >= 1 && video.duration.minutes > 31)
            ) {
              songEmb;
              createEmbed(message, {
                color: 'errorRed',
                title: 'Whoops!',
                description: "I don't support videos longer than 1 hour!",
                authorBool: true,
                send: 'channel',
              });
            }
            message.guild.musicData.queue.push(
              constructSongObj(video, voiceChannel, message)
            );
            if (message.guild.musicData.isPlaying == false) {
              message.guild.musicData.isPlaying = true;
              if (songEmbed) {
                songEmbed.delete();
              }
              playSong(message.guild.musicData.queue, message);
            } else if (message.guild.musicData.isPlaying == true) {
              if (songEmbed) {
                songEmbed.delete();
              }
              return createEmbed(message, {
                color: 'defaultBlue',
                title: 'New song added to queue',
                fields: [
                  {
                    name: 'Title',
                    value: video.title,
                  },
                  {
                    name: 'Length',
                    value: formatDuration(video.duration),
                  },
                  {
                    name: 'URL',
                    value: video.url,
                  },
                ],
                thumbnail: video.thumbnail.default.url,
                authorBool: true,
                send: 'channel',
              });
            }
          })
          .catch(function (error) {
            if (songEmbed) {
              songEmbed.delete();
            }
            console.error(error);
            return createEmbed(message, {
              color: 'errorRed',
              title: 'Whoops!',
              description: 'An error occured while getting the video ID',
              authorBool: true,
              send: 'channel',
            });
          });
      })
      .catch(function () {
        if (songEmbed) {
          songEmbed.delete();
        }
        return createEmbed(message, {
          color: 'errorRed',
          title: 'Whoops!',
          description: 'Please try again',
          authorBool: true,
          send: 'channel',
        });
      });
    function playSong(queue, message) {
      queue[0].voiceChannel
        .join()
        .then(function (connection) {
          const dispatcher = connection
            .play(
              ytdl(queue[0].url, {
                quality: 'highestaudio',
                highWaterMark: 1024 * 1024 * 10,
              })
            )
            .on('start', function () {
              message.guild.musicData.songDispatcher = dispatcher;
              dispatcher.setVolume(message.guild.musicData.volume);
              const videoEmbed = createEmbed(message, {
                color: 'defaultBlue',
                title: 'Now playing:',
                fields: [
                  {
                    name: 'Title',
                    value: queue[0].title,
                  },
                  {
                    name: 'Length',
                    value: formatDuration(queue[0].duration),
                  },
                  {
                    name: 'URL',
                    value: queue[0].url,
                  },
                  {
                    name: 'Requester',
                    value: queue[0].requester,
                  },
                ],
                thumbnail: queue[0].thumbnail,
                authorBool: true,
              });
              if (queue[1]) videoEmbed.addField('Next Song:', queue[1].title);
              message.channel.send(videoEmbed);
              message.guild.musicData.nowPlaying = queue[0];
              return queue.shift();
            })
            .on('finish', function () {
              if (queue.length >= 1) {
                return playSong(queue, message);
              } else {
                message.guild.musicData.isPlaying = false;
                message.guild.musicData.nowPlaying = null;
                message.guild.musicData.songDispatcher = null;
                return message.guild.me.voice.channel.leave();
              }
            })
            .on('error', function (e) {
              createEmbed(message, {
                color: 'errorRed',
                title: 'Whoops!',
                description: 'An error occured while playing the song',
                authorBool: true,
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
        .catch(function (e) {
          console.error(e);
          return message.guild.me.voice.channel.leave();
        });
    }
    function constructSongObj(video, voiceChannel, message) {
      let duration = formatDuration(video.duration);
      if (duration == '00:00') duration = 'Live Stream';
      return {
        url: `https://www.youtube.com/watch?v=${video.raw.id}`,
        title: video.title,
        rawDuration: video.duration,
        duration,
        thumbnail: video.thumbnails.high.url,
        requester: message.author.tag,
        voiceChannel,
      };
    }
  }
}

module.exports = PlayCommand;
