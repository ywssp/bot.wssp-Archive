const { Command } = require('discord-akairo');
const _ = require('lodash');
const createEmbed = require('../../Functions/EmbedCreator.js');
const musicCheck = require('../../Functions/MusicCheck.js');

class QueueCommand extends Command {
  constructor() {
    super('queue', {
      aliases: ['queue'],
      category: 'Music',
    });
  }

  exec(message) {
    if (musicCheck('boolean', message, true))
      return musicCheck('embed', message, true);

    const songDataset = message.guild.musicData.queue.map((song, index) => ({
        name: `${index + 1}. ${song.title}`,
        value: `Channel: ${song.channelName}\nLength: ${song.duration}\nRequested by: ${song.requester}`,
    }));
    const splitDatabase = _.chunk(songDataset, 10);

    return splitDatabase.forEach(data => 
      createEmbed(message, {
        color: 'dBlue',
        title: 'Queue',
        fields: data,
        send: 'channel',
      })
    );
  }
}

module.exports = QueueCommand;
