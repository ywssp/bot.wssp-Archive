const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class RestartCommand extends Command {
  constructor() {
    super('restart', {
      aliases: ['aiho', 'update', 'restart'],
      category: 'Testing',
      ownerOnly: true
    });
  }

  async exec(message) {
    const restartEmbed = new Discord.MessageEmbed()
      .setColor('#F44336')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle('Restarting in...3...2...1.....')
      .setTimestamp()
      .setFooter('Aight, imma head out', this.client.user.displayAvatarURL());
    await message.channel.send(restartEmbed).then(
      setTimeout(() => {
        process.exit();
      }, 3000)
    );
    return 0;
  }
}

module.exports = RestartCommand;
