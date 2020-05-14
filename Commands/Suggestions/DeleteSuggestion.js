const { Command } = require('discord-akairo');
const suggestionDatabase = require('../../Databases/suggestionDatabase.js');
const createEmbed = require('../../Functions/EmbedCreator.js');

class DeleteSuggestionCommand extends Command {
  constructor() {
    super('deletesuggestion', {
      aliases: ['deletesuggestion'],
      category: 'Suggestions',
      ownerOnly: true,
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
            description: 'Enter the uuid of the suggestion to delete',
            authorBool: true,
          }),
      },
    };
    const reason = yield {
      type: 'string',
      prompt: {
        start: (message) =>
          createEmbed(message, {
            color: 'defaultBlue',
            title: 'Reason',
            description:
              'Enter the reason to send the author of the suggestion',
            authorBool: true,
          }),
      },
    };
    return { uuid, reason };
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
      //notify the author of the suggestion that the suggestion is deleted
      this.client.users.cache.get(suggestion.get('user_id')).send(
        createEmbed(message, {
          color: 'errorRed',
          title: '._.',
          description:
            'Your suggestion has been deleted by ywssp. He also left you a note.',
          fields: [
            {
              name: 'Reason',
              value: args.reason,
            },
          ],
          authorBool: true,
        }),
      );
      const suggestionMessage = await this.client.channels.cache
        .get(process.env.SUGGESTIONDB)
        .messages.fetch(suggestion.get('suggestion_id'));
      suggestionMessage.delete();

      const todoMessage = await this.client.channels.cache
        .get(process.env.SUGGESTIONTODO)
        .messages.fetch(suggestion.get('todolist_id'));
      if (todoMessage) {
        todoMessage.delete();
      }
      await suggestionDatabase.destroy({
        where: { uuid: args.uuid },
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

module.exports = DeleteSuggestionCommand;
