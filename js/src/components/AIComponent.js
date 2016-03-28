define(function (require) {

    var _ = require('underscore');
    var Matter = require('matter');

    function AIComponent(world, sensors) {
        this.world = world;
        this.sensors = sensors || [];
    };

    AIComponent.prototype.setup = function (go) { }
    AIComponent.prototype.render = function (go) { }
    AIComponent.prototype.activate = function (go) { }
    AIComponent.prototype.deactivate = function (go) { }
    AIComponent.prototype.update = function (go, delta) {
        var bodies = Matter.Composite.allBodies(this.world);

        var results = _.map(this.sensors, function(sensor) {
            return sensor.check(bodies, go.body);
        });
    }
    AIComponent.prototype.dispose = function (go) {
        this.sensors = null;
    }

    return AIComponent;
});