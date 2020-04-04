const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const color = require('img-color');

class AdCommand extends Command {
  constructor() {
    super('advertise', {
      aliases: ['advertise'],
      category: 'Utility',
      args: [
        {
          id: 'invite',
          type: 'url'
        },
        {
          id: 'description',
          match: 'rest'
        }
      ]
    });
  }
  async exec(message, args) {
    let discordInviteRegex = /https:\/\/discord\.gg\/[A-z0-9]{6,7}/.test(
      args.invite
    );
    if (!discordInviteRegex) {
      const denyEmbed = new Discord.MessageEmbed()
        .setColor('#F44336')
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle('Whoops!')
        .setDescription("That isn't a valid server invite!")
        .setTimestamp()
        .setFooter('Sample text', this.client.user.displayAvatarURL());
      message.channel.send(denyEmbed);
      return message.delete();
    }
    const invite = await this.client.fetchInvite(args.invite);
    const adEmbed = new Discord.MessageEmbed()
      .setColor(color.getDominantColor(invite.guild.iconURL()).dColor)
      .setAuthor(invite.inviter.username, invite.inviter.displayAvatarURL())
      .setTitle(invite.guild.name)
      .setURL(invite.url)
      .setThumbnail(invite.guild.iconURL())
      .setDescription(args.description)
      .addField(
        'Server members',
        `Total member count: ${invite.memberCount}\nOnline member count: ${invite.presenceCount}`
      )
      .setTimestamp()
      .setFooter(invite.expiresTimestamp, this.client.user.displayAvatarURL());
    message.channel.send(adEmbed);
  }
}

module.exports = AdCommand;
