const { Command } = require('discord-akairo');
const color = require('img-color');
const createEmbed = require('../../Functions/EmbedCreator.js');

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
    if (message.guild.ownerID !== process.env.YWSSP) return;
    let discordInviteRegex = /https:\/\/discord\.gg\/[A-z0-9]{6,7}/.test(
      args.invite
    );
    //if the link is not a server invite or there isnt a link at all
    if (!discordInviteRegex) {
      createEmbed(message, {
        color: 'errorRed',
        title: 'Whoops!',
        description: "That isn't a server invite!",
        authorBool: true,
        send: 'channel',
      });
      return message.delete();
    }
    const invite = await this.client.fetchInvite(args.invite);
    const inviteGuildColor = await color.getDominantColor(
      invite.guild.iconURL()
    ).dColor;
    console.log(inviteGuildColor);
    if (!args.partner && !args.partner_claim) {
      if (!invite.temporary) {
        this.client.channels.cache.get(process.env.ADVERTISEMENTS).send(
          createEmbed(message, {
            color: `#${inviteGuildColor}`,
            title: invite.guild.name,
            thumbnail: invite.guild.iconURL(),
            url: invite.url,
            description: args.description,
            authorBool: true,
          })
        );
      } else {
        createEmbed(message, {
          color: 'errorRed',
          title: 'Whoops!',
          description: 'Your invite is not temporary!',
          authorBool: true,
          send: 'channel',
        });
      }
    } else if (args.partner) {
      const memberIsVerified = message.member.roles.cache.some(
        (role) => /Verified/.test(role.name) && !/- .* -/.test(role.name)
      );
      if (memberIsVerified) {
        if (invite.memberCount > 30) {
          if (invite.temporary) {
            const ywssp = this.client.users.cache.get(process.env.YWSSP);
            await ywssp.send('New partnership!\nEmbed view:');
            await ywssp.send(
              createEmbed(message, {
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
            createEmbed(message, {
              title: 'Done!',
              description:
                "The partnership isn't done yet, just wait for ywssp to see your request",
              authorBool: true,
              send: 'author',
            });
          } else {
            createEmbed(message, {
              color: 'errorRed',
              title: 'Whoops!',
              description: 'Your invite is not permanent!',
              authorBool: true,
              send: 'author',
            });
          }
        } else {
          createEmbed(message, {
            color: 'errorRed',
            title: 'Whoops!',
            description: 'Your server has less than 30 members!',
            authorBool: true,
            send: 'author',
          });
        }
      } else {
        createEmbed(message, {
          color: 'errorRed',
          title: 'Whoops!',
          description: 'You need to be verified to request a partnership!',
          authorBool: true,
          send: 'channel',
        });
      }
    } else if (args.partner_claim && message.author.id === process.env.YWSSP) {
      await this.client.channels.cache
        .get(process.env.partners)
        .send(
          `Hey <@&${message.guild.roles.everyone.id}>! Theres a new partnership!`
        );
      await this.client.channels.cache.get(process.env.partners).send(
        createEmbed(message, {
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
