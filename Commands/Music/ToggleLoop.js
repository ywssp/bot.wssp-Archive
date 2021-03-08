const { Command, Argument } = require("discord-akairo");
const createEmbed = require("../../Functions/EmbedCreator.js");
const musicCheck = require("../../Functions/MusicCheck.js");

class LoopCommand extends Command {
  constructor() {
    super("loop", {
      aliases: ["loop", "repeat"],
      category: "Music",
      channel: "guild",
    });
  }

  *args(message) {
    const loopType = yield {
      type: /^(track)|(queue)|(off)$/,
      prompt: {
        start: (message) =>
          createEmbed(message, "query", {
            title: "Loop",
            description: `Enter the type of loop that you want\n\`track\`, \`queue\`, \`off\`\nCurrent: ${message.guild.musicData.loop}`,
            authorBool: true,
          }),
      },
    };

    return { loopType };
  }

  exec(message, args) {
    if (musicCheck(message)) return;

    message.guild.musicData.loop = args.loopType.match[0];
    return message.react("🔂");
  }
}

module.exports = LoopCommand;
