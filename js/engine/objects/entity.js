class Entity {
    constructor(components = []) {
        this.parent = null;
        this.children = [];
        this.components = [];
        this.isDisposed = false;
        this.isActive = true;
        this.addComponents(components);
    }

    dispose() {
        if (this.isDisposed) {
            console.error("Tried to dispose an already disposed object");
            return;
        }

        this.isDisposed = true;

        this.children.forEach(c => c.dispose());
        this.components.forEach(c => c.dispose());

        this.children = [];
        this.components = [];

        this.parent && this.parent.removeChild(this);
    }

    update(dt) {
        if (!this.isActive || this.isDisposed) return;

        this.children.forEach(c => c.update(dt));
        this.components.forEach(c => c.update(this, dt));
    }

    lateUpdate(dt) {
        if (!this.isActive || this.isDisposed) return;

        this.children.forEach(c => c.lateUpdate(dt));
        this.components.forEach(c => c.lateUpdate(this, dt));
    }

    render() {
        if (!this.isActive || this.isDisposed) return;

        this.children.forEach(c => c.render());
        this.components.forEach(c => c.render(this));
    }

    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    removeChild(child) {
        var indx = this.children.indexOf(child);
        if (indx >= 0) {
            this.children.splice(indx, 1);
            child.parent = null;
            return child;
        }
    }

    activate() {
        this.isActive = true;
        this.components.forEach(c => c.activate(this));
        this.children.forEach(c => c.activate());
    }

    deactivate() {
        this.isActive = true;
        this.components.forEach(c => c.deactivate(this));
        this.children.forEach(c => c.deactivate());
    }

    addComponents(components) {
        components.forEach(c => c.setup(this));
        this.components.push(...components);
    }
}
export default Entity;
