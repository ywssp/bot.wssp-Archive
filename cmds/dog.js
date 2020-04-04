const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const fetch = require('node-fetch');

class DogCommand extends Command {
  constructor() {
    super('dog', {
      aliases: ['dog'],
      category: 'Entertainment'
    });
  }

  async exec(message) {
    let dog = await fetch('https://dog.ceo/api/breeds/image/random')
      .then(resp => resp.json())
      .then(resp => resp.message)
      .catch(err => console.log(err));
    const dogEmbed = new Discord.MessageEmbed()
      .setColor('#1565C0')
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setTitle('A random dog to cheer you up!')
      .setImage(dog)
      .setTimestamp()
      .setFooter(
        'This command uses https://dog.ceo/api/breeds/image/random',
        this.client.user.displayAvatarURL()
      );
    message.channel.send(dogEmbed);
  }
}

module.exports = DogCommand;
