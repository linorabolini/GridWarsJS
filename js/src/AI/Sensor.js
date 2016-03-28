define(function (require) {

    var Matter = require('matter');
    var _ = require('underscore');

    var Query = Matter.Query,
        Vector = Matter.Vector;

    function Sensor(options) {
        options = options || {};
        this.lenght = options.lenght || 30;
        this.angle = options.angle || 0;
        this.sprite = options.sprite;
    };

    Sensor.prototype.check = function (bodies, body) {
        var endPos = Vector.add(Vector.rotate({x: this.lenght, y:0}, body.angle + this.angle), body.position);
        var query = Query.ray(bodies, endPos, body.position);

        var filter = _.map(query, function (collision) {
            return collision.body != body ? collision.depth : 0;
        });
        var result = _.max(filter);

        if(this.sprite) {
            this.sprite.position = endPos;
            this.sprite.position.y *= -1;
            this.sprite.rotation = body.angle + this.angle;
            this.sprite.size = Math.min( 3, 1 + result/5);
        }

        return result;
    }

    Sensor.prototype.dispose = function () {
        this.sprite.isFree = true;
        this.sprite = null;
    }

    return Sensor;
});