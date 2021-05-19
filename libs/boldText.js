/**
* @param {String} msg
* @param {any} toSetBold
*/
module.exports = (msg, toSetBold) => {
    if (typeof toSetBold == "object") {
        for (const toSetBoldArray of toSetBold) {
            msg = msg.replace(toSetBoldArray, `**${toSetBoldArray}**`);
        }
    }

    return msg.replace(toSetBold, `**${toSetBold}**`);
};
