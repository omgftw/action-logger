module.exports = {
    log: function (text) {
        if (DEBUG_MODE) {
            console.log(text);
        }
    },
    warn: function (text) {
        if (DEBUG_MODE) {
            console.warn(text);
        }
    },
    error: function (text) {
        if (DEBUG_MODE) {
            console.error(text);
        }
    },
}