const { Command } = require('discord-akairo');
const suggestionDatabase = require('../../Databases/suggestionDatabase.js');
const { v4: makeUuid } = require('uuid');
const createEmbed = require('../../Functions/EmbedCreator.js');

class AddSuggestionCommand extends Command {
  constructor() {
    super('addsuggestion', {
      aliases: ['addsuggestion'],
      category: 'Suggestions',
    });
  }

  *args() {
    const name = yield {
      type: 'string',
      prompt: {
        start: (message) =>
          createEmbed(message, {
            color: 'defaultBlue',
            title: 'Name',
            description: 'Enter the name of your suggestion',
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
            title: 'Description',
            description: 'Enter the description of your suggestion',
            authorBool: true,
          }),
      },
    };
    return { name, description };
  }

  async exec(message, args) {
    //Check if the owner of the guild is the owner of the bot
    if (message.guild.ownerID !== process.env.YWSSP) return;
    //Generate a UUID for the suggestion
    const uuid = makeUuid();
    try {
      //Create a row for the suggestion on the database
      await suggestionDatabase.create({
        uuid: uuid,
        name: args.name,
        description: args.description,
        user_id: message.author.id,
        priority: 'Not yet claimed',
        status: 'Not yet claimed',
      });
      //send an embed on #suggestion-database
      const databaseEmbed = await this.client.channels.cache
        .get(process.env.SUGGESTIONDB)
        .send(
          createEmbed(message, {
            fields: [
              { name: 'Name', value: args.name },
              { name: 'Description', value: args.description },
              { name: 'UUID', value: uuid },
              { name: 'Status', value: 'Not yet claimed' },
              { name: 'Priority', value: 'Not yet claimed' },
            ],
          }),
        );
      //put the id of the embed on #suggestion-database and put it in the suggestion row
      await suggestionDatabase.update(
        { suggestion_id: databaseEmbed.id },
        { where: { uuid: uuid } },
      );
      //Notify the author that the suggestion is submitted
      createEmbed(message, {
        color: 'successGreen',
        title: 'Done!',
        description: `The suggestion has been sent to the database!\nYou\'ll also need this UUID:\`\`\`${uuid}\`\`\``,
        footer:
          'You can do `y+suggest --status [uuid]` to check your suggestion! You could also do `y+suggest --remove [uuid]` to remove your suggestion',
        authorBool: true,
        send: 'author',
      });
      //delete the message
      message.delete();
    } catch (e) {
      const errorEmbed = createEmbed(message, {
        color: 'errorRed',
        title: 'Whoops!',
        description:
          "Something went wrong, but i don't know what went wrong. Just contact ywssp and he will fix it (Probably)",
        authorBool: true,
      });
      console.error(e);
      //if the suggestion name/description is already taken
      if (e.name === 'SequelizeUniqueConstraintError') {
        errorEmbed.setDescription(
          'Your suggestions name/description is already used!',
        );
      }
      return message.channel.send(errorEmbed);
    }
  }
}

module.exports = AddSuggestionCommand;
