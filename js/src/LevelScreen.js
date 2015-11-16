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
            // if (event.type === "key") {
            //     switch (event.code) {
            //     case 87: // W
            //         this.level.rotateCamera("z", event.value);
            //         break;
            //     case 83: // S
            //         this.level.rotateCamera("y", event.value);
            //         break;
            //     case 65: // A
            //         this.level.rotateCamera("x", event.value);
            //         break;
            //     }
            // }

            // delegate to level model
            this.level.handleInput(event);
        }
    });
});