const { Command } = require('discord-akairo');
const color = require('img-color');
const { adBoard, partnerships } = require('../logChannels.js');
const createEmbed = require('../embedCreator.js');

class AdCommand extends Command {
  constructor() {
    super('advertise', {
      aliases: ['advertise'],
      category: 'Utility',
      args: [
        {
          id: 'invite',
        },
        {
          id: 'description',
          match: 'rest',
        },
        {
          id: 'partner',
          match: 'flag',
          flag: '--partner',
        },
        {
          id: 'partner_claim',
          match: 'flag',
          flag: '--partner-claim',
        },
      ],
    });
  }
  async exec(message, args) {
    let discordInviteRegex = /https:\/\/discord\.gg\/[A-z0-9]{6,7}/.test(
      args.invite
    );
    //if the link is not a server invite or there isnt a link at all
    if (!discordInviteRegex) {
      message.channel.send(
        createEmbed({
          message: message,
          color: '#F44336',
          title: 'Whoops!',
          description: "That isn't a server invite!",
          authorBool: true,
        })
      );
      return message.delete();
    }
    const invite = await this.client.fetchInvite(args.invite);
    const inviteGuildColor = await color.getDominantColor(
      invite.guild.iconURL()
    ).dColor;
    console.log(inviteGuildColor);
    if (!args.partner && !args.partner_claim) {
      if (!invite.temporary) {
        this.client.channels.cache.get(adBoard).send(
          createEmbed({
            message: message,
            color: `#${inviteGuildColor}`,
            title: invite.guild.name,
            thumbnail: invite.guild.iconURL(),
            url: invite.url,
            description: args.description,
            authorBool: true,
          })
        );
      } else {
        message.channel.send(
          createEmbed({
            message: message,
            color: '#F44336',
            title: 'Whoops!',
            description: 'Your invite is not temporary!',
            authorBool: true,
          })
        );
      }
    } else if (args.partner) {
      const memberIsVerified = message.member.roles.cache.some(
        (role) => /Verified/.test(role.name) && !/\./.test(role.name)
      );
      if (memberIsVerified) {
        if (invite.memberCount > 30) {
          if (invite.temporary) {
            const ywssp = this.client.users.cache.get(process.env.YWSSP);
            await ywssp.send('New partnership!\nEmbed view:');
            await ywssp.send(
              createEmbed({
                message: message,
                color: `#${inviteGuildColor}`,
                title: invite.guild.name,
                thumbnail: invite.guild.iconURL(),
                url: invite.url,
                description: args.description,
                authorBool: true,
              })
            );
            await ywssp.send('To claim this partnership, type this:');
            await ywssp.send(
              `y+advertise --partner-claim ${args.invite} ${args.description}`
            );
            message.author.send(
              createEmbed({
                message: message,
                title: 'Done!',
                description:
                  "The partnership isn't done yet, just wait for ywssp to see your request",
                authorBool: true,
              })
            );
          } else {
            message.author.send(
              createEmbed({
                message: message,
                color: '#F44336',
                title: 'Whoops!',
                description: 'Your invite is not permanent!',
                authorBool: true,
              })
            );
          }
        } else {
          message.author.send(
            createEmbed({
              message: message,
              color: '#F44336',
              title: 'Whoops!',
              description: 'Your server has less than 30 members!',
              authorBool: true,
            })
          );
        }
      } else {
        message.channel.send(
          createEmbed({
            message: message,
            color: '#F44336',
            title: 'Whoops!',
            description: 'You need to be verified to request a partnership!',
            authorBool: true,
          })
        );
      }
    } else if (args.partner_claim && message.author.id === process.env.YWSSP) {
      await this.client.channels.cache
        .get(partnerships)
        .send(
          `Hey <@&${message.guild.roles.everyone.id}>! Theres a new partnership!`
        );
      await this.client.channels.cache.get(partnerships).send(
        createEmbed({
          message: message,
          color: `#${inviteGuildColor}`,
          title: invite.guild.name,
          thumbnail: invite.guild.iconURL(),
          url: invite.url,
          description: args.description,
          authorBool: true,
        })
      );
    }
    message.delete();
  }
}

module.exports = AdCommand;
