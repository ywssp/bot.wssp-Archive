const { Command } = require('discord-akairo');
const suggestionDatabase = require('../../Databases/suggestionDatabase.js');
const createEmbed = require('../../Functions/EmbedCreator.js');

class CheckSuggestionCommand extends Command {
  constructor() {
    super('checksuggestion', {
      aliases: ['checksuggestion'],
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
    //If the suggestion exists, then send the details of the suggestion
    if (suggestion) {
      createEmbed(message, {
        title: 'defaultBlue',
        fields: [
          {
            name: 'Name',
            value: suggestion.get('name'),
          },
          {
            name: 'Description',
            value: suggestion.get('description'),
          },
          {
            name: 'UUID',
            value: suggestion.get('uuid'),
          },
          {
            name: 'Status',
            value: suggestion.get('status'),
          },
          {
            name: 'Priority',
            value: suggestion.get('priority'),
          },
        ],
        authorBool: true,
        send: 'author',
      });
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

module.exports = CheckSuggestionCommand;
