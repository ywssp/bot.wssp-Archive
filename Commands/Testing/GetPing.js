const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      category: 'General',
    });
  }

  async exec(message) {
    const sent = await message.channel.send('Loading...');
    const timeDiff =
      (sent.editedAt || sent.createdAt) -
      (message.editedAt || message.createdAt);
    sent.delete();
    return createEmbed(message, {
      color: 'defaultBlue',
      title: 'Pong!',
      description: `🔂 **RTT**: ${timeDiff} ms`,
      authorBool: true,
      send: 'channel',
    });
  }
}

module.exports = PingCommand;
