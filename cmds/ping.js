var options = {
    name: "ping",
    description: null, // or "This is a description"
    usage: {
        template: "ping"
    },
    permissions_required: {
        global: {
            user: null, // or ["PERMISSION_CODE"]
            client: null
        },
        channel: {
            user: null,
            client: ["SEND_MESSAGES", "SEND_TTS_MESSAGES"]
        }
    }
}, Discord = require('discord.js');

module.exports = {
    options: options,

    /**
    * @param {Discord.Client} client
    * @param {Discord.Message} message
    * @param {Array} args
    * @param {JSON} lang
    * @param {JSON} cmdlang
    */
    run: async (client, message, args, lang, cmdlang) => {
        message.reply("pong!", { tts: true });
    }
}
