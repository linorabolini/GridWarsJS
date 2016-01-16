define(function (require) {

    var entity = require('entity'),
        levelModel = require('levelModel'),
        input = require('input');

    return entity.extend({

        // variables

        level: null,

        // functions

        init: function () {
            this.__init();

            // create level from scene data
            this.level = new levelModel();
            this.level.addPlayers(input.getSources());

            // create a new viewport to render the level
            this.level.addToScreen();

            // add elements to the update loop
            this.addChild(this.level);

            input.on('input', this.handleInput);
            input.on('new source', this.level.addPlayer);
        },
        handleInput: function (event) {
            // delegate to level model
            this.level.handleInput(event);
        }
    });
});