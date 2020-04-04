const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const convert = require('convert-css-color-name-to-hex');
const similar = require('string-similarity');


class RoleCommand extends Command {
  constructor() {
    super('customrole', {
      aliases: ['customrole'],
      category: 'Utility',
      args: [
        {
          id: 'color'
        },
        {
          id: 'name',
          match: 'rest'
        }
      ]
    });
  }
  async exec(message, args) {
    let roleColor;
    let roleName;
    let imitateBoolean;
    let highRoleNames = message.guild.roles.cache.filter(
      role => role.position > message.member.roles.highest.position
    );
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(args.color)) {
      roleColor = convert(args.color);
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(roleColor)) {
        roleColor = '#ffffff';
      }
    }
    if (!args.name) {
      roleName = message.author.username;
    } else {
      roleName = args.name;
    }
    for (let role of highRoleNames.values()) {
      console.log(role);
      if ((similar.compareTwoStrings(role.name.toLowerCase(), roleName.toLowerCase()))> 0.75) {
        imitateBoolean = true;
      }
    }
    if (imitateBoolean) {
      const imitateEmbed = new Discord.MessageEmbed()
        .setColor('#F44336')
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle('Whoops!')
        .setDescription(`You can't make a custom role to imitate other roles!`)
        .setTimestamp()
        .setFooter('Roles are nice.', this.client.user.displayAvatarURL());
      return message.channel.send(imitateEmbed)
    }
    let role = await message.guild.roles.create({
      data: {
        name: `.${roleName}`,
        color: roleColor
      }
    });

    await message.member.roles.add(role).catch(console.error);
    let highest = message.member.roles.highest.position;
    await role.setPosition(highest + 1);
    const roleEmbed = new Discord.MessageEmbed()
      .setColor(roleColor)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle('There! Made your custom role for you.')
      .setDescription(`Your custom role is <@&${role.id}>`)
      .setTimestamp()
      .setFooter('Roles are nice.', this.client.user.displayAvatarURL());
    return message.channel.send(roleEmbed);
  }
}

module.exports = RoleCommand;
