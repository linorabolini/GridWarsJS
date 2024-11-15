import Component from "./Component";
import THREE from "../../engine/three";

class SimpleMover extends Component {
    constructor(speed) {
        super();
        this.speed = speed || 20;
        this.moveDirection = new THREE.Vector3(0, 0, 0);
    }

    update(go, delta) {
        go.velocity.add(this.moveDirection);
    }
    activate(go) {
        this.moveDirection.set(Math.cos(go.rotation), Math.sin(go.rotation), 0);
        this.moveDirection.multiplyScalar(this.speed);
    }
}
export default SimpleMover;
