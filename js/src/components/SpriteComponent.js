define(function (require) {

    var THREE = require('three');

    // static map cache
    var maps = {};

    function SpriteComponent(scene, imageSourcePath) {
        this.scene = scene;
        this.imageSourcePath = imageSourcePath;
        this.map = maps[imageSourcePath] ||  (maps[imageSourcePath] = THREE.ImageUtils.loadTexture(imageSourcePath));
        this.material = new THREE.SpriteMaterial( { map: this.map } );
        this.sprite = new THREE.Sprite( this.material );
    };
    SpriteComponent.prototype.setup = function (go) {
        this.sprite.position.copy(go.position);
        this.scene.add(this.sprite);
    }
    SpriteComponent.prototype.render = function (go) {
        this.sprite.position.copy(go.position);
        this.sprite.material.rotation = go.rotation;
    }
    SpriteComponent.prototype.activate = function (go) {
        this.sprite.visible = true;
    }
    SpriteComponent.prototype.deactivate = function (go) {
        this.sprite.visible = false;
    }
    SpriteComponent.prototype.update = function (go, delta) { }
    SpriteComponent.prototype.dispose = function (go) {
        this.sprite.visible = false;
    }

    return SpriteComponent;
});