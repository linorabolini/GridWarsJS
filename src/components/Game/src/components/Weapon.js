import THREE from "../../engine/three";
import Component from "./Component";

class Weapon extends Component {
    constructor(bullets, delay) {
        super();
        this.bullets = bullets || [];
        this.elapsed = 0;
        this.delay = delay || 1 / 10;
        this.canFire = true;
        this.cannonOffsets = [
            new THREE.Vector3(1, 0.3, 0),
            new THREE.Vector3(1, -0.3, 0),
        ];

        this.tmpVector = new THREE.Vector3(0, 0, 0);
        this.quaternion = new THREE.Quaternion();
        this.UP = new THREE.Vector3(0, 0, 1);
    }

    update(go, delta) {
        this.elapsed += delta;
        if (this.elapsed > this.delay) {
            this.elapsed -= this.delay;
            this.canFire = true;
        }
    }

    dispose(go) {
        this.bullets = null;
    }

    doUseBy(go) {
        for (var i = this.cannonOffsets.length - 1; i >= 0; i--) {
            this.fire(this.getBullet(), go, this.cannonOffsets[i]);
        }
        this.canFire = false;
    }

    fire(bullet, go, offset) {
        if (!this.canFire || !bullet) return;

        this.quaternion.setFromAxisAngle(this.UP, go.shootDirection);

        this.tmpVector.copy(offset).applyQuaternion(this.quaternion);

        bullet.position.copy(go.position).add(this.tmpVector);
        bullet.velocity.copy(go.velocity);
        bullet.acceleration.copy(go.acceleration)

        bullet.rotation = go.shootDirection;
        bullet.activate();
        this.elapsed = 0;
    }

    getBullet() {
        for (var i = 0; i < this.bullets.length; ++i) {
            if (!this.bullets[i].isActive) {
                return this.bullets[i];
            }
        }
        return null;
    }
}

export default Weapon;
