define(function (require) {
    'use strict';

    var Entity = require('entity'),
        THREE  = require('three');

    function GameObject (components, radius) {
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotation = 0;
        this.radius = radius || 0.5;
        this.shootDirection = null;

        Entity.call(this, components);
    }

    GameObject.prototype = new Entity();

    GameObject.prototype.update = function(delta) {
        this.velocity.set(0, 0, 0);

        Entity.prototype.update.call(this, delta);
    };

    GameObject.prototype.lateUpdate = function(delta) {
        this.velocity.multiplyScalar(delta);
        this.position.add(this.velocity);

        Entity.prototype.lateUpdate.call(this, delta);
    };

    return GameObject;
});