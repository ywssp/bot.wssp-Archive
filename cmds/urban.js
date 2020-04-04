const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');

class UrbanCommand extends Command {
  constructor() {
    super('urban', {
      aliases: ['urban', 'urbandictionary', 'ud'],
      category: 'Entertainment',
      args: [
        {
          id: 'query',
          match: 'content'
        }
      ]
    });
  }

  async exec(message, args) {
    const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
    const embed = new Discord.MessageEmbed()
      .setColor('#F44336')
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setTitle('Whoops!')
      .setDescription('You need to supply a search term!')
      .setTimestamp()
      .setFooter(
        'This command uses https://api.urbandictionary.com/v0/define?',
        this.client.user.displayAvatarURL()
      );

    if (!args.query.length) {
      return message.channel.send(embed);
    }

    const query = querystring.stringify({ term: args.query });

    const { list } = await fetch(
      `https://api.urbandictionary.com/v0/define?${query}`
    ).then(response => response.json());

    if (!list.length) {
      embed.setDescription(`No results found for **${args.join(' ')}**.`);
      return message.channel.send(embed);
    }

    const [answer] = list;

    embed.setColor('#1565C0');
    embed.setTitle(answer.word);
    embed.setDescription('')
    embed.setURL(answer.permalink);
    embed.addFields(
      { name: 'Definition', value: trim(answer.definition, 1024) },
      { name: 'Example', value: trim(answer.example, 1024) },
      {
        name: 'Rating',
        value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`
      }
    );

    message.channel.send(embed);
  }
}

module.exports = UrbanCommand;
