import utils from "../utils";
import _ from "lodash";

class KeyboardController {
    constructor(keyMap) {
        // generate a keymap to change controllers
        this.keyMap = keyMap || {};

        // generate a unique id for this input source
        this.id = "keyboard" + utils.guid();
    }

    configure(input, id) {
        //store the internal source id
        this.internalSourceId = id;

        // handle the key events and avoid
        // repeated events
        const keyEvent = event => {
            if (event.repeat) {
                return;
            }

            var key = this.keyMap[event.keyCode];

            if (_.isUndefined(key)) {
                return;
            }

            var data = {};
            data[key] = event.type === "keydown" ? 1 : 0;

            var message = {
                id: id,
                data: data,
            };

            input.trigger("input", message);
        };

        window.addEventListener("keydown", keyEvent);
        window.addEventListener("keyup", keyEvent);
    }
}

export default KeyboardController;
