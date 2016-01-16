define(function (require) {
    'use strict';

    function Entity (components) {
        this.parent = null;
        this.children = [];
        this.isDisposed = false;
        this.isActive =  true;
        this.components = [];
        this.addComponents(components);
    }

    Entity.prototype.dispose = function () {
        var i;
        if (this.isDisposed) {
            console.error("Tried to dispose an already disposed object");
            return;
        }

        this.isDisposed = true;

        for (i = this.children.length - 1; i >= 0; i--) {
            this.children[i].dispose();
        }

        this.children = [];

        for (i = this.components.length - 1; i >= 0; i--) {
            this.components[i].dispose(this);
        }

        this.components = [];

        this.parent && this.parent.removeChild(this);
    };

    Entity.prototype.update = function (dt) {
        var i;

        if(!this.isActive || this.isDisposed)
            return

        for (i = this.children.length - 1; i >= 0; i--) {
            this.children[i].update(dt);
        }
            
        for (i = this.components.length - 1; i >= 0; i--) {
            this.components[i].update(this, dt);
        }
    };

    Entity.prototype.lateUpdate = function (dt) {
        var i;

        if(!this.isActive || this.isDisposed)
            return

        for (i = this.children.length - 1; i >= 0; i--) {
            this.children[i].lateUpdate(dt);
        }
            
        // for (i = this.components.length - 1; i >= 0; i--) {
        //     this.components[i].lateUpdate(this, dt);
        // }
    };

    Entity.prototype.render = function () {
        var i;

        if(!this.isActive || this.isDisposed)
            return

        for (i = this.children.length - 1; i >= 0; i--) {
            this.children[i].render();
        }
            
        for (i = this.components.length - 1; i >= 0; i--) {
            this.components[i].render(this);
        }
    };

    Entity.prototype.addChild = function (child) {
        this.children.push(child);
        child.parent = this;
    };

    Entity.prototype.removeChild = function (child) {
        var indx = this.children.indexOf(child);
        if (indx >= 0) {
            this.children.splice(indx, 1);
            child.parent = null;
            return child;
        }
    };

    Entity.prototype.activate = function ()
    {
        var i;
        this.isActive = true;
        for (i = this.components.length - 1; i >= 0; i--) {
            this.components[i].activate(this);
        }

        for (i = this.children.length - 1; i >= 0; i--) {
            this.children[i].activate();
        }
    };

    Entity.prototype.deactivate = function ()
    {
        var i;
        this.isActive = false;
        for (i = this.components.length - 1; i >= 0; i--) {
            this.components[i].deactivate(this);
        }

        for (i = this.children.length - 1; i >= 0; i--) {
            this.children[i].deactivate();
        }
    };

    Entity.prototype.addComponents = function (components)
    {
        if(!components)
            return;
        
        var i;

        for (i = components.length - 1; i >= 0; i--) {
            this.addComponent(components[i]);
        }
    };

    Entity.prototype.addComponent = function (component)
    {
        component.setup(this);
        this.components.push(component);
    }

    return Entity;
});