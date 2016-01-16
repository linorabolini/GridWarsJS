define(function (require) {
    'use strict';

    var fishbone = require('fishbone');

    return fishbone({

        // variables

        parent: null,
        children: null,
        components: null,
        isDisposed: false,
        isActive:  true,

        // functions
        init: function (components) {
            this.children = [];
            this.components = [];
            if(components != null) {
                this.addComponents(components);
            }
        },
        dispose: function () {
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
        },
        update: function (dt) {
            var i;

            if(!this.isActive || this.isDisposed)
                return

            for (i = this.children.length - 1; i >= 0; i--) {
                this.children[i].update(dt);
            }
                
            for (i = this.components.length - 1; i >= 0; i--) {
                this.components[i].update(this, dt);
            }
        },
        render: function () {
            var i;

            if(!this.isActive || this.isDisposed)
                return

            for (i = this.children.length - 1; i >= 0; i--) {
                this.children[i].render();
            }
                
            for (i = this.components.length - 1; i >= 0; i--) {
                this.components[i].render(this);
            }
        },
        addChild: function (child) {
            this.children.push(child);
            child.parent = this;
        },
        removeChild: function (child) {
            var indx = this.children.indexOf(child);
            if (indx >= 0) {
                this.children.splice(indx, 1);
                child.parent = null;
                return child;
            }
        },
        activate: function ()
        {
            var i;
            this.isActive = true;
            for (i = this.components.length - 1; i >= 0; i--) {
                this.components[i].activate(this);
            }

            for (i = this.children.length - 1; i >= 0; i--) {
                this.children[i].activate();
            }
        },
        deactivate: function ()
        {
            var i;
            this.isActive = false;
            for (i = this.components.length - 1; i >= 0; i--) {
                this.components[i].deactivate(this);
            }

            for (i = this.children.length - 1; i >= 0; i--) {
                this.children[i].deactivate();
            }
        },
        addComponents: function (components)
        {
            var i;
            for (i = components.length - 1; i >= 0; i--) {
                this.addComponent(components[i]);
            }
        },
        addComponent: function (component)
        {
            component.setup(this);
            this.components.push(component);
        }
    });
});