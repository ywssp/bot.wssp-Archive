const Discord = require('discord.js');

module.exports = async function embedCreator(message, embedObject) {
  //inititalize the embed
  const colorPresets = {
    //eRed: Errors, dBlue: Default, fGreen: Finished commands, qYellow: Queries
    'eRed': 'F44336',
    'dBlue': '2196F3',
    'fGreen': '4CAF50',
    'qYellow': 'FFEB3B'
  };
  const createdEmbed = new Discord.MessageEmbed().setColor(
    colorPresets[embedObject.color]?colorPresets[embedObject.color]:embedObject.color
  );

  //check if the author field should be filled
  if (embedObject.authorBool) {
    createdEmbed.setAuthor(
      message.author.username,
      message.author.displayAvatarURL()
    );
  }
  //check if a title was given
  if (embedObject.title) {
    createdEmbed.setTitle(embedObject.title);
  }
  //check if there was a given url
  if (embedObject.url) {
    createdEmbed.setURL(embedObject.url);
  }
  //check if a thumbnail url was given
  if (embedObject.thumbnail) {
    createdEmbed.setThumbnail(embedObject.thumbnail);
  }
  //check if a description was given
  if (embedObject.description) {
    createdEmbed.setDescription(embedObject.description);
  }
  //check if there are given fields
  if (embedObject.fields) {
    createdEmbed.addFields(embedObject.fields);
  }
  //check if an image url was given
  if (embedObject.image) {
    createdEmbed.setImage(embedObject.image);
  }
  //check if the footer field should be filled
  if (embedObject.footer) {
    createdEmbed.setTimestamp();
    createdEmbed.setFooter(
      embedObject.footer,
      message.client.user.displayAvatarURL()
    );
  }
  if (embedObject.send) {
    switch (embedObject.send) {
      case 'author':
        return await message.author.send(createdEmbed);
      case 'channel':
        return await message.channel.send(createdEmbed);
      default:
        break;
    }
  }
  return createdEmbed;
};
