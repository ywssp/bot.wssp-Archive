const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');

class QueueCommand extends Command {
  constructor() {
    super('queue', {
      aliases: ['queue'],
      category: 'Music',
    });
  }

  async exec(message, args) {
    if (message.guild.musicData.queue.length == 0)
      return createEmbed(message, {
        color: 'errorRed',
        title: 'Whoops!',
        description: 'There are no songs in the queue!',
        authorBool: true,
        send: 'channel',
      });
    const fieldArray = [],
      fieldArrayArray = [];
    message.guild.musicData.queue.map((obj) => {
      fieldArray.push({
        name: obj.title,
        value: `Requested by: ${obj.requester}\nLength: ${obj.duration}`,
      });
    });
    let sections = Math.floor(fieldArray.length / 25);
    while (sections) {
      fieldArrayArray.push(fieldArray.splice(0, 25));
      sections--;
    }
    for (let _array of fieldArrayArray) {
      await createEmbed(message, {
        color: 'defaultBlue',
        title: 'Queue',
        fields: _array,
        authorBool: true,
        send: 'channel',
      });
    }
  }
}

module.exports = QueueCommand;
