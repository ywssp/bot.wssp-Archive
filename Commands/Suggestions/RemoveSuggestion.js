const { Command } = require('discord-akairo');
const suggestionDatabase = require('../../Databases/suggestionDatabase.js');
const createEmbed = require('../../Functions/EmbedCreator.js');

class RemoveSuggestionCommand extends Command {
  constructor() {
    super('removesuggestion', {
      aliases: ['removesuggestion'],
      category: 'Suggestions',
    });
  }

  *args() {
    const uuid = yield {
      type: 'string',
      prompt: {
        start: (message) =>
          createEmbed(message, {
            color: 'defaultBlue',
            title: 'UUID',
            description: 'Enter the uuid of your suggestion',
            authorBool: true,
          }),
      },
    };
    return { uuid };
  }

  async exec(message, args) {
    //Check if the owner of the guild is the owner of the bot
    if (message.guild.ownerID !== process.env.YWSSP) return;
    //Get the suggestion from the uuid
    const suggestion = await suggestionDatabase.findOne({
      where: { uuid: args.uuid },
    });
    const status = suggestion.get('status');

    //If the suggestion exists, then continue
    if (suggestion) {
      //If the suggestion is not yet claimed, then delete the suggestion
      if (status === 'Not yet claimed') {
        createEmbed(message, {
          color: 'errorRed',
          title: '._.',
          description:
            'Your suggestion has been removed. IDK why you want to do it but i did it.',
          authorbool: true,
          send: 'author',
        });
        const suggestionMessage = await this.client.channels.cache
          .get(process.env.SUGGESTIONDB)
          .messages.fetch(suggestion.get('suggestion_id'));
        suggestionMessage.delete();
        suggestionDatabase.destroy({
          where: { uuid: args.uuid },
        });
      }
      //If it's already claimed, then notify the aouthor that it can no longer be removed
      else {
        createEmbed(message, {
          color: 'errorRed',
          title: 'Whoops!',
          description:
            "The suggestion cannot be remove because it's already claimed!",
          authorBool: true,
          send: 'author',
        });
      }
    }
    //If not, then notify the author that the suggestion doesn't exist
    else {
      createEmbed(message, {
        color: 'errorRed',
        title: 'Whoops!',
        description:
          "The suggestion could not be found. It's probably:\nA. A typo,\nB. The suggestion is already finished,\nC. The suggstion is removed, or\nD. The suggestion didn't exist at all.",
        authorBool: true,
        send: 'author',
      });
    }
    //Delete the message
    message.delete();
  }
}

module.exports = RemoveSuggestionCommand;
