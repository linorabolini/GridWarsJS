define(function (require) {

    var Entity                      = require('entity'),
        THREE                       = require('three'),
        files                       = require('files'),
        utils                       = require('utils'),
        Controller                  = require('controller'),
        GameObject                  = require('gameObject'),
        Weapon                      = require('weapon'),
        InventoryComponent          = require('inventoryComponent'),
        PlayerControllerComponent   = require('playerControllerComponent'),
        FollowTargetsMover          = require('followTargetsMover'),
        SpriteComponent             = require('spriteComponent'),
        SimpleMover                 = require('simpleMover'),
        _                           = require('underscore'),
        config                      = require('config').level;

    return Entity.extend({

        // variables

        players: null,
        enemies: null,
        bullets: null,
        controllers: null,
        scene: null,
        camera: null,
        renderer: null,

        tmpVector: null,
        

        // functions

        init: function () {
            this.__init();
            this.players     = [];
            this.enemies     = [];
            this.bullets     = [];

            this.tmpVector = new THREE.Vector3(0,0,0);

            // scene setup
            this.scene = new THREE.Scene();

            // camera
            this.setupCamera();

            // setup renderer
            this.setupRenderer();

            // create bullets cache
            this.createBullets();

            // create bullets cache
            this.createEnemies();
        },
        setupCamera: function () {
            var width = window.innerWidth;
            var height = window.innerHeight;

            this.camera = new THREE.PerspectiveCamera( 60, width / height, 1, 5000 );
            this.camera.position.z = 30;
        },
        setupRenderer: function () {
            var scope = this;

            // setup renderer
            if (window.WebGLRenderingContext)
                this.renderer = new THREE.WebGLRenderer();
            else
                this.renderer = new THREE.CanvasRenderer();

            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setClearColor(0x00688B, 1);
            this.renderer.setSize( window.innerWidth, window.innerHeight );

            window.onresize = function() {
                var windowHalfX = window.innerWidth / 2;
                var windowHalfY = window.innerHeight / 2;

                scope.camera.aspect = window.innerWidth / window.innerHeight;
                scope.camera.updateProjectionMatrix();

                scope.renderer.setSize( window.innerWidth, window.innerHeight );
            };
        },
        rotateCamera: function (axis, value) {
            // this.cameraHelper.rotateCamera(axis, value);
        },
        handleInput: function (event) {
            var controller = this.getPlayerById(event.id).controller;
            controller.set(event.code, event.value);
        },
        createBullets: function () {
            for (var i = 100 - 1; i >= 0; i--) {
                var bullet = new GameObject([
                        new SpriteComponent(this.scene, "assets/images/Bullet.png"),
                        new SimpleMover()
                    ]);

                bullet.deactivate();
                this.bullets.push(bullet);      
            };
        },
        createEnemies: function () {
            for (var i = 20 - 1; i >= 0; i--) {
                var enemy = new GameObject([
                        new SpriteComponent(this.scene, "assets/images/Pointer.png"),
                        new FollowTargetsMover(5, this.players)
                    ]);

                enemy.position.set(Math.random() > 0.5 ? 15 : -15, Math.random() > 0.5 ? 15 : -15, 0);
                this.enemies.push(enemy);   
            };
        },
        addPlayers: function (inputSources) {
            _.each(inputSources, function(config) {
                this.addPlayer(config);
            }, this);
        },
        addPlayer: function (config) {
            var controller = new Controller();
            var weapon = new Weapon(this.bullets);

            var inventory = new InventoryComponent();
            inventory.addItem(weapon);

            var player = new GameObject([
                    new SpriteComponent(this.scene, "assets/images/Player.png"),
                    new PlayerControllerComponent(controller, inventory),
                    inventory
                ]);

            player.controller = controller;

            this.setPlayerById(config.internalSourceId, player);
        },
        setPlayerById: function (id, value) {
            this.players[id] = value;
        },
        getPlayerById: function (id) {
            return this.players[id];
        },
        addToScreen: function () {
            document.body.appendChild( this.renderer.domElement );
        },
        removeFromScreen: function () {
            document.body.removeChild( this.renderer.domElement );
        },
        update: function (dt) {
            this.__update(dt);

            this.updatePlayers(dt);
            this.updateBullets(dt);
            this.updateEnemies(dt);

            this.checkCollisions(dt);

            this.render();
        },
        updateEnemies: function (dt) {
            var gotmp1;
            var i;

            for (i = this.enemies.length - 1; i >= 0; i--) {
                gotmp1 = this.enemies[i];
                gotmp1.update(dt);
            };
        },
        updatePlayers: function (dt) {
            var go;
            for (var i = this.players.length - 1; i >= 0; i--) {
                go = this.players[i];
                go.update(dt);
            };
        },
        updateBullets: function (dt) {
            var w = 30;
            var h = 20;
            var go;
            for (var i = this.bullets.length - 1; i >= 0; i--) {
                go = this.bullets[i];
                go.update(dt);
                if ( go.position.x < -w || go.position.y < -h || go.position.x > w || go.position.y > h ) {
                    go.deactivate();
                }
            };
        },
        checkCollisions: function (dt) {
            //  enemy vs enemy
            var gotmp1;
            var gotmp2;
            var i;
            var j;

            for (i = this.enemies.length - 1; i >= 0; i--) {
                gotmp1 = this.enemies[i];
                if(!gotmp1.isActive) {
                    continue;
                }
                for (j = i - 1; j >= 0; j--) {
                    gotmp2 = this.enemies[j];
                    if(!gotmp2.isActive) {
                        continue;
                    }
                    this.tmpVector.subVectors(gotmp2.position, gotmp1.position);
                    if(this.tmpVector.lengthSq() < gotmp2.radius + gotmp1.radius) {
                        gotmp2.position.add(this.tmpVector.multiplyScalar(dt * 2));
                    }
                };
            };


            // bullet vs enemy
            var bullet;
            var enemy;
            
            for (i = this.bullets.length - 1; i >= 0; i--) {
                bullet = this.bullets[i];
                if(!bullet.isActive) {
                    continue;
                }
                for (j = this.enemies.length - 1; j >= 0; j--) {
                    enemy = this.enemies[j];
                    if(!enemy.isActive) {
                        continue;
                    }
                    this.tmpVector.subVectors(enemy.position, bullet.position);
                    if(this.tmpVector.lengthSq() < enemy.radius + bullet.radius) {
                        bullet.deactivate();
                        // enemy.deactivate();
                        enemy.position.set(Math.random() > 0.5 ? 15 : -15, Math.random() > 0.5 ? 15 : -15, 0);
                        break;
                    }
                };
            };
        },
        render: function () {

            var i;
            for (i = this.players.length - 1; i >= 0; i--) {
                this.players[i].render();
            };

            for (i = this.bullets.length - 1; i >= 0; i--) {
                this.bullets[i].render();
            };

            for (i = this.enemies.length - 1; i >= 0; i--) {
                this.enemies[i].render();
            };


            this.renderer.render(this.scene, this.camera);
        },
        dispose: function () {
            this.removeFromScreen();
            window.onresize = null;
            players = null;
            bullets = null;
            this.__dispose();
        }
    });
});