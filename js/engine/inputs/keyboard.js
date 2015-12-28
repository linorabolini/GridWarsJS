define(function (require) {
    'use strict';

    var utils = require('utils');

    function KeyboardController (keyMap) {
        // generate a keymap to change controllers
        this.keyMap = keyMap || {};

        // generate a unique id for this input source
        this.id = "keyboard" + utils.guid();
    };

    KeyboardController.prototype.configure = function (input, id) {
        var scope = this;

        //store the internal source id 
        this.internalSourceId = id;

        // handle the key events and avoid
        // repeated events
        function keyEvent(event) {
            if (event.repeat) {
                return;
            }

            var data = { 
                id: id,
                value: event.type === "keydown" ? 1 : 0,
                code: scope.keyMap[event.keyCode],
                type: "key"
            };

            input.trigger("input", data);
        }

        window.addEventListener("keydown", keyEvent);
        window.addEventListener("keyup", keyEvent);
    }

    return KeyboardController;
});