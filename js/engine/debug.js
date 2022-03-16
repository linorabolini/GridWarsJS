const config = require("config");
const debug = function () {
    if (!config.debug) return;
    var i;
    console.log("===== DEBUG ======");
    for (i in arguments) {
        console.log(arguments[i]);
    }
};

export default debug;
