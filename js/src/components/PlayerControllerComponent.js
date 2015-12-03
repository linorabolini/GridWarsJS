define(function (require) {

    var THREE = require('three');

    function PlayerController(controller, inventory, particleManager) {
        this.controller = controller;
        this.inventory = inventory;
        this.moveDirection = new THREE.Vector3(0,0,0);
        this.particleDirection = new THREE.Vector3(0,0,0);
        this.particleManager = particleManager;

        // TODO: move this to a mover
        this.speed = 10;
    };

    PlayerController.prototype.setup = function (go){

    }
    PlayerController.prototype.update = function (go, delta)
    {
        this.updatePosition(go, delta);
        this.updateRotation(go, delta);
        this.updateInventory(go, delta);
    }
    PlayerController.prototype.dispose = function (go){

    }
    PlayerController.prototype.activate = function (go){

    }
    PlayerController.prototype.deactivate = function (go){

    }

    PlayerController.prototype.render = function (go){

    }

    PlayerController.prototype.updatePosition = function(go, delta) {
        var inputX = this.controller.get("68") - this.controller.get("65");
        var inputY = this.controller.get("87") - this.controller.get("83");

        // TODO: move this to a mover
        this.moveDirection.set(inputX, inputY, 0).setLength(this.speed);

        if(this.moveDirection.lengthSq() != 0) {
            // TODO: move this to a mover
            go.velocity.add(this.moveDirection);
            this.particleDirection.copy(this.moveDirection).multiplyScalar(-1);
            this.particleManager.createBurst(go.position, this.particleDirection, 5, 2, 3, 5);
        }
    }

    PlayerController.prototype.updateRotation = function(go, delta) {
        var inputX = this.moveDirection.x;
        var inputY = this.moveDirection.y;

        // do not rotate if not rotation D'oh!
        if (!inputX && ! inputY) 
            return;

        var angle = Math.atan2(inputY, inputX);
        go.rotation = angle;
    }

    PlayerController.prototype.updateInventory = function(go, delta) {
        var input = this.controller.get(this.controller.BUTTON_A);
        if(input == this.controller.TRUE) {
            this.inventory.selectedItem.doUseBy(go);
        }
    }

    return PlayerController;
});