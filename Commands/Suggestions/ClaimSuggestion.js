const { Command } = require('discord-akairo');
const suggestionDatabase = require('../../Databases/suggestionDatabase.js');
const createEmbed = require('../../Functions/EmbedCreator.js');

class ClaimSuggestionCommand extends Command {
  constructor() {
    super('claimsuggestion', {
      aliases: ['claimsuggestion'],
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
    const priority = yield {
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
    return { uuid, priority };
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
      await suggestionDatabase.update(
        [{ priority: args.priority }, { status: 'Claimed' }],
        { where: { uuid: args.uuid } },
      );
      //Notify the author of the suggestion that the suggestion is claimed
      this.client.users.cache.get(suggestion.get('user_id')).send(
        createEmbed(message, {
          color: 'defaultBlue',
          title: 'Nice!',
          description:
            'Your suggestion has been claimed! You can see your suggestion on #to-do-list.',
          authorBool: true,
        }),
      );
      //send the suggestion on #to-do-list
      const todoEmbed = await this.client.channels.cache
        .get(process.env.SUGGESTIONTODO)
        .send(
          createEmbed(message, {
            color: 'RANDOM',
            fields: [
              { name: 'Name', value: suggestion.get('name') },
              {
                name: 'Description',
                value: suggestion.get('description'),
              },
              { name: 'Priority', value: suggestion.get('priority') },
            ],
          }),
        );
      todoEmbed.react('✅');
      //get the embed on #suggestion-database
      const suggestionMessage = await this.client.channels.cache
        .get(process.env.SUGGESTIONDB)
        .messages.fetch(suggestion.get('suggestion_id'));
      //edit the embed on #suggestion-database
      suggestionMessage.edit(
        createEmbed(message, {
          fields: [
            { name: 'Name', value: suggestion.get('name') },
            {
              name: 'Description',
              value: suggestion.get('description'),
            },
            { name: 'UUID', value: suggestion.get('uuid') },
            { name: 'Status', value: suggestion.get('status') },
            { name: 'Priority', value: suggestion.get('priority') },
          ],
        }),
      );
      //put the id of the embed on #to-do-list on the suggestion row
      suggestionDatabase.update(
        { todoList_id: todoEmbed.id },
        { where: { uuid: args.uuid } },
      );
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

module.exports = ClaimSuggestionCommand;
