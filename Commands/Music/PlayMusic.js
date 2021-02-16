const { Command } = require('discord-akairo');
const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');
const youtube = new Youtube(process.env.YOUTUBE);
const formatDuration = require('../../Functions/FormatDuration.js');
const createEmbed = require('../../Functions/EmbedCreator.js');

class PlayCommand extends Command {
  constructor() {
    super('play', {
      aliases: ['play', 'add'],
      category: 'Music',
    });
  }
  *args() {
    const searchTerm = yield {
      type: 'string',
      match: 'content',
      prompt: {
        start: message =>
          createEmbed(message, {
            title: 'Search',
            color: 'qYellow', 
            description: 'Enter a search term or a youtube link',
            fields: [
              {
                name: 'Example',
                value:
                  `\`\`\`https://youtu.be/bbJkJ8T6ZBQ | Plays the linked video
Search Term | Lists 5 videos from the query to choose from
-l 'search term' | Plays the first video from the query
https://www.youtube.com/playlist?list=PL3817D41C7D841E23 | Adds the videos inside the playlist on the queue\`\`\``,
              },
            ],
            authorBool: true,
          }),
      },
    };
    return { searchTerm };
  }

  async exec(message, args) {
    async function playSong(message) {
      const song = message.guild.musicData.queue[0];
      song.voiceChannel
        .join()
        .then(function(connection) {
          const dispatcher = connection
            .play(
              ytdl(song.url, {
                quality: 'highestaudio',
                highWaterMark: 1024 * 1024 * 10,
              }),
            )
            .on('start', async function() {
              message.guild.musicData.songDispatcher = dispatcher;
              dispatcher.setVolume(message.guild.musicData.volume);
              const videoEmbed = await createEmbed(message, {
                color: 'dBlue',
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
                authorBool: true,
              });
              if (message.guild.musicData.queue[1]) {
                videoEmbed.addField('\u200B', '\u200B');
                videoEmbed.addField(
                  'Next Song',
                  message.guild.musicData.queue[1].title,
                );
              }
              message.channel.send(videoEmbed);
              message.guild.musicData.nowPlaying = song;
              return message.guild.musicData.queue.shift();
            })
            .on('finish', function() {
              if (message.guild.musicData.queue.length >= 1) {
                return playSong(message);
              } else {
                message.guild.musicData.isPlaying = false;
                message.guild.musicData.nowPlaying = null;
                message.guild.musicData.songDispatcher = null;
                return message.guild.me.voice.channel.leave();
              }
            })
            .on('error', function(e) {
              createEmbed(message, {
                color: 'eRed',
                title: 'Whoops!',
                description:
                  'An error occured while playing the song',
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
        .catch(function(e) {
          console.error(e);
          return message.guild.me.voice.channel.leave();
        });
    }

    const unescapeHTML = str =>
      str.replace(
        /&amp;|&lt;|&gt;|&#39;|&quot;/g,
        tag =>
          ({
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&#39;': "'",
            '&quot;': '"',
          }[tag] || tag),
    );

    function constructSongObj(video, voiceChannel, _message) {
      let duration = formatDuration(video.duration);
      if (duration == '00:00') duration = 'Live Stream';
      return {
        url: `https://www.youtube.com/watch?v=${video.raw.id}`,
        title: video.title,
        rawDuration: video.duration,
        channelName: video.channel.title,
        duration,
        thumbnail: video.thumbnails.high.url,
        requester: _message.author.tag,
        voiceChannel,
      };
    }
    
    function checkTerm(term) {
      const regexes = [/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/,/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/, /-l /, /./];
      const types = ['playlist', 'video', 'luckysearch', 'search']
      for (let i = 0;;i++) {
        if (regexes[i].test(term)) {
          return types[i];
          break;
        }
      }
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      createEmbed(message, {
        color: 'eRed',
        title: 'Whoops!',
        description:
          "You aren't in a voice channel! Join one and try again",
        authorBool: true,
        send: 'channel',
      })
      return;
    }
    let vidToGet;
    let playlistTitle;
    const termType = checkTerm(args.searchTerm);

    if (termType === 'playlist') {
      const playlist = await youtube
        .getPlaylist(args.searchTerm)
        .catch(function() {
          return createEmbed(message, {
            color: 'eRed',
            title: 'Whoops!',
            description: 'The playlist cannot be found!',
            authorBool: true,
            send: 'channel',
          });
        });
      playlistTitle = playlist.title;
      vidToGet = await playlist.getVideos().catch(function() {
        return createEmbed(message, {
          color: 'eRed',
          title: 'Whoops!',
          description:
            'An error occurred while getting one of the videos',
          authorBool: true,
          send: 'channel',
        });
      });
    } else if (termType === 'video') {
      const query = args.searchTerm
        .replace(/(>|<)/gi, '')
        .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      vidToGet = query[2].split(/[^0-9a-z_\-]/i)[0];
    } else if (termType === 'luckysearch') {
      const videos = await youtube
        .searchVideos(args.searchTerm.replace('-l ', ''), 1)
        .catch(function() {
          return createEmbed(message, {
            color: 'eRed',
            title: 'Whoops!',
            description:
              'There was an error while searching for a video!',
            authorBool: true,
            send: 'channel',
          });
        });

      if (videos.length < 1) {
        return createEmbed(message, {
          color: 'eRed',
          title: 'Whoops!',
          description: 'No videos were found while searching',
          authorBool: true,
          send: 'channel',
        });
      }

      vidToGet = videos[0].id;
    } else if (termType === 'search') {
      const videos = await youtube
        .searchVideos(args.searchTerm, 5)
        .catch(function() {
          return createEmbed(message, {
            color: 'eRed',
            title: 'Whoops!',
            description:
              'There was an error while searching for a video!',
            authorBool: true,
            send: 'channel',
          });
        });

      if (videos.length < 5) {
        return createEmbed(message, {
          color: 'eRed',
          title: 'Whoops!',
          description: 'No videos were found while searching',
          authorBool: true,
          send: 'channel',
        });
      }
      const fieldArr = [];
      for (let i = 0; i < videos.length; i++) {
        fieldArr.push({
          name: 'Song ' + (i + 1),
          value: unescapeHTML(videos[i].title),
        });
      }

      const songEmbed = await createEmbed(message, {
        color: 'dBlue',
        title: 'Music selection',
        description:
          'Pick a song from below using the reactions below',
        fields: fieldArr,
        authorBool: true,
        send: 'channel',
      });

      for (let emoji of ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '🛑']) {
        songEmbed.react(emoji);
      }
      let awaitReaction;

      try {
        awaitReaction = await songEmbed.awaitReactions(
          (reaction, user) => {
            return (
              ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '🛑'].some(
                emoji => reaction.emoji.name === emoji,
              ) && user.id === message.author.id
            );
          },
          { max: 1, time: 60000, errors: ['time'] },
        );
        awaitReaction = awaitReaction.first().emoji.name;
      } catch (e) {
        await songEmbed.delete();
        return createEmbed(message, {
          color: 'eRed',
          title: 'Whoops!',
          description: 'Please try again',
          authorBool: true,
          send: 'channel',
        });
      }

      await songEmbed.delete();
      if (awaitReaction === '🛑') return;

      vidToGet = videos[['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'].indexOf(awaitReaction,)].id;
    }

    if (termType !== 'playlist') {
      let video;
      try {
        video = await youtube.getVideoByID(vidToGet);
      } catch (error) {
        console.error(error);
        return createEmbed(message, {
          color: 'eRed',
          title: 'Whoops!',
          description: 'An error occured while getting the video ID',
          authorBool: true,
          send: 'channel',
        });
      }

      if (
        video.duration.hours !== 0 ||
        (video.duration.hours >= 1 && video.duration.minutes > 6)
      ) {
        return createEmbed(message, {
          color: 'eRed',
          title: 'Whoops!',
          description: "I don't support videos longer than 1 hour!",
          authorBool: true,
          send: 'channel',
        });
      }

      const songObj = constructSongObj(video, voiceChannel, message);
      message.guild.musicData.queue.push(songObj);
      if (!message.guild.musicData.isPlaying) {
        message.guild.musicData.isPlaying = true;
        playSong(message);
      } else if (message.guild.musicData.isPlaying) {
        return createEmbed(message, {
          color: 'fGreen',
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
      for (let _video of vidToGet) {
        const video = await _video.fetch();
        message.guild.musicData.queue.push(
          constructSongObj(video, voiceChannel, message),
        );
      }
      if (!message.guild.musicData.isPlaying) {
        message.guild.musicData.isPlaying = true;
        playSong(message);
      } else if (message.guild.musicData.isPlaying) {
        {
          return createEmbed(message, {
            color: 'dBlue',
            title: 'New playlist added to queue',
            fields: [
              {
                name: 'Title',
                value: playlistTitle,
              },
            ],
            authorBool: true,
            send: 'channel',
          });
        }
      }
    }
  }
}

module.exports = PlayCommand;
