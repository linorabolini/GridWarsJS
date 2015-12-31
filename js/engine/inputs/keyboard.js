define(function (require) {
    'use strict';

    var utils = require('utils');
    var _     = require('underscore');

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

            var key = scope.keyMap[event.keyCode];

            if(_.isUndefined(key)) {
                return;
            }

            var data = {};
            data[key] = event.type === "keydown" ? 1 : 0;

            var message = { 
                id: id,
                data: data
            };

            input.trigger("input", message);
        }

        window.addEventListener("keydown", keyEvent);
        window.addEventListener("keyup", keyEvent);
    }

    return KeyboardController;
});