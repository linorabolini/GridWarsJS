import Component from "./Component";
var THREE = require("three");

class RandomPointMover extends Component {
    constructor(speed, playArea, isInfinite) {
        this.speed = speed || 5;
        this.playArea = playArea;
        this.isInfinite = isInfinite;
        this.moveDirection = new THREE.Vector3(0, 0, 0);
        this.currentTarget = new THREE.Vector3(0, 0, 0);
    }

    update(go, delta) {
        this.moveDirection
            .subVectors(this.currentTarget, go.position)
            .multiplyScalar(0.5)
            .clampLength(0, this.speed);
        go.velocity.add(this.moveDirection);

        go.rotation = Math.atan2(this.moveDirection.y, this.moveDirection.x);

        if (go.position.distanceToSquared(this.currentTarget) < this.speed) {
            if (this.isInfinite) {
                this.updateTargetPoint(go);
            } else {
                go.deactivate();
            }
        }
    }
    activate(go) {
        this.updateTargetPoint(go);
    }

    updateTargetPoint(go) {
        this.currentTarget.set(
            this.playArea.getRandomXCoord(),
            this.playArea.getRandomYCoord(),
            0
        );
        this.moveDirection.subVectors(this.currentTarget, go.position);
    }
}

export default RandomPointMover;
