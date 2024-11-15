import Entity from "../engine/objects/entity";
import THREE from "../engine/three";

class GameObject extends Entity {
    constructor(options = {}) {
        const { radius = 0.5 } = options;
        super();
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.damping = 0.97;
        this.rotation = 0;
        this.radius = radius;
        this.shootDirection = null;
        this.isCollisionable = true;
    }

    update(delta) {
        this.acceleration.multiplyScalar(this.damping);
        this.velocity.set(0, 0, 0);

        super.update(delta);
    }

    lateUpdate(delta) {
        this.velocity.add(this.acceleration);
        this.velocity.multiplyScalar(delta);
        this.position.add(this.velocity);

        super.lateUpdate(delta);
    }
}
export default GameObject;
