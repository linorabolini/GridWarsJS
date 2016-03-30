define(function(require) {

    var Entity     = require('entity');
    var Simulation = require('simulation');
    var input      = require('input');


    function SimulationScreen() {
        // extend from entity
        Entity.call(this);


        var sim = new Simulation({
            debug: false
        });

        this.addChild(sim);

        // input event listeners
        input.on('input', _.bind(sim.handleInput, sim));
        input.on('new source', _.bind(sim.addPlayer, sim));
    }

    SimulationScreen.prototype = new Entity();

    return SimulationScreen;
});