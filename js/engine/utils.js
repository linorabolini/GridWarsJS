var utils = {};

utils.getRandom = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};

utils.getKeyCode = function (key) {
    var code;

    // override some keys
    switch (key) {
        case 38: // key up
            code = "up";
            break;
        case 40: // key down
            code = "down";
            break;
        case 37: // key left
            code = "left";
            break;
        case 39: // key right
            code = "right";
            break;
        case 32: // key right
            code = "space";
            break;
        default:
            code = String.fromCharCode(key);
    }

    return code;
};

utils.guid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function () {
        return (
            s4() +
            s4() +
            "-" +
            s4() +
            "-" +
            s4() +
            "-" +
            s4() +
            "-" +
            s4() +
            s4() +
            s4()
        );
    };
})();

utils.lerp = function (a, b, c) {
    return (1 - c) * a + b * c;
};

utils.map = function (value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
};

export default utils;
