import Component from "./Component";
import THREE from "../../engine/three";

// static map cache
var maps = {};

class SpriteComponent extends Component {
    constructor(scene, imageSourcePath) {
        super();
        this.scene = scene;
        this.imageSourcePath = imageSourcePath;
        this.map =
            maps[imageSourcePath] ||
            (maps[imageSourcePath] =
                THREE.ImageUtils.loadTexture(imageSourcePath));
        this.material = new THREE.SpriteMaterial({ map: this.map });
        this.sprite = new THREE.Sprite(this.material);
    }
    setup(go) {
        this.sprite.position.copy(go.position);
        this.scene.add(this.sprite);
    }
    render(go) {
        this.sprite.position.copy(go.position);
        this.sprite.material.rotation = go.rotation;
        return
    }
    activate(go) {
        this.sprite.visible = true;
    }
    deactivate(go) {
        this.sprite.visible = false;
    }
    dispose(go) {
        this.sprite.visible = false;
    }
}

export default SpriteComponent;
