define(function (require) {

    var Entity                      = require('entity'),
        THREE                       = require('three'),
        Controller                  = require('controller'),
        GameRenderer                = require('gameRenderer'),
        GameObject                  = require('gameObject'),
        PlayArea                    = require('playArea'),
        ParticleManager             = require('particleManager'),
        SpriteBuffer                = require('spriteBuffer'),
        Sensor                      = require('sensor'),
        AIComponent                 = require('AIComponent'),
        PointField                  = require('pointField'),
        _                           = require('underscore'),
        input                       = require('input'),
        PlayerControllerComponent   = require('playerControllerComponent'),
        SpriteComponent             = require('spriteComponent'),
        Matter                      = require('matter');

    // Matter module aliases
    var Engine = Matter.Engine,
        World = Matter.World,
        Body = Matter.Body,
        Sleeping = Matter.Sleeping,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Events = Matter.Events;

    function Simulation (config) {
        Entity.call(this);

        config = config || {};
        this.debug = config.debug;

        this.players = [];
        this.spriteBuffers = {};

        // setup scenario
        this.playArea = new PlayArea(500, 500); // play Area setup
        this.renderer = new GameRenderer(this.playArea);
        this.pointField = new PointField(this.playArea, this.renderer.getScene(), 80, 80);
        this.addChild(this.pointField);

        // create particle system
        this.particleManager = new ParticleManager(1000, this.playArea, this.renderer.getScene());
        this.addChild(this.particleManager);

        // create a new viewport to render the level
        if(!this.debug){
            this.renderer.addToScreen();
        }

        // create a Matter.js engine
        var engine = this.engine = Engine.create(document.body, {
            positionIterations: 1,
            constraintIterations: 1,
            velocityIterations: 1,
            sleepThreshold: 30,
            enableSleeping: true,
            world: {
                gravity: {
                    x:0,
                    y:0
                }
            },
            render: {
                options: {
                    showAngleIndicator: true,
                    showVelocity: true,
                    showCollisions: true,
                    wireframes: false
                }
            }
        });

        // add some some walls to the world
        var w = this.playArea.width;
        var h = this.playArea.height;
        var s = 50;
        World.add(this.engine.world, [

                        //   x    y    w      h
          Bodies.rectangle(0, -s/2, w*2, s, { isStatic: true }),
          Bodies.rectangle(0, h+s/2, w*2, s, { isStatic: true }),


          Bodies.rectangle(-s/2, 0, s, h*2, { isStatic: true }),
          Bodies.rectangle(w+s/2, 0, s, h*2, { isStatic: true })
        ]);

        Render.setPixelRatio(this.engine.render, 'auto');

        this.addEnemies(0);

        Events.on(engine, "collisionStart", _.bind(this.onCollisionStart, this));
    }

    Simulation.prototype = new Entity();

    Simulation.prototype.update = function (dt) {
        Entity.prototype.update.call(this, dt);
        Engine.update(this.engine, 1);

        for (var i = this.players.length - 1; i >= 0; i--) {
            var p = this.players[i];
            this.pointField.createExplosion(p.body.position, 10 * p.body.motion);
        }
    }

    Simulation.prototype.render = function () {
        Entity.prototype.render.call(this);

        if(this.debug){
            Render.world(this.engine);        
        } else {
            this.renderer.render();
        }
    }

    Simulation.prototype.dispose = function () {
        this.renderer.dispose();
        this.spriteBuffers = null;
        Entity.prototype.dispose.call(this);
    }

    Simulation.prototype.onCollisionStart = function (event) {
        var pairs = event.pairs;

        for (var i = pairs.length - 1; i >= 0; i--) {
            var pair = pairs[i];

            var body = pair.bodyA.isStatic ? pair.bodyB : pair.bodyA;
            this.particleManager.createExplosion(body.position, 50, 100, 200);
            this.pointField.createExplosion(body.position, 1000);
        }
    }

    Simulation.prototype.getSprite = function (spriteName, bufferSize) {
        if(!this.spriteBuffers[spriteName]) {
            var sb = this.spriteBuffers[spriteName] = new SpriteBuffer(spriteName, bufferSize || 1000, this.renderer.getScene());
            this.addChild(sb);
        }
        var sprite = this.spriteBuffers[spriteName].getSprite();
        return sprite;
    }


    Simulation.prototype.handleInput = function (e) {
        var controller = this.players[e.id].controller;
        _.each(e.data, function(item, key, data) {
            controller.set(key, data[key]);
        });
    }
    
    Simulation.prototype.addEnemies = function (number) {
        for (var i = number - 1; i >= 0; i--) {

            var body = Bodies.circle(this.playArea.getRandomXCoord(), this.playArea.getRandomYCoord(), 5, {
                mass: 0.01
            });
            Sleeping.set(body, true);

            // TODO dispose body when player is unactive
            World.add(this.engine.world, body);

            var sensors = [
                // new Sensor({sprite: this.getSprite("assets/images/Bullet.png", number * 5), direction: 1}),
                // new Sensor({sprite: this.getSprite("assets/images/Bullet.png"), angle: 0.5}),
                // new Sensor({sprite: this.getSprite("assets/images/Bullet.png"), angle: -0.5}),
                // new Sensor({sprite: this.getSprite("assets/images/Bullet.png"), angle: 1}),
                // new Sensor({sprite: this.getSprite("assets/images/Bullet.png"), direction: -1})
            ];
            var controllerComponent = new AIComponent(this.engine.world, sensors);

            var sprite = new SpriteComponent(this.getSprite("assets/images/Seeker.png", number));

            var components = [controllerComponent, sprite];

            enemy = new GameObject(body, components);

            this.addChild(enemy);
        };
    }

    Simulation.prototype.addPlayer = function (config) {
        var body = Bodies.circle(this.playArea.width/2, this.playArea.height/2, 8);
        World.add(this.engine.world, body);

        var controller = new Controller(config.keyMap);
        var controllerComponent = new PlayerControllerComponent(controller);
        var sprite = new SpriteComponent(this.getSprite("assets/images/Player.png", 10));

        var components = [controllerComponent, sprite];

        var player = new GameObject(body, components);

        player.controller = controller;
        this.addChild(player, true);
        this.players[config.internalSourceId] = player;
    }

    return Simulation;
});