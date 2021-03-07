'use strict';
const Discord = require('discord.js');

module.exports = async function embedCreator(
  message,
  preset,
  settings,
) {
  const presets = {
    error: {
      color: '#FF7043',
      title: 'Whooops!',
      description: !settings.descFalse?`An error occured while ${settings.descShort?settings.descShort:'executing the command'}`:'',
    },
    default: {color: '#03A9F4'},
    success: {
      color: '#8BC34A',
      title: 'Success!',
    },
    query: {color: '#FFEE58'},
  };

  //inititalize the embed
  const createdEmbed = new Discord.MessageEmbed(
    presets[preset] ? presets[preset] : null,
  );

  //check if the author field should be filled
  settings.authorBool
    ? createdEmbed.setAuthor(
        message.author.username,
        message.author.displayAvatarURL(),
      )
    : null;

  //check if a title was given
  settings.title ? createdEmbed.setTitle(settings.title) : null;

  //check if there was a given url
  settings.url ? createdEmbed.setURL(settings.url) : null;

  //check if a thumbnail url was given
  settings.thumbnail
    ? createdEmbed.setThumbnail(settings.thumbnail)
    : null;

  //check if a description was given
  settings.description
    ? createdEmbed.setDescription(settings.description)
    : null;

  //check if there are given fields
  settings.fields ? createdEmbed.addFields(settings.fields) : null;

  //check if an image url was given
  settings.image ? createdEmbed.setImage(settings.image) : null;

  //check if the footer field should be filled
  if (settings.footer) {
    createdEmbed.setTimestamp();
    createdEmbed.setFooter(
      settings.footer,
      message.client.user.displayAvatarURL(),
    );
  }

  switch (settings.send) {
    case 'author':
      return await message.author.send(createdEmbed);
      break;
    case 'channel':
      return await message.channel.send(createdEmbed);
      break;
    default:
      return createdEmbed;
      break;
  }
};
