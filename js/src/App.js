define(function (require) {
    'use strict';

    var entity = require('entity'),
        files = require('files'),
        input = require('input'),
        KeyboardController = require('keyboard'),
        server = require('server'),
        config = require('config'),
        LevelScreen = require('levelScreen'),
        APP = null;

    APP = entity.extend({

        // variables

        currentScreen: null,

        // functions

        setup: function () {
            server.setup();
            this.startApp();

            // add keyboard source
            input.addSource(new KeyboardController());
        },
        startApp: function () {
            var screen = new LevelScreen();
            this.setScreen(screen);
        },
        setScreen: function (newScreen) {
            if (this.screen) {
                this.removeChild(this.screen).dispose();
            }

            this.screen = newScreen;
            this.addChild(this.screen);
        }
    });

    return new APP();
});