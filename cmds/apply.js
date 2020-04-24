const { Command } = require('discord-akairo');
const { modApplications: applicationChannel } = require('../logChannels.js');
const createEmbed = require('../embedCreator.js');
const { v4: makeUuid } = require('uuid');

class ApplyCommand extends Command {
  constructor() {
    super('apply', {
      aliases: ['apply'],
      category: 'Moderation',
    });
  }

  async exec(message) {
    const memberIsVerified = message.member.roles.cache.some(
      (role) => /Verified/.test(role.name) && role.name[0] !== ' '
    );
    if (memberIsVerified) {
      const uuid = makeUuid();
      this.client.channels.cache.get(applicationChannel).send(
        createEmbed({
          message: message,
          color: '#1565C0',
          title: `\`${message.author.tag}\`s UUID:`,
          description: `\`\`\`${uuid}\`\`\``,
          footer: 'Sample text',
          authorBoolean: true,
          footerBoolean: false,
        })
      );
      message.author.send(
        createEmbed({
          message: message,
          title: 'Wait!',
          color: '#1565C0',
          url: 'https://cutt.ly/Chill-Community-Mod-Apps',
          description: `Before you apply, ${message.author.username} Copy this UUID. Don't ask why.\n\nUUID:\n\`\`\`${uuid}\`\`\``
        })
      );
    } else {
      message.author.send(
        createEmbed({
          message: message,
          title: 'Whoops!',
          color: '#F44336',
          description: 'You need to be verified to be able to apply!'
        })
      );
    }
  }
}

module.exports = ApplyCommand;
