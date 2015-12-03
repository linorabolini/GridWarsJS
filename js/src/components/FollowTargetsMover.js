define(function (require){

    var THREE = require('three');


    function FollowTargetsMover(speed, targets) {
        this.speed = speed || 5;
        this.targets = targets;
        this.moveDirection = new THREE.Vector3(0,0,0);
        this.currentTarget = null;
    };

    FollowTargetsMover.prototype.setup = function (go) {

    }
    FollowTargetsMover.prototype.update = function (go, delta) {
        this.currentTarget = this.getTarget();

        if(!this.currentTarget)
            return

        this.moveDirection.copy(this.currentTarget.position)
            .sub(go.position)
            .setLength(this.speed * delta);

        go.position.add(this.moveDirection);
        go.rotation = Math.atan2(this.moveDirection.y, this.moveDirection.x);
    }
    FollowTargetsMover.prototype.dispose = function (go) { }
    FollowTargetsMover.prototype.activate = function (go) { }
    FollowTargetsMover.prototype.deactivate = function (go) { }
    FollowTargetsMover.prototype.render = function (go) { }

    FollowTargetsMover.prototype.getTarget = function () {
        // TODO make more smart zombies
        if(this.targets.length)
            return this.targets[0]; // player 2 will have fun.
        else
            return null
    }

    return FollowTargetsMover;
})