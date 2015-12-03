define(function (require){

    var THREE = require('three');

    function RandomPointMover(speed, playArea, isInfinite) {
        this.speed = speed || 5;
        this.playArea = playArea;
        this.isInfinite = isInfinite;
        this.moveDirection = new THREE.Vector3(0,0,0);
        this.currentTarget = new THREE.Vector3(0,0,0);
    };

    RandomPointMover.prototype.setup = function (go) { }
    RandomPointMover.prototype.update = function (go, delta) {
        this.moveDirection.subVectors(this.currentTarget, go.position).multiplyScalar(0.5).clampLength(0, this.speed);
        go.velocity.add(this.moveDirection);

        go.rotation = Math.atan2(this.moveDirection.y, this.moveDirection.x);
        
        if(go.position.distanceToSquared(this.currentTarget) < this.speed) {
            if(this.isInfinite) {
                this.updateTargetPoint(go);
            } else {
                go.deactivate();
            }
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
    }

    return RandomPointMover;
})