const { Command } = require('discord-akairo');
const convertCssColorNameToHex = require('convert-css-color-name-to-hex');
const createEmbed = require('../embedCreator.js');
const stringSimilarity = require('string-similarity');
const { isColorName, isHexColor } = require('css-color-checker');

class RoleCommand extends Command {
  constructor() {
    super('customrole', {
      aliases: ['customrole'],
      category: 'Utility',
    });
  }

  *args() {
    let color, name;
    const flag = yield { type: 'string' };
    if (flag === '--create') {
      color = yield {
        type: 'string',
        prompt: {
          start: (message) =>
            createEmbed({
              message: message,
              title: 'Color',
              description:
                'Enter a color, preferably a hex code from the site [HTML Color Codes](https://htmlcolorcodes.com/) or a color name on [w3schools](https://www.w3schools.com/colors/colors_names.asp)',
              fields: [{ name: 'Example', value: '```#139FE4\nAlice Blue```' }],
              authorBool: true,
            }),
        },
      };
      name = yield {
        type: 'string',
        prompt: {
          start: (message) =>
            createEmbed({
              message: message,
              title: 'Name',
              description: 'Enter the name for the role',
              fields: [{ name: 'Example', value: '```Role name```' }],
              authorBool: true,
            }),
        },
      };
    }
    return { flag, name, color };
  }

  async exec(message, args) {
    const existingCustomRole = message.member.roles.cache.find((role) =>
      /- .+ -/.test(role.name)
    );
    const customRoleLimit = message.guild.roles.cache.find(
      (role) => role.name === '- Custom Role Limit -'
    );
    const customRoleLog = message.guild.channels.cache.find(
      (channel) => channel.name === 'role-log'
    );
    if (args.flag === '--remove') {
      if (existingCustomRole) {
        await customRoleLog.send(
          createEmbed({
            message: message,
            color: existingCustomRole.color,
            title: 'Removed a custom role',
            fields: [
              { name: 'Role name', value: existingCustomRole.name },
              { name: 'Role color', value: existingCustomRole.color },
            ],
            authorBool: true,
          })
        );
        await message.channel.send(
          createEmbed({
            message: message,
            color: existingCustomRole.color,
            title: 'Done!',
            description: `Removed your custom role '<@&${existingCustomRole.id}> | ${existingCustomRole.name}'`,
            authorBool: true,
          })
        );
        return existingCustomRole.delete();
      }
      return message.channel.send(
        createEmbed({
          message: message,
          color: '#F44336',
          title: 'Whoops!',
          description: "You don't even have a custom role!",
          authorBool: true,
        })
      );
    } else if (args.flag === '--create') {
      let roleColor = args.color.toLowerCase().replace(/\s/, '');
      const roleName = args.name;
      let roleData = {
        data: {
          name: `- ${roleName} -`,
          position: customRoleLimit.position - 1,
        },
      };
      const highRoles = message.guild.roles.cache.filter(
        (role) => role.position > message.member.roles.highest.position
      );
      const imitateBoolean = highRoles.some(
        (role) =>
          stringSimilarity.compareTwoStrings(
            role.name.toLowerCase().replace(/\s/, ''),
            roleName.toLowerCase().replace(/\s/, '')
          ) > 0.85
      );
      if (imitateBoolean) {
        return message.channel.send(
          createEmbed({
            message: message,
            color: '#F44336',
            title: 'Whoops!',
            description: "You can't make a custom role to imitate other roles!",
            authorBool: true,
          })
        );
      }
      if (isColorName(roleColor) && !isHexColor(roleColor)) {
        roleData[data][color] = convertCssColorNameToHex(roleColor);
      }
      let role = await message.guild.roles.create(roleData);
      await message.member.roles.add(role).catch(console.error);
      message.channel.send(
        createEmbed({
          message: message,
          color: roleColor,
          title: 'There! Made your custom role for you.',
          description: `Your custom role is <@&${role.id}> | ${role.name}`,
          authorBool: true,
        })
      );
      if (existingCustomRole) {
        await customRoleLog.send(
          createEmbed({
            message: message,
            color: existingCustomRole.color,
            title: 'Replaced a custom role',
            fields: [
              { name: 'Old role name', value: existingCustomRole.name },
              { name: 'Old role color', value: existingCustomRole.color },
            ],
            authorBool: true,
          })
        );
        await existingCustomRole.delete();
      }
      return customRoleLog.send(
        createEmbed({
          message: message,
          color: roleColor,
          title: 'Created a custom role',
          fields: [
            { name: 'Role name', value: roleName },
            { name: 'Role color', value: roleColor },
          ],
          authorBool: true,
        })
      );
    } else {
      return message.channel.send(
        createEmbed({
          message: message,
          color: '#F44336',
          title: 'Whoops!',
          description: "You didn't input any flags!",
          authorBool: true,
        })
      );
    }
  }
}

module.exports = RoleCommand;
