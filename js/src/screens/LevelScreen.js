define(function (require) {

    var Entity                      = require('entity'),
        THREE                       = require('three'),
        files                       = require('files'),
        Controller                  = require('controller'),
        GameObject                  = require('gameObject'),
        Weapon                      = require('weapon'),
        PlayArea                    = require('playArea'),
        ParticleManager             = require('particleManager'),
        PointField                  = require('pointField'),
        InventoryComponent          = require('inventoryComponent'),
        PlayerControllerComponent   = require('playerControllerComponent'),
        FollowTargetsMover          = require('followTargetsMover'),
        LinkedTargetMover           = require('linkedTargetMover'),
        RandomPointMover            = require('randomPointMover'),
        SpriteComponent             = require('spriteComponent'),
        SimpleMover                 = require('simpleMover'),
        _                           = require('underscore'),
        input                       = require('input'),
        config                      = require('config').level;

    function LevelScreen () {
        Entity.call(this);

        this.players     = [];
        this.enemies     = [];
        this.bullets     = [];
        this.gameObjects = [this.players, this.enemies, this.bullets];

        this.tmpVector = new THREE.Vector3(0,0,0);

        // scene setup
        this.scene = new THREE.Scene();

        // play Area
        this.playArea = new PlayArea(60, 30);

        // camera
        this.setupCamera();

        // setup renderer
        this.setupRenderer();

        // setup composer
        this.setupComposer();

        // create bullets cache
        this.createBullets();

        // point field
        this.createPointField();

        // create particles cache
        this.createParticleManager();

        // create bullets cache
        this.createEnemies();

        // init elements
        this.addPlayers(input.getSources());

        // create a new viewport to render the level
        this.addToScreen();

        // input event listeners
        input.on('input', _.bind(this.handleInput, this));
        input.on('new source', _.bind(this.addPlayer, this));
    }

    LevelScreen.prototype = new Entity();

    LevelScreen.prototype.setupCamera = function () {
        var width = window.innerWidth;
        var height = window.innerHeight;

        this.camera = new THREE.PerspectiveCamera( 60, width / height, 1, 5000 );
        this.camera.position.z = 30;
    }

    LevelScreen.prototype.setupRenderer = function () {
        var scope = this;

        // setup renderer
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setPixelRatio( window.devicePixelRatio || 1 );
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.autoClear = false;

        window.onresize = function() {
            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;

            scope.camera.aspect = window.innerWidth / window.innerHeight;
            scope.camera.updateProjectionMatrix();

            scope.renderer.setSize( window.innerWidth, window.innerHeight );

            scope.composer && scope.composer.reset();
        };
    }

    LevelScreen.prototype.setupComposer = function () {
        var renderModel = new THREE.RenderPass( this.scene, this.camera );
        var effectBloom = new THREE.BloomPass( 2.2, 25, 4.0, 256 );
        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
            effectCopy.renderToScreen = true;

        this.composer = new THREE.EffectComposer( this.renderer );

        this.composer.addPass( renderModel );
        this.composer.addPass( effectBloom );
        this.composer.addPass( effectCopy );
    }

    LevelScreen.prototype.rotateCamera = function (axis, value) {
        // this.cameraHelper.rotateCamera(axis, value);
    }

    LevelScreen.prototype.handleInput = function (event) {
        var controller = this.getPlayerById(event.id).controller;
        _.each(event.data, function(item, key, data) {
            controller.set(key, data[key]);
        })
    }

    LevelScreen.prototype.createBullets = function () {
        for (var i = 100 - 1; i >= 0; i--) {
            var bullet = new GameObject([
                    new SpriteComponent(this.scene, "assets/images/Bullet.png"),
                    new SimpleMover()
                ]);

            bullet.deactivate();
            this.bullets.push(bullet);
            this.addChild(bullet);
        };
    }

    LevelScreen.prototype.createParticleManager = function () {
        this.particleManager = new ParticleManager(1000, this.playArea, this.scene);
        this.addChild(this.particleManager);
    }

    LevelScreen.prototype.createPointField = function () {
        this.pointField = new PointField(this.playArea, this.scene, 80, 40);
        this.addChild(this.pointField);
    }

    LevelScreen.prototype.createEnemies = function () {
        var i;
        var enemy;

        for (i = 10 - 1; i >= 0; i--) {
            enemy = new GameObject([
                    new SpriteComponent(this.scene, "assets/images/Seeker.png"),
                    new FollowTargetsMover(7, this.players)
                ]);

            this.spawnEnemy(enemy);
            this.enemies.push(enemy);
            this.addChild(enemy);
        };

        for (i = 10 - 1; i >= 0; i--) {
            enemy = new GameObject([
                    new SpriteComponent(this.scene, "assets/images/Wanderer.png"),
                    new RandomPointMover(7, this.playArea, true),
                ]);

            this.spawnEnemy(enemy);
            this.enemies.push(enemy);
            this.addChild(enemy);
        };

        var j, nodes;

        for (i = 2 - 1; i >= 0; i--) {

            nodes = [];
            enemy = new GameObject([
                    new SpriteComponent(this.scene, "assets/images/Pointer.png"),
                    new FollowTargetsMover(7, this.players)
                ]);

            this.spawnEnemy(enemy);
            this.enemies.push(enemy);
            this.addChild(enemy);

            nodes.push(enemy);

            for (j = 1; j <= 20; j++) {

                enemy = new GameObject([
                        new SpriteComponent(this.scene, "assets/images/Seeker.png"),
                        new LinkedTargetMover(nodes, j-1),
                    ]);

                enemy.isCollisionable = false;

                nodes[j] = enemy;

                this.spawnEnemy(enemy);
                this.enemies.push(enemy);
                this.addChild(enemy);
            }
        };
    }

    LevelScreen.prototype.addPlayers = function (inputSources) {
        _.each(inputSources, function(config) {
            this.addPlayer(config);
        }, this);
    }

    LevelScreen.prototype.addPlayer = function (config) {
        var controller = new Controller(config.keyMap);
        var weapon = new Weapon(this.bullets);

        var inventory = new InventoryComponent();
            inventory.addItem(weapon);

        var player = new GameObject([
                        new SpriteComponent(this.scene, "assets/images/Player.png"),
                        new PlayerControllerComponent(controller, inventory, this.particleManager),
                        inventory
                    ]);

        player.controller = controller;
        player.activate();
        this.addChild(player);

        this.setPlayerById(config.internalSourceId, player);
    }

    LevelScreen.prototype.setPlayerById = function (id, value) {
        this.players[id] = value;
    }

    LevelScreen.prototype.getPlayerById = function (id) {
        return this.players[id];
    }

    LevelScreen.prototype.addToScreen = function () {
        document.body.appendChild( this.renderer.domElement );
    }

    LevelScreen.prototype.removeFromScreen = function () {
        document.body.removeChild( this.renderer.domElement );
    }

    LevelScreen.prototype.update = function (dt) {
        Entity.prototype.update.call(this, dt);
        this.checkCollisions(dt);
    }

    LevelScreen.prototype.checkCollisions = function (dt) {
        //  enemy vs enemy
        var go_tmp_1;
        var go_tmp_2;
        var i;
        var j;

        for (i = this.enemies.length - 1; i >= 0; i--) {
            go_tmp_1 = this.enemies[i];
            if(!go_tmp_1.isActive || !go_tmp_1.isCollisionable) {
                continue;
            }
            for (j = i - 1; j >= 0; j--) {
                go_tmp_2 = this.enemies[j];
                if(!go_tmp_2.isActive || !go_tmp_2.isCollisionable) {
                    continue;
                }
                this.tmpVector.subVectors(go_tmp_2.position, go_tmp_1.position);
                var lenSq = this.tmpVector.lengthSq();
                if(lenSq < go_tmp_2.radius + go_tmp_1.radius) {
                    this.tmpVector.multiplyScalar( 3 / (lenSq + 1));
                    go_tmp_2.velocity.add(this.tmpVector);
                    go_tmp_1.velocity.sub(this.tmpVector);
                }
            };
        };

        // bullet vs enemy
        
        for (i = this.bullets.length - 1; i >= 0; i--) {
            go_tmp_1 = this.bullets[i];
            if(!go_tmp_1.isActive) {
                continue;
            }

            // bullet vs boundaries
            if ( this.playArea.isOut(go_tmp_1) ) {
                this.particleManager.createExplosion(go_tmp_1.position, 10, 15, 10);
                this.pointField.createExplosion(go_tmp_1.position, 10);
                go_tmp_1.deactivate();
            }

            // bullet vs enemies
            for (j = this.enemies.length - 1; j >= 0; j--) {
                go_tmp_2 = this.enemies[j];
                if(!go_tmp_2.isActive) {
                    continue;
                }
                this.tmpVector.subVectors(go_tmp_2.position, go_tmp_1.position);
                if(this.tmpVector.lengthSq() < go_tmp_2.radius + go_tmp_1.radius) {
                    this.particleManager.createExplosion(go_tmp_2.position, 50, 30, 20);
                    this.pointField.createExplosion(go_tmp_2.position, 100);
                    go_tmp_1.deactivate();
                    go_tmp_2.deactivate();
                    // this.spawnEnemy(go_tmp_2);
                    break;
                }
            };
        };

        //  enemy vs player

        for (i = this.enemies.length - 1; i >= 0; i--) {
            go_tmp_1 = this.enemies[i];
            if(!go_tmp_1.isActive) {
                continue;
            }
            for (j = this.players.length - 1; j >= 0; j--) {
                go_tmp_2 = this.players[j];
                if(!go_tmp_2.isActive) {
                    continue;
                }
                this.tmpVector.subVectors(go_tmp_2.position, go_tmp_1.position);
                if(this.tmpVector.lengthSq() < go_tmp_2.radius + go_tmp_1.radius) {
                    // this.onPlayerDead(go_tmp_2);
                    break;
                }
            };
        };

        // all with playArea
        // 
        for (i = this.gameObjects.length - 1; i >= 0; i--) {
            for (j = this.gameObjects[i].length - 1; j >= 0; j--) {
                go_tmp_1 = this.gameObjects[i][j];
                if(!go_tmp_1.isActive) {
                    continue;
                }
                go_tmp_1.position.clamp(this.playArea.vecMin, this.playArea.vecMax);
            };
        };
    }

    LevelScreen.prototype.onPlayerDead = function (player) {
        for (var k = this.enemies.length - 1; k >= 0; k--) {
            var enemy = this.enemies[k];
            enemy.deactivate();
            this.spawnEnemy(enemy);
        };
    }

    LevelScreen.prototype.spawnEnemy = function (enemy) {
        var xPos = Math.random() > 0.5? this.playArea.right - Math.random() : this.playArea.left + Math.random();
        var yPos = Math.random() > 0.5? this.playArea.top - Math.random() : this.playArea.bottom + Math.random();
        enemy.position.set(xPos, yPos, 0);
        enemy.activate();
    }

    LevelScreen.prototype.render = function () {
        Entity.prototype.render.call(this);

        this.renderer.clear();
        this.composer.render( 0.1 ); 
    }

    LevelScreen.prototype.dispose = function () {
        this.removeFromScreen();
        window.onresize  = null;
        this.players     = null;
        this.bullets     = null;
        this.enemies     = null;
        this.gameObjects = null;

        Entity.prototype.dispose.call(this);
    }

    return LevelScreen;
});