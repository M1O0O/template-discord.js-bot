const Discord = require('discord.js');

module.exports = {
    options: {
        name: "ping",
        description: null, // or "This is a description"
        channelAllowed: null, // or ["CHANNEL_ID"]
        usage: {
            template: "ping [arg1] [arg2]",
            args: {
                "arg1": {
                    required: true
                },
                "arg2": {
                    required: true
                },
            }
        },
        permissions_required: {
            global: {
                user: null, // or ["PERMISSION_CODE"]
                client: null
            },
            channel: {
                user: null,
                client: ["SEND_MESSAGES"]
            }
        }
    },

    /**
    * @param {Discord.Client} client
    * @param {Discord.Message} message
    * @param {Array} args
    * @param {JSON} lang
    * @param {JSON} cmdlang
    */
    run: async (client, message, args, lang, cmdlang) => {
        message.reply(`Pong!\nArg1: ${args.arg1}\nArg2: ${args.arg2}`);
    }
}
