const { Command } = require('discord-akairo');
const suggestionDatabase = require('../../Databases/suggestionDatabase.js');
const createEmbed = require('../../Functions/EmbedCreator.js');

class FInishSuggestionCommand extends Command {
  constructor() {
    super('finishsuggestion', {
      aliases: ['finishsuggestion'],
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
            description: 'Enter the uuid of your suggestion',
            authorBool: true,
          }),
      },
    };
    const description = yield {
      type: 'string',
      prompt: {
        start: (message) =>
          createEmbed(message, {
            color: 'defaultBlue',
            title: 'Reason',
            description: 'Enter the description to use',
            authorBool: true,
          }),
      },
    };
    return { uuid, description };
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
      this.client.users.cache.get(suggestion.get('user_id')).send(
        createEmbed(message, {
          color: 'defaultBlue',
          title: 'Yay!',
          description:
            'Your suggestion has been finished! You can see the update on #updates.',
          authorBool: true,
        }),
      );
      await this.client.channels.cache
        .get(process.env.SUGGESTIONUPDATES)
        .send(
          createEmbed(message, {
            title: 'New update!',
            description: args.description,
            fields: [
              {
                name: 'Original suggestion',
                value: suggestion.get('description'),
              },
            ],
          }),
        );
      const suggestionMessage = await this.client.channels.cache
        .get(process.env.SUGGESTIONDB)
        .messages.fetch(suggestion.get('suggestion_id'));
      suggestionMessage.delete();
      const todoMessage = await this.client.channels.cache
        .get(process.env.SUGGESTIONTODO)
        .messages.fetch(suggestion.get('todolist_id'));
      todoMessage.delete();
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

module.exports = FInishSuggestionCommand;
