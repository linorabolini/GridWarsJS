define(function (require) {

    var THREE = require('three');
    var Vector = require('matter').Vector;

    // static map cache
    var maps = {};

    function SpriteComponent(scene, imageSourcePath) {
        this.scene = scene;
        this.imageSourcePath = imageSourcePath;
        this.map = maps[imageSourcePath] ||  (maps[imageSourcePath] = THREE.ImageUtils.loadTexture(imageSourcePath));
        this.material = new THREE.SpriteMaterial( { map: this.map } );
        this.sprite = new THREE.Sprite( this.material );
        this.sprite.scale.set(16, 16, 1);
    };
    SpriteComponent.prototype.setup = function (go) {
        var pos = go.body.position;
        this.sprite.position.set(pos.x, -pos.y, 0);
        this.scene.add(this.sprite);
    }
    SpriteComponent.prototype.render = function (go) {
        var pos = go.body.position;
        var angle = go.body.angle;
        this.sprite.position.set(pos.x, -pos.y, 0);
        this.sprite.material.rotation = angle;
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