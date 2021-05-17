/**
* @param {String} msg
* @param {Object} msgToReplace
*/
module.exports = (msg, msgToReplace) => {
    for (const [key, value] of Object.entries(msgToReplace)) {
        msg = msg.replace(key, value);
    }

    return msg;
};