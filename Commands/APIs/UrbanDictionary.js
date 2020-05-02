const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const querystring = require('querystring');
const createEmbed = require('../../Functions/EmbedCreator.js');

class UrbanCommand extends Command {
  constructor() {
    super('urban', {
      aliases: ['urban', 'urbandictionary', 'ud'],
      category: 'Entertainment',
      args: [
        {
          id: 'query',
          match: 'content',
        },
      ],
    });
  }

  async exec(message, args) {
    const trim = (str, max) =>
      str.length > max ? `${str.slice(0, max - 3)}...` : str;
    const embed = createEmbed(message, {
      color: 'errorRed',
      authorBool: true,
      title: 'Whoops!',
      description: 'You need to supply a search term!',
      footer: 'This command uses https://api.urbandictionary.com/v0/define?',
      send: false,
    });
    if (!args.query.length) {
      return message.channel.send(embed);
    }
    const query = querystring.stringify({ term: args.query });

    const { list } = await fetch(
      `https://api.urbandictionary.com/v0/define?${query}`
    ).then((response) => response.json());

    if (!list.length) {
      embed.setDescription(`No results found for **${args.join(' ')}**.`);
      return message.channel.send(embed);
    }

    const [answer] = list;
    createEmbed(message, {
      color: 'defaultBlue',
      authorBool: true,
      title: answer.word,
      url: answer.permalink,
      fields: [
        { name: 'Definition', value: trim(answer.definition, 1024) },
        { name: 'Example', value: trim(answer.example, 1024) },
        {
          name: 'Rating',
          value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
        },
      ],
      footer: 'This command uses https://api.urbandictionary.com/v0/define?',
      send: 'channel',
    });
  }
}

module.exports = UrbanCommand;
