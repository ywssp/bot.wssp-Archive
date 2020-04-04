const { Listener } = require('discord-akairo');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        console.log('bot.wssp is now running!\nIt should respond to commands now...\n\n==========\n');
        this.client.user.setActivity('Development is on break | y+help');
    }
}

module.exports = ReadyListener;