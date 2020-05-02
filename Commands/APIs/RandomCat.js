const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const createEmbed = require('../../Functions/EmbedCreator.js');

class CatCommand extends Command {
  constructor() {
    super('cat', {
      aliases: ['cat'],
      category: 'Entertainment',
    });
  }

  async exec(message) {
    let cat = await fetch('https://aws.random.cat/meow')
      .then((resp) => resp.json())
      .then((resp) => resp.file)
      .catch((err) => console.log(err));
    createEmbed(message, {
      color: 'defaultBlue',
      title: 'A random cat to cheer you up!',
      image: cat,
      footer: 'This command uses https://awl.random.cat/meow',
      authorBool: true,
      send: 'channel',
    });
  }
}

module.exports = CatCommand;
