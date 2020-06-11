const ytdl = require('ytdl-core');
const createEmbed = require('./EmbedCreator.js');

module.exports = async function playSong(message) {
  const song = message.guild.musicData.queue[0];
  song.voiceChannel
    .join()
    .then(function (connection) {
      const dispatcher = connection
        .play(
          ytdl(song.url, {
            quality: 'highestaudio',
            highWaterMark: 1024 * 1024 * 10,
          }),
        )
        .on('start', async function () {
          message.guild.musicData.songDispatcher = dispatcher;
          dispatcher.setVolume(message.guild.musicData.volume);
          const videoEmbed = await createEmbed(message, {
            color: 'defaultBlue',
            title: 'Now playing:',
            fields: [
              {
                name: 'Title',
                value: song.title,
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
        .on('finish', function () {
          if (message.guild.musicData.queue.length >= 1) {
            return playSong(message);
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
};
