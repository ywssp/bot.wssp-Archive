const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');

class QueueCommand extends Command {
  constructor() {
    super('queue', {
      aliases: ['queue'],
      category: 'Music',
      args: [
                {
                    id: 'advanced',
                    match: 'flag',
                    flag: '--advanced'
                }
            ]
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
      })
    if (!args.advanced) {
      const fieldArray = [], fieldArrayArray = [];
      message.guild.musicData.queue.map((obj) => {
      fieldArray.push({
        name: obj.title,
        value: `Requested by: ${obj.requester}\nLength: ${obj.duration}`,
      });
    });
      while (fieldArray) {
    fieldArrayArray.push(fieldArray.splice(0, 25))
      }
    for (let _array of fieldArrayArray) {
        await createEmbed(message, {
            color: 'defaultBlue',
            title: 'Queue',
            fields: _array,
            authorBool: true,
        send: 'channel',
        })
      }
    } else {
      async function deleteMessageArray(messageArray) {
        for (let _message of messageArray) {
          await _message.delete()
        }
      }
      const embedDataArray = [];
      const embedMessageArray = [];
      let index= 1
      for (let videoObj of message.guild.musicData.queue) {
        embedDataArray.push({
          color: 'defaultBlue',
          title: `Song ${index}`,
          fields: [
            {
              name: 'Title',
              value: videoObj.title
            },
            {
              name: 'Length',
              value: videoObj.duration
            },
            {
              name: 'URL',
              value: videoObj.url
            },
            {
              name: 'Requester',
              value: videoObj.requester
            }
          ],
          thumbnail: videoObj.thumbnail,
          authorBool: true,
        send: 'channel',
        });
        index++
      }
      for (let embedData of embedDataArray) {
        embedMessageArray.push(await createEmbed(message, embedData))
      }
      const deletionMessage = await message.channel.send('Because this command takes too much space in this channel, the embeds above will be deleted after 2 minutes or when you react 💣');
      await deletionMessage.react('💣');
      const filter = (reaction, user) => {
	return reaction.emoji.name === '💣' && user.id === message.author.id;
};
      const deletionTimeout = setTimeout(deleteMessageArray(), 60000, embedMessageArray);
deletionMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
  .then(() => {
    deleteMessageArray(embedMessageArray);
    deletionMessage.delete();
    clearTimeout(deletionTimeout)
  })
	.catch(() => {
		console.log('no this isnt an error')
	});
    }
  }
}

module.exports = QueueCommand;
