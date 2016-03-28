define(function (require) {
    'use strict';

    var Entity = require('entity');

    function GameObject (body, components) {
        this.body = body;
        Entity.call(this, components);
    }

    GameObject.prototype = new Entity();

    return GameObject;
});