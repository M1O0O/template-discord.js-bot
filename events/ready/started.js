const Discord = require('discord.js')
/**
* @param {Discord.Client} client
*/
module.exports = (client) => {
    client.libs.log(`%Reset%[%Green%Discord%Reset%] - connected as %Green%${client.user.tag}`);
}