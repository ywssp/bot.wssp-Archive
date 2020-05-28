const { Command } = require('discord-akairo');
const convertCssColorNameToHex = require('convert-css-color-name-to-hex');
const { isColorName, isHexColor } = require('css-color-checker');
const createEmbed = require('../../Functions/EmbedCreator.js');
const getColorName = require('../../Functions/GetColorName.js');

class ColorRoleCommand extends Command {
  constructor() {
    super('colorrole', {
      aliases: ['colorrole'],
      category: 'Customization',
    });
  }

  *args() {
    const color = yield {
      type: 'string',
      prompt: {
        start: (message) =>
          createEmbed(message, {
            title: 'Color',
            description:
              'Enter a color, preferably a hex code from [HTML Color Codes](https://htmlcolorcodes.com/), A color name on [w3schools](https://www.w3schools.com/colors/colors_names.asp), or type "remove" to remove your color role',
            authorBool: true,
          }),
      },
    };
    return { color };
  }

  async exec(message, args) {
    const colorRoleLimit = message.guild.roles.cache.find(
      (role) => role.name === '- Color Role Limit -',
    );
    //If the bot doesn't have permission to create roles
    if (!message.guild.me.hasPermission('MANAGE_ROLES'))
      return createEmbed(message, {
        color: 'errorRed',
        authorBool: true,
        title: 'Whoops!',
        description: "I don't have permission to create roles!",
        send: 'channel',
      });

    //If color roles are not set up
    if (!colorRoleLimit)
      return createEmbed(message, {
        color: 'errorRed',
        authorBool: true,
        title: 'Whoops!',
        description:
          "Color roles aren't enabled in this server! Contact a moderator enable color roles",
        fields: [
          {
            name: 'Instructions',
            value:
              'Create a role named `- Color Role Limit -` and place it in the position you want the color roles to be created',
          },
        ],
        send: 'channel',
      });

    //Getting the color
    let color;
    const randomHexColorCode = () => {
      let n = (Math.random() * 0xfffff * 1000000).toString(16);
      return '#' + n.slice(0, 6);
    };
    if (isColorName(args.color) && !isHexColor(args.color)) {
      color = convertCssColorNameToHex(args.color);
    } else if (isHexColor(args.color)) color = args.color;
    else color = randomHexColorCode();

    //Find an existing color role from the member
    const existingColorRole = message.member.roles.cache.find(
      (role) => /.+ \| #([0-9]|[A-F]){6}/i.test(role.name),
    );

    //If the color is 'remove'
    if (args.color.toLowerCase() === 'remove') {
      //If the author doesn't have a color role
      if (!existingColorRole)
        return createEmbed(message, {
          color: 'errorRed',
          authorBool: true,
          title: 'Whoops!',
          description: "You don't have a color role!",
          send: 'channel',
        });

      //Remove the color role from the author
      await message.member.roles.remove(existingColorRole);
      //If there is no member with the color role, then delete the color role
      if (!existingColorRole.members.length)
        await existingColorRole.delete();

      return createEmbed(message, {
        color: 'successGreen',
        authorBool: true,
        title: 'Done!',
        description: 'Removed your color role!',
        send: 'channel',
      });
    }

    //Getting the color name
    const colorName = getColorName(color);

    //Creating the temporary role
    const tempRole = await message.guild.roles.create({
      data: {
        name: colorName.name + '(temp)',
        color: color,
        position: colorRoleLimit.position - 1,
      },
    });
    await message.member.roles.add(tempRole).catch(console.error);

    //Await reaction from member
    const filter = (reaction, user) => {
      return (
        (reaction.emoji.name === '❌' ||
          reaction.emoji.name === '✅') &&
        user.id === message.author.id
      );
    };

    const tempEmbed = await createEmbed(message, {
      color: 'defaultBlue',
      authorBool: true,
      title: 'Is your role good?',
      description:
        "The color role you have is temporary. React ✅ if you want to keep it or ❌ if you don't",
      send: 'channel',
    });
    await tempEmbed.react('✅');
    await tempEmbed.react('❌');

    tempEmbed
      .awaitReactions(filter, {
        max: 1,
        time: 30000,
        errors: ['time'],
      })
      .then(async (collected) => {
        await tempEmbed.delete();

        //Delete the temporary role
        await tempRole.delete();
        if (collected.first().emoji.name === '❌')
          return createEmbed(message, {
            color: 'errorRed',
            authorBool: true,
            title: 'Command cancelled',
            description: "Don't like the color? Try again!",
            send: 'channel',
          });

        //Look for color roles in the message author
        if (existingColorRole) {
          await message.member.roles.remove(existingColorRole);
          if (!existingColorRole.members.length)
            await existingColorRole.delete();
        }

        //Look for roles with the same color as the one given
        const roleWithSameColor = await message.guild.roles.cache.find(
          (role) => role.hexColor === color,
        );
        if (roleWithSameColor) {
          await message.member.roles.add(roleWithSameColor);
        } else {
          const colorRole = await message.guild.roles.create({
            data: {
              name: colorName.name + ' | ' + color,
              color: color,
              position: colorRoleLimit.position,
            },
          });
          await message.member.roles
            .add(colorRole)
            .catch(console.error);
        }

        createEmbed(message, {
          color: color,
          authorBool: true,
          title: 'Done!',
          description: 'Your color role is created!',
          send: 'channel',
        });
      })
      .catch(async () => {
        await tempRole.delete();
        createEmbed(message, {
          color: 'errorRed',
          authorBool: true,
          title: 'Whoops!',
          description: 'The time ran out',
          send: 'channel',
        });
      });
  }
}

module.exports = ColorRoleCommand;
