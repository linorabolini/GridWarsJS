define(function (require) {
    'use strict';

    var Entity = require('entity'),
        THREE  = require('three');

    return Entity.extend({

        // variables

        position: null,
        rotation: null,
        radius: null,
        

        // functions

        init: function (components, radius) {
            this.position = new THREE.Vector3(0, 0, 0);
            this.rotation = 0;
            this.radius = radius || 0.5;
            if(!radius) {
                console.warn("No Radius was set!");
            }

            this.__init(components);
        }
    });
});