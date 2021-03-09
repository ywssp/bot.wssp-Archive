const Discord = require('discord.js');

module.exports = async function embedCreator(message, preset, settings) {
  const presets = {
    error: {
      color: '#FF7043',
      title: 'Whooops!',
      description: !settings.descFalse
        ? `An error occured while ${
            settings.descShort ? settings.descShort : 'executing the command'
          }`
        : '',
    },
    default: { color: '#03A9F4' },
    success: {
      color: '#8BC34A',
      title: 'Success!',
    },
    query: { color: '#FFEE58' },
  };

  // inititalize the embed
  const createdEmbed = new Discord.MessageEmbed(
    presets[preset] ? presets[preset] : null
  );

  // check if the author field should be filled
  if (settings.authorBool) {
    createdEmbed.setAuthor(
      message.author.username,
      message.author.displayAvatarURL()
    );
  }

  // check if a title was given
  if (settings.title) createdEmbed.setTitle(settings.title);

  // check if there was a given url
  if (settings.url) createdEmbed.setURL(settings.url);

  // check if a thumbnail url was given
  if (settings.thumbnail) createdEmbed.setThumbnail(settings.thumbnail);

  // check if a description was given
  if (settings.description) createdEmbed.setDescription(settings.description);

  // check if there are given fields
  if (settings.fields) createdEmbed.addFields(settings.fields);

  // check if an image url was given
  if (settings.image) createdEmbed.setImage(settings.image);

  // check if the footer field should be filled
  if (settings.footer) {
    createdEmbed.setTimestamp();
    createdEmbed.setFooter(
      settings.footer,
      message.client.user.displayAvatarURL()
    );
  }

  switch (settings.send) {
    case 'author':
      return await message.author.send(createdEmbed);
    case 'channel':
      return await message.channel.send(createdEmbed);
    default:
      return createdEmbed;
  }
};
