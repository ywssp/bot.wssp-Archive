const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class ActivityCommand extends Command {
  constructor() {
    super('suggesttest', {
      aliases: ['suggesttest'],
      category: 'Testing',
      args: [
        {
          id: 'suggestion',
          match: 'content'
        }
      ]
    });
  }

  async exec(message, args) {
    const suggestion = args.suggestion.split(/ *\| */);
    const activityEmbed = new Discord.MessageEmbed()
      .setColor('#1565C0')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(
        `Got something!\n    Suggestion name: ${suggestion[0]}\n    Suggestion description: ${suggestion[1]}`
      )
      .setTimestamp()
      .setFooter(
        'This will be a ***lot*** complicated later',
        this.client.user.displayAvatarURL()
      );
    return message.channel.send(activityEmbed);
  }
}

module.exports = ActivityCommand;
