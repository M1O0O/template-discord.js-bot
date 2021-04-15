var options = {
    name: "🌍 ping",
    description: null, // or "This is a description"
    usage: {
        template: "ping"
    },
    permission: null // or ["PERMISSION_CODE"]
};

module.exports = {
    options: options,

    run: async (client, message, args, lang, cmdlang) => {
        message.reply(cmdlang.ping);
    }
}