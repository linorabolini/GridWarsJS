define(function (require){

    var THREE = require('three');

    function RandomPointMover(speed, playArea) {
        this.speed = speed || 5;
        this.playArea = playArea;
        this.moveDirection = new THREE.Vector3(0,0,0);
        this.currentTarget = new THREE.Vector3(0,0,0);
    };

    RandomPointMover.prototype.setup = function (go) { }
    RandomPointMover.prototype.update = function (go, delta) {
        go.position.lerp(this.currentTarget, 0.5 * delta);
        
        if(go.position.distanceToSquared(this.currentTarget) < 1) {
            this.updateTargetPoint(go);
        }
    }
    RandomPointMover.prototype.dispose = function (go) { }
    RandomPointMover.prototype.activate = function (go) {
        this.updateTargetPoint(go);
    }
    RandomPointMover.prototype.deactivate = function (go) { }
    RandomPointMover.prototype.render = function (go) { }

    RandomPointMover.prototype.updateTargetPoint = function (go) {
        this.currentTarget.set(this.playArea.getRandomXCoord(), this.playArea.getRandomYCoord(), 0);
        this.moveDirection.subVectors(this.currentTarget, go.position);
        this.moveDirection.clampLength(0, 15);
        this.currentTarget.copy(go.position).add(this.moveDirection);
        go.rotation = Math.atan2(this.moveDirection.y, this.moveDirection.x);
    }

    return RandomPointMover;
})