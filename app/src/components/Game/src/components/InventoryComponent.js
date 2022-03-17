import Component from "./Component";
class InventoryComponent extends Component {
    constructor() {
        super();
        this.items = [];
        this.selectedItem = null;
    }

    update(go, delta) {
        if (this.selectedItem) {
            this.selectedItem.update(go, delta);
        }
        super.update(go, delta);
    }

    dispose(go) {
        for (var i = this.items.length - 1; i >= 0; i--) {
            this.items[i].dispose();
        }
        this.items = null;
        super.dispose(go);
    }

    // eslint-disable-next-line react/require-render-return
    render(go) {
        if (this.selectedItem) {
            this.selectedItem.render(go);
        }
        super.render(go);
    }

    addItem(item) {
        this.items.push(item);
        if (!this.selectedItem) {
            this.selectedItem = item;
        }
    }
}

export default InventoryComponent;
