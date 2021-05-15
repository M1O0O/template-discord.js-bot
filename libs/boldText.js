/**
* @param {String} msg
* @param {String} toSetBold
*/
module.exports = (msg, toSetBold) => {
    return msg.replace(toSetBold, `**${toSetBold}**`);
};
