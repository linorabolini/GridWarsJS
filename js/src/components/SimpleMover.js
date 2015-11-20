define(function (require){

    var THREE = require('three');


    function SimpleMover(speed) {
        this.speed = speed || 40;
        this.moveDirection = new THREE.Vector3(0,0,0);
    };

    SimpleMover.prototype.setup = function (go) { }
    SimpleMover.prototype.update = function (go, delta) {
        go.velocity.add(this.moveDirection);
    }
    SimpleMover.prototype.render = function (go) { }
    SimpleMover.prototype.dispose = function (go) { }
    SimpleMover.prototype.activate = function (go) {
        this.moveDirection.set(Math.cos(go.rotation), Math.sin(go.rotation), 0);
        this.moveDirection.multiplyScalar(this.speed);
    }
    SimpleMover.prototype.deactivate = function (go) { }

    return SimpleMover;
})