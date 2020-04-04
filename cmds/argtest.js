const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class TestCommand extends Command {
  constructor() {
    super('argtest', {
      aliases: ['argtest'],
      args: [
        {
          id: 'items',
          match: 'none',
          prompt: {
            start: message => {
              const embed = new MessageEmbed()
                .setAuthor(
                  message.author.username,
                  message.author.displayAvatarURL
                )
                .setDescription(
                  'Input the arguments that you will give\ntype `stop` to finish recieving arguments'
                )
                .setColor('#1565C0');
              return embed;
            },
            infinite: true
          }
        }
      ],
      category: 'Testing'
    });
  }

  exec(message, args) {
    const testEmbed = new Discord.MessageEmbed()
      .setColor('#1565C0')
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setTitle('The arguments that you gave me are,')
      .setDescription(`\`\`\`${args.items}\`\`\``)
      .setTimestamp()
      .setFooter(
        'This is just a test command. Why are you using this.',
        this.client.user.displayAvatarURL()
      );
    return message.channel.send(testEmbed);
  }
}

module.exports = TestCommand;
