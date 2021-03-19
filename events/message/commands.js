var lang = require('../../src/lang.json');

module.exports = (client, message) => {
    if (message.author.bot || message.content.indexOf(client.prefix) !== 0) return;

    var args = message.content.slice(client.prefix.length).trim().split(/ +/g),
        command = args.shift().toLowerCase(),
        cmd = client.commands.get(command);

    if (!cmd) return;
    if (message.channel.type != "text") return;
    if (cmd.options.permission != null && !cmd.options.permission.some(perm => message.member.hasPermission(perm))) return message.reply(client.error(lang.cmds.NotPermit));

    cmd.run(client, message, args, lang, lang.cmds[command]);
}