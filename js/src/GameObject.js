var Entity = require("entity"),
    THREE = require("three");

class GameObject extends Entity {
    constructor(components, radius) {
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotation = 0;
        this.radius = radius || 0.5;
        this.shootDirection = null;

        super(components);
    }

    update(delta) {
        this.velocity.set(0, 0, 0);

        super.update(delta);
    }

    lateUpdate(delta) {
        this.velocity.multiplyScalar(delta);
        this.position.add(this.velocity);

        super.lateUpdate(delta);
    }
}
export default GameObject;
