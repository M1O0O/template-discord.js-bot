var options = {
    name: "🌍 ping",
    description: null,
    usage: {
        template: "ping"
    },
    permission: null
};

module.exports = {
    options: options,

    run: async (client, message, args, lang, cmdlang) => {
        message.reply(cmdlang.ping);
    }
}