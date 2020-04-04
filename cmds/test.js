const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class TestCommand extends Command {
  constructor() {
    super('test', {
      aliases: ['test'],
      category: 'Testing'
    });
  }

  exec(message) {
    const phrases = [
      'Bot works. Continue using commands',
      'Yes?',
      'Status: Online',
      'Mic Test Mic Test 123'
    ];
    const num = Math.floor(Math.random() * phrases.length);
    const testEmbed = new Discord.MessageEmbed()
      .setColor('#1565C0')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(phrases[num])
      .setTimestamp()
      .setFooter(
        'Why are you using this command?',
        this.client.user.displayAvatarURL()
      );
    return message.channel.send(testEmbed);
  }
}

module.exports = TestCommand;
