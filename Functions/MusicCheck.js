const createEmbed = require('./EmbedCreator.js');

module.exports = async function musicCheck(message, withQueue, songNumber) {
  const embedData = {
    color: 'errorRed',
    title: 'Whoops!',
    authorBool: true,
    send: 'channel',
  };
  if (!message.member.voice.channel)
    embedData.description = "You aren't in a voice chat!";
  if (!message.guild.musicData.songDispatcher)
    embedData.description = 'There is no song playing!';
  if (!message.guild.musicData.queue && withQueue)
    embedData.description = 'There are no songs in the queue!';
  if (
    songNumber < 1 &&
    songNumber >= message.guild.musicData.queue.length &&
    songNumber
  )
    embedData.description = "That isn't a song number!";
  if (embedData.description) return await createEmbed(message, embedData);
  else return false;
};
