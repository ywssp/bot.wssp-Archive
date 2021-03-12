# Bot.wssp

This is an open-source discord bot. It's written in JavaScript and uses the [discord-akairo](https://discord-akairo.github.io/#/) framework.
This repo is an archive of versions 1.0.0 to 3.1.0 because i filled this repo with unnecessary commits.

## History
- v3.1.0 - The version of this repo
- [v3.0.0](https://github.com/ywssp/bot.wssp/tree/13d7411a923f60e90ecf37a5d7b3e50f300bd6f7) - Revision of music commands
- [v2.1.0](https://github.com/ywssp/bot.wssp/tree/eddb49ab5ab7e3147d912d2dac27f9bfccd1d374) - Addition of trivia.js
- [v2.0.0](https://github.com/ywssp/bot.wssp/tree/8a25d7656d77c06e28a3df23f677fa031c2d7fec) - Resume of updates
- [Updates from 2020](https://github.com/ywssp/bot.wssp/commits/stable?after=07157282b09c39dbec6e1fc92454ee641af46aaa+955&branch=stable)

## .env contents

### process.env.TOKEN

The token of the bot
Used in [start.js](start.js).

### process.env.OWNER

The user id of the owner/s
Used in [start.js](start.js).

### process.env.YOUTUBE

The api key of the bot
Used in [Commands/Music/PlayMusic.js](./Commands/Music/PlayMusic.js).

### process.env.PREFIX

The prefix that the bot uses. Multiple prefixes are seperated using `|`
Used in [start.js](start.js).

your `.env` file should look like this:

```shell
TOKEN=NzIwNjA1ODE4MzgyMzE5Njk4.XuIadw.kjtUXvBOzzTxepM_R3y5eW7mBnc
YOUTUBE=AIzaSyDfNuFz4A8O7oliOGqVdtrJCsjFbYpBqCU
OWNER=689607114011705439
PREFIX='+|!|/'
```

## NPM Packages and services used

### Discord

-   [discord-akairo](https://discord-akairo.github.io/#/)
-   [Discord.js](https://discord.js.org/#/)

### Music Commands

-   [simple-youtube-api](https://www.npmjs.com/package/simple-youtube-api)
-   [ytd-core](https://www.npmjs.com/package/ytdl-core)

### Services

-   [Repl.it](https://repl.it/)

### Others

-   Other npm packages on [package.json](package.json)

## Credits

Part of the code of the commands on [Commands/Music](./Commands/Music/) are from [galnir/Master-Bot](https://github.com/galnir/Master-Bot). The code is altered so that it uses [Akairo](https://discord-akairo.github.io/#/)
