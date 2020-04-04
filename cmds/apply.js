const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { v4: makeUuid } = require('uuid');

class ApplyCommand extends Command {
  constructor() {
    super('apply', {
      aliases: ['apply'],
      category: 'Moderation'
    });
  }

  async exec(message) {
    const uuid = makeUuid();
    const uuidEmbed = new Discord.MessageEmbed()
      .setColor('#1565C0')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`\`${message.author.tag}\`s UUID:`)
      .setDescription(`\`\`\`${uuid}\`\`\``)
      .setTimestamp()
      .setFooter(
        'Sample text',
        this.client.user.displayAvatarURL()
      );
    const applyEmbed = new Discord.MessageEmbed()
      .setColor('#1565C0')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle('Wait!')
    .setURL('https://cutt.ly/Cool-Community-Mod-Applications')
      .setDescription(`Before you apply, ${message.author.username}, you need to copy this UUID for you to verify your application, because ywssp is ***kinda*** strict.\n\nUUID":\n\`\`\`${uuid}\`\`\``)
      .setTimestamp()
      .setFooter(
        'Try to impress ywssp in order for your chances to become a mod to increase.',
        this.client.user.displayAvatarURL()
      );
    message.author.createDM()
    .then(channel => channel.send(applyEmbed));
    this.client.channels.cache.get('694450315956846592').send(uuidEmbed);
    return 0;
  }
}

module.exports = ApplyCommand;
