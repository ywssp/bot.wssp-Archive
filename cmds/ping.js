const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      category: 'General'
    });
  }

  async exec(message) {
    const sent = await message.channel.send('Loading...');
    const timeDiff =
      (sent.editedAt || sent.createdAt) -
      (message.editedAt || message.createdAt);
    const pingEmbed = new Discord.MessageEmbed()
      .setColor('#1565C0')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle('Pong!')
      .setDescription(`🔂 **RTT**: ${timeDiff} ms`)
      .setTimestamp()
      .setFooter(
        'Why does every bot have this command?',
        this.client.user.displayAvatarURL()
      );
    sent.delete();
    message.channel.send(pingEmbed);
    return 0;
  }
}

module.exports = PingCommand;
