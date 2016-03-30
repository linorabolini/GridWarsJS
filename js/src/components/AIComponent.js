define(function(require) {

    var _ = require('underscore');
    var Matter = require('matter');

    function AIComponent(world, sensors) {
        this.world = world;
        this.sensors = sensors || [];
        this.bounds = Matter.Bounds.create([{
            x: -100,
            y: -100
        }, {
            x: 100,
            y: 100
        }]);
        this.time = 0.0;
    };

    AIComponent.prototype.setup = function(go) {}
    AIComponent.prototype.render = function(go) {}
    AIComponent.prototype.activate = function(go) {}
    AIComponent.prototype.deactivate = function(go) {}
    AIComponent.prototype.update = function(go, delta) {
        Matter.Bounds.shift(this.bounds, Matter.Vector.add(go.body.position, {
            x: -100,
            y: -100
        }));

        var wbodies = Matter.Composite.allBodies(this.world);
        var bodies = Matter.Query.region(wbodies, this.bounds);

        this.time += delta;
        var time = this.time;
        var results = _.map(this.sensors, function(sensor) {
            sensor.angle = Math.cos(time * 10) * sensor.direction;
            return sensor.check(bodies, go.body);
        });
    }
    AIComponent.prototype.dispose = function(go) {
        this.sensors = null;
    }

    return AIComponent;
});