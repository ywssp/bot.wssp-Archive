const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class KickCommand extends Command {
  constructor() {
    super('kick', {
      aliases: ['kick'],
      args: [
        {
          id: 'kicked',
          type: 'memberMention'
        },
        {
          id: 'reason',
          match: 'rest'
        }
      ]
    });
  }

  async exec(message, args) {
    const filter = (reaction, user) => {
      return reaction.emoji.name === '☑️' && user.id === message.author.id;
    };

    const kickPromptEmbed = new Discord.MessageEmbed()
      .setColor('#1565C0')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(
        'React ☑️ in this message in the next 10 seconds to kick the mentioned member.'
      )
      .setTimestamp()
      .setFooter(
        'Kicking someone is sometimes useless because the kicked member can still join the server.',
        this.client.user.displayAvatarURL()
      );

    const kickDenyEmbed = new Discord.MessageEmbed()
      .setColor('#F44336')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(
        "The mentioned member didn't get kicked because you hadn't reacted"
      )
      .setTimestamp()
      .setFooter(
        'Kicking someone is sometimes useless because the kicked member can still join the server.',
        this.client.user.displayAvatarURL()
      );

    const kickSuccessEmbed = new Discord.MessageEmbed()
      .setColor('#00E676')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle('The mentioned member has been kicked')
      .setTimestamp()
      .setFooter(
        'Kicking someone is sometimes useless because the kicked member can still join the server.',
        this.client.user.displayAvatarURL()
      );

    const kickPrompt = await message.channel.send(kickPromptEmbed);
    await kickPrompt.react('☑️');
    kickPrompt
      .awaitReactions(filter, {
        max: 1,
        time: 10000,
        errors: ['time']
      })
      .then(() => {
        kickPrompt.delete();
        message.channel.send(kickSuccessEmbed);
        args.kicked.kick(args.reason);
      })
      .catch(() => {
        kickPrompt.delete();
        message.channel.send(kickDenyEmbed);
      });
  }
}

module.exports = KickCommand;
