const Discord = require('discord.js');

module.exports = function embedCreator(embedObject) {
  //inititalize the embed
  const createdEmbed = new Discord.MessageEmbed().setColor(
    embedObject.color || 'DEFAULT'
  );
  ////check if a title was given
  if (embedObject.title) {
    createdEmbed.setTitle(embedObject.title);
  }
  //check if a description was given
  if (embedObject.description) {
    createdEmbed.setDescription(embedObject.description);
  }
  //check if the author field should be filled
  if (embedObject.authorBool) {
    createdEmbed.setAuthor(
      embedObject.message.author.username,
      embedObject.message.author.displayAvatarURL()
    );
  }
  //check if the footer field should be filled
  if (embedObject.footerBool) {
    createdEmbed.setTimestamp();
    createdEmbed.setFooter(
      embedObject.footer,
      this.client.user.displayAvatarURL()
    );
  }
  //check if an image url was given
  if (embedObject.image) {
    createdEmbed.setImage(embedObject.image);
  }
  //check if a thumbnail url was given
  if (embedObject.thumbnail) {
    createdEmbed.setThumbnail(embedObject.thumbnail);
  }
  //check if there are given fields
  if (embedObject.fields) {
    createdEmbed.addFields(embedObject.fields);
  }
  //check if there was a given url
  if (embedObject.url) {
    createdEmbed.setURL(embedObject.url);
  }

  return createdEmbed;
};
