define(function (require) {

    function InventoryComponent() {
        this.items = [];
        this.selectedItem = null;
    }

    InventoryComponent.prototype.update = function (go, delta) {
        if(this.selectedItem) {
            this.selectedItem.update(go, delta);
        }
    }

    InventoryComponent.prototype.dispose = function (go) {
        for (var i = this.items.length - 1; i >= 0; i--) {
            this.items[i].dispose();
        };
        this.items = null;
    }

    InventoryComponent.prototype.setup = function (go) { }
    InventoryComponent.prototype.activate = function (go) { }
    InventoryComponent.prototype.deactivate = function (go) { }
    InventoryComponent.prototype.render = function (go) {
        if(this.selectedItem) {
            this.selectedItem.render(go);
        }
    }

    InventoryComponent.prototype.addItem = function (item) {
        this.items.push(item);
        if(!this.selectedItem){
            this.selectedItem = item;
        }
    }

    return InventoryComponent;
});