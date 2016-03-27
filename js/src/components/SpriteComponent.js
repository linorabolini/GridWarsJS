define(function (require) {

    function SpriteComponent(spriteModel, options) {
        options = options || {};
        this.spriteModel = spriteModel;
        this.spriteModel.size = options.size || 1.0;
    };
    SpriteComponent.prototype.setup = function (go) {
        var pos = go.body.position;
        this.spriteModel.position.x = pos.x;
        this.spriteModel.position.y = -pos.y;
    }
    SpriteComponent.prototype.render = function (go) {
        var pos = go.body.position;
        var angle = go.body.angle;
        this.spriteModel.position.x = pos.x;
        this.spriteModel.position.y = -pos.y;
        this.spriteModel.rotation = angle;
    }
    SpriteComponent.prototype.activate = function (go) {
        this.spriteModel.alpha = 1.0;
    }
    SpriteComponent.prototype.deactivate = function (go) {
        this.spriteModel.alpha = 0.0;
    }
    SpriteComponent.prototype.update = function (go, delta) { }
    SpriteComponent.prototype.dispose = function (go) {
        this.spriteModel.alpha = 0;
        this.spriteModel.isFree = true;
    }

    return SpriteComponent;
});