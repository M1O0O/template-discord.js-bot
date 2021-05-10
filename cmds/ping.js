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
};

module.exports = {
    options: options,

    run: async (client, message, args, lang, cmdlang) => {
        message.reply("/tts sdgdfg");
    }
}