'use strict';

require.config({
    baseUrl: 'js',
    paths: {
    // libs
        'jquery'        : 'libs/jquery-2.1.0.min',
        'underscore'    : 'libs/underscore-min',
        'datgui'        : 'libs/dat.gui',
        'fishbone'      : 'libs/fishbone',
        'three'         : 'libs/three.min',

    //engine
        // objects
        'controller'        : 'engine/objects/controller',
        'entity'            : 'engine/objects/entity',

        // inputs
        'keyboard'      : 'engine/inputs/keyboard',
        'mobile'        : 'engine/inputs/mobile',

    // src
        'levelScreen'       : 'src/LevelScreen',
        'levelModel'        : 'src/LevelModel',
        'app'               : 'src/App',
        'gameObject'        : 'src/GameObject',
        'weapon'            : 'src/Weapon',
            // components
            'followTargetsMover'            : 'src/components/FollowTargetsMover',
            'inventoryComponent'            : 'src/components/InventoryComponent',
            'simpleMover'                   : 'src/components/SimpleMover',
            'spriteComponent'               : 'src/components/SpriteComponent',
            'playerControllerComponent'     : 'src/components/PlayerControllerComponent',


// upper level
        'debug'         : 'engine/debug',
        'server'        : 'engine/server',
        'input'         : 'engine/input',
        'utils'         : 'engine/utils',
        'files'         : 'engine/files'
    }
});

define('io', [], function(config) {
    try {
        return io;
    } catch(e) {
        return false
    }
});

define('config', [], function() {
    return {
        server: {
            name: 'server',
            host: 'http://localhost:3000',
            options: {
                'reconnection': false
            }
        },
        debug: true
    }
});

require(['app', 'datgui'],
    function (app) {

        // component setup
        //==============================================
        app.setup();

        // main loop config
        //==============================================
        var last = 0;
        var dt = 0;
        function step(now) {
            dt = Math.min(now - last, 100);
            app.update(dt * 0.001);
            last = now;
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);

    });