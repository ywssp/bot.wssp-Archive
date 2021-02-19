const { Command , Argument } = require('discord-akairo');
const createEmbed = require('../../Functions/EmbedCreator.js');
const musicCheck = require('../../Functions/MusicCheck.js');

class LoopCommand extends Command {
  constructor() {
    super('loop', {
      aliases: ['loop', 'repeat'],
      category: 'Music',
      args: [
        {
          id: 'loops',
          type: Argument.range('integer', 0, 100, true),
          prompt: {
            start: message =>
              createEmbed(message, {
              title: 'Search',
              color: 'qYellow', 
              description: 'How many times do you want to loop the currently playing song from 1-50?',
              authorBool: true,
           }),
          },
        },
      ],
    });
  }

  exec(message, args) {
    if (musicCheck('boolean', message))
      return musicCheck('embed', message);
    if (args.loops > 50 || args.loops < 1) 
      return createEmbed(message, {
        color: 'eRed',
        authorBool: true,
        title: 'Whoops!',
        description: 'The number you entered is not within range!',
        send: 'channel',
      });
    const loopedSong = message.guild.musicData.nowPlaying;
    loopedSong.requester = message.author.tag;
    for(let i = args.loops; i > 0; i--) {
      message.guild.musicData.queue.unshift(loopedSong);
    }
    return message.react('🔂');
  }
}

module.exports = LoopCommand;
