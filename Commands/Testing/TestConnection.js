const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');

class TestCommand extends Command {
  constructor() {
    super('test', {
      aliases: ['test'],
      category: 'Testing',
    });
  }

  exec(message) {
    const phrases = [
      'Bot works. Continue using commands',
      'Yes?',
      'Status: Online',
      'Mic Test Mic Test 123',
    ];
    const num = Math.floor(Math.random() * phrases.length);
    return createEmbed(message, {
      color: 'defaultBlue',
      authorBool: true,
      description: phrases[num],
      send: 'channel',
    });
  }
}

module.exports = TestCommand;
