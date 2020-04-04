const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class ActivityCommand extends Command {
  constructor() {
    super('activity', {
      aliases: ['activity'],
      category: 'Testing',
      args: [
        {
          id: 'activity',
          match: 'content'
        }
      ],
      ownerOnly: true
    });
  }

  async exec(message, args) {
    const activityEmbed = new Discord.MessageEmbed()
      .setColor('#1565C0')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`Activity set to '${args.activity}'`)
      .setTimestamp()
      .setFooter(
        "It's a shame that custom statuses are not available for bots",
        this.client.user.displayAvatarURL()
      );
    await message.channel.send(activityEmbed);
    return this.client.user.setActivity(`${args.activity} | y+help`);
  }
}

module.exports = ActivityCommand;
