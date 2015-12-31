define(function (require) {

    var THREE = require('three');

    function Controller (){
        this.status = {};
    };

    Controller.prototype.set = function (inputCode, value) {
        this.status[inputCode] = value;
    }

    Controller.prototype.get = function (inputCode) {
        return this.status[inputCode] || this.FALSE;
    }

    Controller.prototype.TRUE = true;
    Controller.prototype.FALSE = false;
    Controller.prototype.MOUSE_LEFT = "mouse_left";
    Controller.prototype.MOUSE_RIGHT = "mouse_right";
    Controller.prototype.BUTTON_A = 71;
    Controller.prototype.MOUSE_X = "mouse_x";
    Controller.prototype.MOUSE_Y = "mouse_y";
    Controller.prototype.ARROW_UP = "arrow_up";
    Controller.prototype.ARROW_DOWN = "arrow_down";
    Controller.prototype.ARROW_LEFT = "arrow_left";
    Controller.prototype.ARROW_RIGHT = "arrow_right";

    return Controller;
});