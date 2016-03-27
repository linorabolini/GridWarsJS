define(function (require) {

    var Entity                      = require('entity'),
        THREE                       = require('three'),
        Controller                  = require('controller'),
        GameRenderer                = require('gameRenderer'),
        GameObject                  = require('gameObject'),
        PlayArea                    = require('playArea'),
        ParticleManager             = require('particleManager'),
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
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Render = Matter.Render,
        Runner = Matter.Runner;

    function Simulation (config) {
        Entity.call(this);

        config = config || {};
        this.debug = config.debug;

        this.players = [];

        // setup renderer 
        this.renderer = new GameRenderer();

        // setup scenario
        this.playArea = new PlayArea(1000, 500); // play Area setup
        this.pointField = new PointField(this.playArea, this.renderer.getScene(), 80, 40);
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
    }

    Simulation.prototype = new Entity();

    Simulation.prototype.update = function (dt) {
        Entity.prototype.update.call(this, dt);
        Engine.update(this.engine, 1000 / 60);
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
        Entity.prototype.dispose.call(this);
    }


    Simulation.prototype.handleInput = function (e) {
        var controller = this.players[e.id].controller;
        _.each(e.data, function(item, key, data) {
            controller.set(key, data[key]);
        })
    }
    
    Simulation.prototype.addPlayers = function (inputSources) {
        _.each(inputSources, function(config) {
            this.addPlayer(config);
        }, this);
    }

    Simulation.prototype.addPlayer = function (config) {
        var body = Bodies.circle(500, 250, 8);

        // TODO dispose body when player is unactive
        World.add(this.engine.world, body);
        var controller = new Controller(config.keyMap);
        var controllerComponent = new PlayerControllerComponent(controller);

        var components = [controllerComponent];

        if(!this.debug) {
            var sprite = new SpriteComponent(this.renderer.getScene(), "assets/images/Player.png");
            components.push(sprite);
        }

        var player = new GameObject(body, components);

        player.controller = controller;
        this.addChild(player, true);
        this.players[config.internalSourceId] = player;

        for (i = 100 - 1; i >= 0; i--) {

            body = Bodies.circle(500, 250, 8);

                    // TODO dispose body when player is unactive
                    World.add(this.engine.world, body);
            enemy = new GameObject(body, [
                    new SpriteComponent(this.renderer.getScene(), "assets/images/Seeker.png")
                ]);

            this.addChild(enemy);
        };
    }

    return Simulation;
});