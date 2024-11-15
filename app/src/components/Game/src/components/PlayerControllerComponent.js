import Component from "./Component";
import THREE from "../../engine/three";

class PlayerController extends Component {
    constructor(controller, inventory, particleManager) {
        super();
        this.controller = controller;
        this.inventory = inventory;
        this.tmpVector = new THREE.Vector3(0, 0, 0);
        this.particleDirection = new THREE.Vector3(0, 0, 0);
        this.particleManager = particleManager;

        // TODO: move this to a mover
        this.speed = 10;
    }

    update(go, delta) {
        this.updatePosition(go, delta);
        this.updateRotation(go, delta);
        this.updateShootDirection(go, delta);
        this.updateInventory(go, delta);
        super.update(go, delta);
    }

    updatePosition(go, delta) {
        var inputX =
            this.controller.get("ARROW_RIGHT") -
            this.controller.get("ARROW_LEFT");
        var inputY =
            this.controller.get("ARROW_UP") - this.controller.get("ARROW_DOWN");

        // TODO: move this to a mover
        this.tmpVector.set(inputX, inputY, 0).setLength(this.speed);

        if (this.tmpVector.lengthSq() !== 0) {
            // TODO: move this to a mover
            go.velocity.add(this.tmpVector);
            this.particleDirection.copy(this.tmpVector).multiplyScalar(-1);
            this.particleManager.createBurst(
                go.position,
                this.particleDirection,
                5,
                2,
                3,
                5
            );
        }
    }

    updateRotation(go, delta) {
        var inputX = this.tmpVector.x;
        var inputY = this.tmpVector.y;

        // do not rotate if not rotation D'oh!
        if (!inputX && !inputY) return;

        go.rotation = Math.atan2(inputY, inputX);
    }

    updateShootDirection(go, delta) {
        var inputX =
            this.controller.get("ARROW_2_RIGHT") -
            this.controller.get("ARROW_2_LEFT");
        var inputY =
            this.controller.get("ARROW_2_UP") -
            this.controller.get("ARROW_2_DOWN");

        // do not rotate if not rotation D'oh!
        if (!inputX && !inputY) {
            go.shootDirection = go.rotation;
        } else {
            go.shootDirection = Math.atan2(inputY, inputX);
        }
    }

    updateInventory(go, delta) {
        var input =
            this.controller.get("ARROW_2_RIGHT") ||
            this.controller.get("ARROW_2_LEFT") ||
            this.controller.get("ARROW_2_UP") ||
            this.controller.get("ARROW_2_DOWN") ||
            this.controller.get("BUTTON_A");

        if (input !== 0) {
            this.inventory.selectedItem.doUseBy(go);
        }
    }
}
export default PlayerController;
