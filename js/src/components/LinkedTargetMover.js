define(function (require){

    var THREE = require('three');


    function LinkedTargetMover(targets, fromIndex) {
        this.targets = targets;
        this.fromIndex = fromIndex || 0;
        this.moveDirection = new THREE.Vector3(0,0,0);
    };

    LinkedTargetMover.prototype.update = function (go, delta) {
        this.currentTarget = this.getTarget();

        if(!this.currentTarget)
            return

        this.moveDirection.subVectors(this.currentTarget.position, go.position);
        go.position.lerp(this.currentTarget.position, 0.1);
        go.rotation = Math.atan2(this.moveDirection.y, this.moveDirection.x);
    }

    LinkedTargetMover.prototype.getTarget = function() {
        for (var i = this.fromIndex; i >= 0; i--) {
            if(this.targets[i].isActive) {
                return this.targets[i];
            }
        };
        return null;
    }

    LinkedTargetMover.prototype.setup = function (go) {}
    LinkedTargetMover.prototype.dispose = function (go) { }
    LinkedTargetMover.prototype.activate = function (go) { }
    LinkedTargetMover.prototype.deactivate = function (go) { }
    LinkedTargetMover.prototype.render = function (go) { }

    return LinkedTargetMover;
})