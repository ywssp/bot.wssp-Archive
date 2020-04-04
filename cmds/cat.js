const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const fetch = require('node-fetch');

class CatCommand extends Command {
  constructor() {
    super('cat', {
      aliases: ['cat'],
      category: 'Entertainment'
    });
  }

  async exec(message) {
    let cat = await fetch('https://aws.random.cat/meow')
      .then(resp => resp.json())
      .then(resp => resp.file)
      .catch(err => console.log(err));
    const catEmbed = new Discord.MessageEmbed()
      .setColor('#1565C0')
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setTitle('A random cat to cheer you up!')
      .setImage(cat)
      .setTimestamp()
      .setFooter(
        'This command uses https://awl.random.cat/meow',
        this.client.user.displayAvatarURL()
      );
    message.channel.send(catEmbed);
  }
}

module.exports = CatCommand;
