const Discord = require('discord.js');

module.exports = {
    options: {
        name: "ping",
        description: null, // or "This is a description"
        channelAllowed: null, // or ["CHANNEL_ID"]
        usage: {
            template: "ping [message]",
            args: {
                "message": {
                    required: true
                }
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
        message.reply(`Pong!\n${args.message}`);
    }
}
