var THREE = require("three");
import Component from "./Component";
class LinkedTargetMover extends Component {
    constructor(targets, fromIndex) {
        this.targets = targets;
        this.fromIndex = fromIndex || 0;
        this.moveDirection = new THREE.Vector3(0, 0, 0);
    }

    update(go, delta) {
        this.currentTarget = this.getTarget();

        if (!this.currentTarget) return;

        this.moveDirection.subVectors(this.currentTarget.position, go.position);
        go.position.lerp(this.currentTarget.position, 0.1);
        go.rotation = Math.atan2(this.moveDirection.y, this.moveDirection.x);
        super.update(go, delta);
    }

    getTarget() {
        for (var i = this.fromIndex; i >= 0; i--) {
            if (this.targets[i].isActive) {
                return this.targets[i];
            }
        }
        return null;
    }
}
export default LinkedTargetMover;
