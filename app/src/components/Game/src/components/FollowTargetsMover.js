import THREE from "../../engine/three";
import Component from "./Component";

class FollowTargetsMover extends Component {
    constructor(speed, targets) {
        super();
        this.speed = speed || 5;
        this.targets = targets;
        this.moveDirection = new THREE.Vector3(0, 0, 0);
        this.currentTarget = null;
    }

    update(go, delta) {
        this.currentTarget = this.getTarget(go);

        if (!this.currentTarget) return;

        this.moveDirection
            .copy(this.currentTarget.position)
            .sub(go.position)
            .setLength(this.speed * delta);

        go.position.add(this.moveDirection);
        go.rotation = Math.atan2(this.moveDirection.y, this.moveDirection.x);
    }

    getTarget(go) {
        var maxDistance = 99999,
            target,
            tmpDistance,
            tmpTarget;

        // TODO make more smart zombies
        for (var i = 0; i < this.targets.length; i++) {
            tmpTarget = this.targets[i];
            tmpDistance = tmpTarget.position.distanceToSquared(go.position);
            if (tmpDistance < maxDistance) {
                maxDistance = tmpDistance;
                target = tmpTarget;
            }
        }

        return target;
    }
}

export default FollowTargetsMover;
