# Bot.wssp

This is an open-source discord bot that you can invite and even suggest commands to! Pretty neat huh?

## .env contents

---

### process.env.TOKEN

The token of the bot
Used in [start.js](start.js)

### process.env.YWSSP

The user id of the owner
Used in [start.js](start.js), [ApplyForMod.js](./Commands/Chill-Community-specific/ApplyForMod.js), and every command in [Commands/Suggestions](./Commands/Suggestions)

### process.env.YOUTUBE

The api key of the bot
Used in [Commands/Music/PlayMusic.js](./Commands/Music/PlayMusic.js)

## NPM Packages and services used

---

### Discord

- [Discord.js](https://discord.js.org/#/)
- [discord-akairo](https://discord-akairo.github.io/#/)

### Databases

- [sqlite](https://www.npmjs.com/package/sqlite)
- [Sequelize](https://sequelize.org/)

### Services

- [Glitch](https://glitch.com/)

### Others

- Other npm packages on [package.json](package.json)

## Credits

---

Part of the code of the commands on [Commands/Music](./Commands/Music/) are from [galnir/Master-Bot](https://github.com/galnir/Master-Bot). The code is altered so that it uses [Akairo](https://discord-akairo.github.io/#/)
