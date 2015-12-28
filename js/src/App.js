define(function (require) {
    'use strict';

    var entity = require('entity'),
        files = require('files'),
        input = require('input'),
        KeyboardController = require('keyboard'),
        Controller = require('controller'),
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
            input.addSource(new KeyboardController({
                '74': 'ARROW_LEFT',
                '76': 'ARROW_RIGHT',
                '75': 'ARROW_DOWN',
                '73': 'ARROW_UP',
                '80': 'BUTTON_A'
            }));

            // add keyboard source
            input.addSource(new KeyboardController({
                '65': 'ARROW_LEFT',
                '68': 'ARROW_RIGHT',
                '83': 'ARROW_DOWN',
                '87': 'ARROW_UP',
                '71': 'BUTTON_A'
            }));
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