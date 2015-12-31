define(function (require) {
    'use strict';

    var Entity = require('entity'),
        THREE  = require('three');

    return Entity.extend({

        // variables

        position: null,
        velocity: null,
        rotation: null,
        shootDirection: null,
        radius: null,
        

        // functions

        init: function (components, radius) {
            this.position = new THREE.Vector3(0, 0, 0);
            this.velocity = new THREE.Vector3(0, 0, 0);
            this.rotation = 0;
            this.radius = radius || 0.5;
            if(!radius) {
                console.warn("No Radius was set!");
            }

            this.__init(components);
        },
        update: function (delta) {
            this.velocity.set(0, 0, 0);

            this.__update(delta);
        },
        postUpdate: function (delta) {
            this.velocity.multiplyScalar(delta);
            this.position.add(this.velocity);
        }
    });
});