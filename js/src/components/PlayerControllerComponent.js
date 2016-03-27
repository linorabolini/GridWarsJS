define(function (require) {

    var Vector = require('matter').Vector;
    var Body = require('matter').Body;

    function PlayerController(controller) {
        this.controller = controller;
        this.vector = Vector.create(0,0);
        // TODO: move this to a mover
        this.speed = 5;
    };

    PlayerController.prototype.setup = function (go){}
    PlayerController.prototype.dispose = function (go){}
    PlayerController.prototype.activate = function (go){}
    PlayerController.prototype.deactivate = function (go){}
    PlayerController.prototype.render = function (go){}
    PlayerController.prototype.update = function (go, delta)
    {
        this.vector.x = this.controller.get("ARROW_RIGHT") - this.controller.get("ARROW_LEFT");
        this.vector.y = this.controller.get("ARROW_DOWN") - this.controller.get("ARROW_UP");

        // TODO: move this to a mover
        Vector.normalise(this.vector);
        this.vector = Vector.mult(this.vector, this.speed * delta);
        if(Vector.magnitudeSquared(this.vector) != 0) {
            // Body.applyForce(go.body, {x:0, y:0}, this.vector);
            Body.setVelocity(go.body, Vector.add(go.body.velocity, this.vector));
            Body.setAngle(go.body, Math.atan2(-this.vector.y, this.vector.x));
        }
    }

    return PlayerController;
});