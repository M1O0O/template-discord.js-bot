/**
* @param {String} msg
* @param {Object} toSetBold
*/
module.exports = (msg, args) => {
    for (const toSetRequired of args) {
        msg = msg.replace(toSetRequired, `${toSetRequired}*`);
    }

    return msg
};
