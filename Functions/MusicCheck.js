const createEmbed = require('./EmbedCreator.js');

module.exports = (checkType, message, withQueue, songNumber) => {
  const checks = {
    vc: !message.member.voice.channel,
    playing: !message.guild.musicData.songDispatcher,
    queue: !message.guild.musicData.queue && withQueue,
    songNumber:
      (songNumber < 1 ||
      songNumber > message.guild.musicData.queue.length) &&
      songNumber,
  };
  if (checkType === 'boolean') {
    if (checks.vc || checks.playing || checks.queue || checks.songNumber)
      return true;
    return false;
  }
  if (checkType === 'embed') {
    const embedData = {
      color: 'eRed',
      title: 'Whoops!',
      authorBool: true,
      send: 'channel',
    };
    if (checks.vc) embedData.description = "You aren't in a voice chat!";
    if (checks.playing) embedData.description = 'There is no song playing!';
    if (checks.queue)
      embedData.description = 'There are no songs in the queue!';
    if (checks.songNumber) embedData.description = "That isn't a valid song number!";
    if (embedData.description) return createEmbed(message, embedData);
  }
  return 0;
};
