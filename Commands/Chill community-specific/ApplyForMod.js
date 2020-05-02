const { Command } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');
const { v4: makeUuid } = require('uuid');

class ApplyCommand extends Command {
  constructor() {
    super('apply', {
      aliases: ['apply'],
      category: 'Moderation',
    });
  }

  async exec(message) {
    if (message.guild.ownerID !== process.env.YWSSP) return;
    const memberIsVerified = message.member.roles.cache.some(
      (role) => /Verified/.test(role.name) && !/- .* -/.test(role.name)
    );
    if (memberIsVerified) {
      const uuid = makeUuid();
      this.client.channels.cache.get(process.env.MODAPPS).send(
        createEmbed(message, {
          color: 'defaultBlue',
          title: `\`${message.author.tag}\`s UUID:`,
          description: `\`\`\`${uuid}\`\`\``,
          authorBool: true,
        })
      );
      createEmbed(message, {
        title: 'Wait!',
        color: 'defaultBlue',
        url: 'https://cutt.ly/Chill-Community-Mod-Apps',
        description: `Before you apply, ${message.author.username} Copy this UUID. Don't ask why.\n\nUUID:\n\`\`\`${uuid}\`\`\``,
        authorBool: true,
        send: 'author',
      });
    } else {
      createEmbed(message, {
        title: 'Whoops!',
        color: 'errorRed',
        description: 'You need to be verified to be able to apply!',
        authorBool: true,
        send: 'author',
      });
    }
  }
}

module.exports = ApplyCommand;
