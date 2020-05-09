const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');

class QueueCommand extends Command {
  constructor() {
    super('queue', {
      aliases: ['queue'],
      category: 'Music',
    });
  }

  async exec(message) {
    if (message.guild.musicData.queue.length === 0)
      return createEmbed(message, {
        color: 'errorRed',
        title: 'Whoops!',
        description: 'There are no songs in the queue!',
        authorBool: true,
        send: 'channel',
      });
    let fieldArray = [];
    let fieldArrayArray = [];
    message.guild.musicData.queue.forEach((obj) => {
      fieldArray.push({
        name: `${fieldArray.length + 1}. ${obj.title}`,
        value: `Requested by: ${obj.requester}\nLength: ${obj.duration}`,
      });
    });
    let sections = Math.ceil(fieldArray.length / 25);
    while (sections) {
      fieldArrayArray.push(fieldArray.splice(0, 25));
      sections--;
    }
    for (let _fieldArray of fieldArrayArray) {
      createEmbed(message, {
        color: 'defaultBlue',
        title: 'Queue',
        fields: _fieldArray,
        authorBool: true,
        send: 'channel',
      });
    }
  }
}

module.exports = QueueCommand;
