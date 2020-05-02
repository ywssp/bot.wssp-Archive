const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');

class RestartCommand extends Command {
  constructor() {
    super('restart', {
      aliases: ['aiho', 'update', 'restart'],
      category: 'Testing',
      ownerOnly: true,
    });
  }

  async exec(message) {
    await createEmbed(message, {
      color: 'errorRed',
      authorBool: true,
      description: 'Restarting in 3...2...1...',
      send: 'channel',
    }).then(
      setTimeout(() => {
        process.exit();
      }, 3000)
    );
    return 0;
  }
}

module.exports = RestartCommand;
