const { Command } = require('discord-akairo');
const createEmbed = require('../../../Functions/EmbedCreator.js');
var CryptoJS = require('crypto-js');

class UnoSettingsCommand extends Command {
  constructor() {
    super('unosettings', {
      aliases: ['unosettings'],
      category: 'Uno',
    });
  }

  async exec(message) {
    //The settings that are used for the code
    let unoData = {
      deck,
      draw_4,
      draw_stack: 'off',
      hide_card_no,
      win_con,
      win_con_limit,
      turn_time,
      wait_time,
      turn_time_action,
    };
    //The strings that are used for the final embed
    let unoSettings = {
      deck: ['UNO', 'UNO Mod', 'UNO Flip'],
      draw_4: [
        'Draw 4 Plays can be challenged',
        'Illegal Draw 4 plays disabled',
        'Illegal Draw 4 plays enabled',
      ],
      draw_stack: [
        'Turned off',
        'Different cards allowed',
        'Draw 2s only',
      ],
      hide_card_no: ['Shown', 'Hidden'],
      win_con: [
        'Win amount',
        'Most wins',
        'Score amount [Default]',
        'Score amount [Inverted]',
        'Score amount [Most]',
        'Score amount [Least]',
      ],
      win_con_limit: ['Score cap', 'Rounds', 'Wins needed'],
      turn_time_action: ['Draw card', 'Play random card'],
    };

    createEmbed(message, {
      color: 'defaultBlue',
      authorBool: true,
      description:
        'Every prompt has a timer of 60 seconds and will automatically pick the default when the time is up.',
      send: true,
    });

    //Deck
    {
      const deckEmbed = createEmbed(message, {
        color: 'defaultBlue',
        authorBool: true,
        title: 'Deck',
        description: 'Pick a deck to use using the reactions below',
        fields: [
          {
            name: '◻️ | Original (Default)',
            value:
              'Use the original UNO deck\n[Rules](https://www.ultraboardgames.com/uno/game-rules.php)',
          },
          {
            name: 'Ⓜ️ | Mod',
            value:
              'Use the Mod variant of the deck\n[Rules](https://www.ultraboardgames.com/uno/mod-game-rules.php)',
          },
          {
            name: '🔄 | Flip',
            value:
              'Use the Flip variant of the deck\n[Rules](https://www.ultraboardgames.com/uno/flip-game-rules.php)',
          },
        ],
        send: true,
      });
      ['◻️', 'Ⓜ️', '🔄'].forEach(
        async (emoji) => await deckEmbed.react(emoji),
      );
      let deckReaction;
      try {
        deckReaction = await deckEmbed.awaitReactions(
          (reaction, user) => {
            return (
              ['◻️', 'Ⓜ️', '🔄'].some(
                (emoji) => reaction.emoji.name === emoji,
              ) && user.id === message.author.id
            );
          },
          {
            max: 1,
            time: 60000,
            errors: ['time'],
          },
        );
      } catch (e) {
        deckReaction = '◻️';
      }
      deckReaction = deckReaction.first().emoji.name;
      deckReaction = ['◻️', 'Ⓜ️', '🔄'].indexOf(deckReaction);
      unoData.deck = ['orig', 'mod', 'flip'][deckReaction];
      unoSettings.deck = unoSettings.deck[deckReaction];
      deckEmbed.delete();
    }

    //+4
    {
      const draw4Embed = createEmbed(message, {
        color: 'defaultBlue',
        authorBool: true,
        title: 'Draw 4',
        description:
          'Pick the rules to use for the Wild Draw 4 card\n\nDraw 4s can only be played when the player does not have a card with the same color as the card on top of the discard pile. \
If the next player suspects that the player has a card with the same color as the one in the discard pile, then they can challenge the player of the Wild Draw 4. If the challenge is correct, then the player draws 4 cards. \
If the challenge is wrong, then the challenger draws the 4 cards in the card, plus an additional 2 cards.',
        fields: [
          {
            name: '⛔️ | With challenging (Default)',
            value:
              'Enable challenging. Challenging can be done on the wait time after a player plays a Wild Draw 4 card',
          },
          {
            name: '❌ | Disable illegal Draw 4s',
            value:
              "Remove challenging and don't allow illegal Draw 4s",
          },
          {
            name: '✅ | Enable illegal Draw 4s',
            value: 'Remove challenging and allow illegal Draw 4s',
          },
        ],
        send: true,
      });
      ['⛔️', '❌', '✅'].forEach(
        async (emoji) => await draw4Embed.react(emoji),
      );
      let draw4Reaction;
      try {
        draw4Reaction = await draw4Embed.awaitReactions(
          (reaction, user) => {
            return (
              ['⛔️', '❌', '✅'].some(
                (emoji) => reaction.emoji.name === emoji,
              ) && user.id === message.author.id
            );
          },
          {
            max: 1,
            time: 60000,
            errors: ['time'],
          },
        );
      } catch (e) {
        draw4Reaction = '⛔️';
      }
      draw4Reaction = draw4Reaction.first().emoji.name;
      draw4Reaction = ['⛔️', '❌', '✅'].indexOf(draw4Reaction);
      unoData.draw_4 = ['challenge', 'disable', 'enable'][
        draw4Reaction
      ];
      unoSettings.draw_4 = unoSettings.draw_4[draw4Reaction];
      draw4Embed.delete();
    }

    //Modifications
    {
      const modEmbed = createEmbed(message, {
        color: 'defaultBlue',
        authorBool: true,
        title: 'Mods',
        description: 'Pick the modifiers to use, then react ✅',
        fields: [
          {
            name: '➕ | Allow draw stacking (different cards)',
            value:
              'Enable draw stacking\nEx.```P1 plays a Yellow Draw 2\nP2 plays a Green Draw 2 to avoid drawing 2 cards\nP3 draws the cards from both P1 and P2 / draws 4 cards```Different cards can be stacked\nEx. playing a Wild Draw 4 on top of a Blue Draw 2\nChallenging, if enabled,  will end the stack chain\nEx.\nIf the challenge is correct, then the player that played the Wild Draw 4 will draw 4 cards + the 2 cards that accumulated\nIf the challenge is wrong, then the challenger will draw 4 + 2 cards, plus the 2 cards that accumulated',
          },
          {
            name: '2️⃣ | Allow draw stacking (Draw 2 only)',
            value:
              'The same as above, but stacking different cards arent allowed',
          },
          {
            name: '🛎 | Disable card no. announcing',
            value:
              "The game will no longer show a player's amount of cards after finishing a turn. This is *much* harder because the players will need to keep track of their opponents cards ",
          },
          {
            name: '✅ | Confirm',
            value: 'Confirm your selection',
          },
        ],
        send: true,
      });
      ['➕', '2️⃣', '🛎', '✅'].forEach(
        async (emoji) => await modEmbed.react(emoji),
      );
      try {
        await modEmbed.awaitReactions(
          (reaction, user) => {
            return (
              reaction.emoji.name === '✅' &&
              user.id === message.author.id
            );
          },
          {
            max: 1,
            time: 60000,
            errors: ['time'],
          },
        );
        const mods = modEmbed.reactions.cache
          .filter(
            (reaction) =>
              ['➕', '2️⃣', '🛎'].some(
                (emoji) => reaction.emoji.name === emoji,
              ) &&
              reaction.users.cache.some(
                (user) => user === message.author,
              ),
          )
          .map((reaction) => reaction.emoji.name);
        mods.each((emoji) => {
          if (emoji === '➕' && unoData.draw_stack === false) {
            unoData.draw_stack = '2and4';
            unoSettings.draw_stack = unoSettings.draw_stack[1];
          } else if (emoji === '2️⃣' && unoData.draw_stack === false) {
            unoData.draw_stack = 'draw2';
            unoSettings.draw_stack = unoSettings.draw_stack[2];
          } else if (emoji === '🛎') {
            unoData.hide_card_no = true;
            unoSettings.hide_card_no = unoSettings.hide_card_no[1];
          }
        });
        if (typeof unoSettings.draw_stack === 'array') {
          unoSettings.draw_stack = unoSettings.draw_stack[0];
        }
        if (typeof unoSettings.hide_card_no === 'array') {
          unoSettings.hide_card_no = unoSettings.hide_card_no[0];
        }
      } catch (e) {
        createEmbed(message, {
          color: 'errorRed',
          authorBool: true,
          description: 'No modifications were saved',
          send: true,
        });
      }
      modEmbed.delete();
    }

    //Win condition
    {
      const winConditionEmbed = createEmbed(message, {
        color: 'defaultBlue',
        authorBool: true,
        title: 'Win condition',
        description: 'Select a win condition to use below',
        fields: [
          {
            name: '💠 | Win count (Default)',
            value:
              'The first player to win a certain amount of rounds wins the game',
          },
          {
            name: '🔢 | Most wins',
            value:
              'The player with the most wins after a certain amount of rounds wins the game',
          },
          {
            name: '⬆️ | Score count [Default]',
            value:
              'The first player to reach a certain amount of points wins the game.\nPoints are awarded to the winner of the round',
          },
          {
            name: '⬇️ | Score count [Inverted]',
            value:
              'The player with the least amount of points after a player reaches the score limit wins the game.\nPoints are awarded to the losing players',
          },
          {
            name: '➡️ | Score count [Most points]',
            value:
              'The player with the most points after a certain amount of rounds wins the game.\nPoints are awarded to the winner of the round',
          },
          {
            name: '⬅️ | Score count [Least points]',
            value:
              'The player with the least points after a certain amount of rounds wins the game.\nPoints are awarded to the losing players',
          },
        ],
        send: true,
      });
      ['💠', '🔢', '⬆️', '⬇️', '➡️', '⬅️'].forEach(
        async (emoji) => await winConditionEmbed.react(emoji),
      );
      let winConditionReaction;
      try {
        winConditionReaction = await winConditionEmbed.awaitReactions(
          (reaction, user) => {
            return (
              ['💠', '🔢', '⬆️', '⬇️', '➡️', '⬅️'].some(
                (emoji) => reaction.emoji.name === emoji,
              ) && user.id === message.author.id
            );
          },
          {
            max: 1,
            time: 60000,
            errors: ['time'],
          },
        );
      } catch (e) {
        winConditionReaction = '💠';
      }
      winConditionReaction = winConditionReaction.first().emoji.name;
      winConditionReaction = [
        '💠',
        '🔢',
        '⬆️',
        '⬇️',
        '➡️',
        '⬅️',
      ].indexOf(winConditionReaction);
      unoData.win_con = [
        'winam',
        'mostwin',
        'scorehigh',
        'scorelow',
        'scoremost',
        'scoreleast',
      ][winConditionReaction];
      unoSettings.win_con = unoSettings.win_con[winConditionReaction];
      winConditionEmbed.delete();
    }

    //win condition limits
    {
      //score limit
      if (
        unoData.win_con === 'scorehigh' ||
        unoData.win_con === 'scorelow'
      ) {
        const scoreLimitEmbed = createEmbed(message, {
          color: 'defaultBlue',
          authorBool: true,
          title: 'Score cap',
          description: `Enter the score cap to use. The default is 500 points
Range: 300 - 1000

Score table:
Number cards = number written in the card
Draw 1(UNO Flip) = 10 points
Skip, Reverse, Draw 2(UNO, UNO Mod), Draw 5(UNO Flip), Flip(UNO Flip) = 20 points
Skip Everyone = 30 points
Wild Card(UNO Flip) = 40
Wild Card(UNO, UNO Mod), Wild Draw 4, Wild Draw 2(UNO Flip) Wild Mod(UNO Mod) = 50
Wild Draw Color(UNO Flip) = 60`,
          send: true,
        });
        let scoreLimitMessage;
        try {
          scoreLimitMessage = message.channel.awaitMessages(
            function (msg) {
              return msg.content >= 300 && msg.content <= 1000;
            },
            {
              max: 1,
              time: 60000,
              errors: ['time'],
            },
          ).content;
        } catch (e) {
          scoreLimitMessage = 500;
        }
        unoData.win_con_limit = scoreLimitMessage;
        unoSettings.win_con_limit = unoSettings.win_con_limit[0];
        scoreLimitMessage.delete();
      }
      //round limit
      else if (
        unoData.win_con === 'mostwin' ||
        unoData.win_con === 'scoremost' ||
        unoData.win_con === 'scoreleast'
      ) {
        const roundLimitEmbed = createEmbed(message, {
          color: 'defaultBlue',
          authorBool: true,
          title: 'Round limit',
          description: `Enter the round limit to use. The default is 3 rounds\nRange: 1 - 10`,
          send: true,
        });
        let roundLimitMessage;
        try {
          roundLimitMessage = message.channel.awaitMessages(
            function (msg) {
              return msg.content >= 1 && msg.content <= 10;
            },
            {
              max: 1,
              time: 60000,
              errors: ['time'],
            },
          ).content;
        } catch (e) {
          roundLimitMessage = 3;
        }
        unoData.win_con_limit = roundLimitMessage;
        unoSettings.win_con_limit = unoSettings.win_con_limit[1];
        roundLimitEmbed.delete();
      }
      //win limit
      else if (unoData.win_con === 'winam') {
        const winLimitEmbed = createEmbed(message, {
          color: 'defaultBlue',
          authorBool: true,
          title: 'Win limit',
          description: `Enter the win limit to use. The default is 2 wins\nRange: 1 - 5`,
          send: true,
        });
        let winLimitMessage;
        try {
          winLimitMessage = message.channel.awaitMessages(
            function (msg) {
              return msg.content >= 1 && msg.content <= 5;
            },
            {
              max: 1,
              time: 60000,
              errors: ['time'],
            },
          ).content;
        } catch (e) {
          winLimitMessage = 2;
        }
        unoData.win_con_limit = winLimitMessage;
        unoSettings.win_con_limit = unoSettings.win_con_limit[2];
        winLimitEmbed.delete();
      }
    }

    //Turn time
    {
      const timeLimitEmbed = createEmbed(message, {
        color: 'defaultBlue',
        authorBool: true,
        title: 'Turn time',
        description: `Enter the time of each turn in seconds. Default is 10\nRange: 5 - 30`,
        send: true,
      });
      let timeLimitMessage;
      try {
        timeLimitMessage = message.channel.awaitMessages(
          function (msg) {
            return msg.content >= 5 && msg.content <= 30;
          },
          {
            max: 1,
            time: 60000,
            errors: ['time'],
          },
        ).content;
      } catch (e) {
        timeLimitMessage = 10;
      }
      unoData.turn_time = timeLimitMessage;
      timeLimitEmbed.delete();
    }

    //Wait time
    {
      const waitTimeEmbed = createEmbed(message, {
        color: 'defaultBlue',
        authorBool: true,
        title: 'Wait time',
        description: `Enter the time between each turn in seconds. This is the time where a player can challenge or catch another player. Default is 5\nRange: 5 - 15`,
        send: true,
      });
      let waitTimeMessage;
      try {
        waitTimeMessage = message.channel.awaitMessages(
          function (msg) {
            return msg.content >= 5 && msg.content <= 15;
          },
          {
            max: 1,
            time: 60000,
            errors: ['time'],
          },
        ).content;
      } catch (e) {
        waitTimeMessage = 5;
      }
      unoData.wait_time = waitTimeMessage;
      waitTimeEmbed.delete();
    }

    //AFK action
    {
      const afkEmbed = createEmbed(message, {
        color: 'defaultBlue',
        authorBool: true,
        title: 'AFK Action',
        description:
          "Pick the action to do when a player's time is up",
        fields: [
          {
            name: '⤵️ | Draw card (Default)',
            value: 'Draw a card from the deck',
          },
          {
            name: '⬆️ | Play random card',
            value: "Play a random card in the player's hand",
          },
        ],
        send: true,
      });
      ['⤵️', '⬆️'].forEach(
        async (emoji) => await afkEmbed.react(emoji),
      );
      let afkReaction;
      try {
        afkReaction = await afkEmbed.awaitReactions(
          (reaction, user) => {
            return (
              ['⤵️', '⬆️'].some(
                (emoji) => reaction.emoji.name === emoji,
              ) && user.id === message.author.id
            );
          },
          {
            max: 1,
            time: 60000,
            errors: ['time'],
          },
        );
      } catch (e) {
        afkReaction = '⤵️';
      }
      afkReaction = afkReaction.first().emoji.name;
      afkReaction = ['⤵️', '⬆️'].indexOf(afkReaction);
      unoData.turn_time_action = ['draw', 'play'][afkReaction];
      unoSettings.turn_time_action =
        unoSettings.turn_time_action[afkReaction];
      afkEmbed.delete();
    }
    const unencodedCode = `DECK:${unoData.deck}|DRAWFOUR:${unoData.draw_4}|STACK:${unoData.draw_stack}|HIDENO:${unoData.hide_card_no}|WINCON:${unoData.win_con}|LIMIT:${unoData.win_con_limit}|TURNT:${unoData.turn_time}|WAITT:${unoData.wait_time}|AFK:${unoData.turn_time_action}`;
    const encodedCode = CryptoJS.AES.encrypt(
      unencodedCode,
      process.env.UNOENCODE,
    ).toString();
    await createEmbed(message, {
      color: 'successGreen',
      authorBool: true,
      title: 'Done!',
      description: 'The settings key was successfully created',
      fields: [
        { name: 'Deck', value: unoSettings.deck },
        { name: 'Wild Draw 4 rules', value: unoSettings.draw_4 },
        { name: 'Draw card stacking', value: unoSettings.draw_stack },
        {
          name: 'Card no. visibility',
          value: unoSettings.hide_card_no,
        },
        { name: 'Win condition', value: unoSettings.win_con_limit },
        {
          name: unoSettings.win_con_limit,
          value: unoData.win_con_limit,
        },
        { name: 'Turn time', value: unoData.turn_time },
        { name: 'Wait time', value: unoData.wait_time },
        { name: 'AFK Action', value: unoSettings.turn_time_action },
      ],
      send: true,
    });
    await message.channel.send('Settings key: ');
    message.channel.send(encodedCode);
  }
}

module.exports = UnoSettingsCommand;
