class Controller {
    constructor() {
        this.status = {};
    }

    set(inputCode, value) {
        this.status[inputCode] = value;
    }

    get(inputCode) {
        return this.status[inputCode] || this.FALSE;
    }

    TRUE = true;
    FALSE = false;
    MOUSE_LEFT = "mouse_left";
    MOUSE_RIGHT = "mouse_right";
    BUTTON_A = 71;
    MOUSE_X = "mouse_x";
    MOUSE_Y = "mouse_y";
    ARROW_UP = "arrow_up";
    ARROW_DOWN = "arrow_down";
    ARROW_LEFT = "arrow_left";
    ARROW_RIGHT = "arrow_right";
}

export default Controller
