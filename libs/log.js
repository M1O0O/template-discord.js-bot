const Colors = {};

Colors["%Reset%"] = "\x1b[0m";
Colors["%Under%"] = "\x1b[4m";
Colors["%Reverse%"] = "\x1b[7m";
Colors["%Red%"] = "\x1b[38;2;255;0;0m";
Colors["%Green%"] = "\x1b[38;2;0;255;0m";
Colors["%Yellow%"] = "\x1b[33m";
Colors["%Blue%"] = "\x1b[34m";
Colors["%Magenta%"] = "\x1b[35m";
Colors["%Cyan%"] = "\x1b[36m";
Colors["%White%"] = "\x1b[1m";
Colors["%Orange%"] = "\x1b[38;2;255;150;0m";
Colors["%Violet%"] = "\x1b[38;2;255;0;230m";

/**
*
* @param {String} msg
*/
module.exports = (msg) => {
    msg += "\x1b[0m";
    Object.keys(Colors).forEach(col => {
        msg = msg.replace(new RegExp(col, "g"), Colors[col]);
    });
    console.log(msg);
};
