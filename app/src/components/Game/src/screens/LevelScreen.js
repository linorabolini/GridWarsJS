import Entity from "../../engine/objects/entity";
import THREE from "../../engine/three";
import Controller from "../../engine/objects/controller";
import GameObject from "../GameObject";
import Weapon from "../components/Weapon";
import PlayArea from "../PlayArea";
import ParticleManager from "../ParticleManager";
import PointField from "../PointField";
import InventoryComponent from "../components/InventoryComponent";
import PlayerControllerComponent from "../components/PlayerControllerComponent";
import FollowTargetsMover from "../components/FollowTargetsMover";
import LinkedTargetMover from "../components/LinkedTargetMover";
import RandomPointMover from "../components/RandomPointMover";
import SpriteComponent from "../components/SpriteComponent";
import SimpleMover from "../components/SimpleMover";
import _ from "lodash";
import input from "../../engine/input";

class LevelScreen extends Entity {
    constructor() {
        super();

        this.players = [];
        this.enemies = [];
        this.bullets = [];
        this.gameObjects = [this.players, this.enemies, this.bullets];

        this.tmpVector = new THREE.Vector3(0, 0, 0);

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
        input.on("input", i => this.handleInput(i));
        input.on("new source", c => this.addPlayer(c));
    }

    setupCamera() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 5000);
        this.camera.position.z = 30;
    }

    setupRenderer() {
        var scope = this;

        // setup renderer
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;

        window.onresize = function () {
            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;

            scope.camera.aspect = window.innerWidth / window.innerHeight;
            scope.camera.updateProjectionMatrix();

            scope.renderer.setSize(window.innerWidth, window.innerHeight);

            scope.composer && scope.composer.reset();
        };
    }

    setupComposer() {
        var renderModel = new THREE.RenderPass(this.scene, this.camera);
        var effectBloom = new THREE.BloomPass(2.2, 25, 4.0, 256);
        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;

        this.composer = new THREE.EffectComposer(this.renderer);

        this.composer.addPass(renderModel);
        this.composer.addPass(effectBloom);
        this.composer.addPass(effectCopy);
    }

    rotateCamera(axis, value) {
        // this.cameraHelper.rotateCamera(axis, value);
    }

    handleInput(event) {
        var controller = this.getPlayerById(event.id).controller;
        _.each(event.data, function (item, key, data) {
            controller.set(key, data[key]);
        });
    }

    createBullets() {
        for (var i = 100 - 1; i >= 0; i--) {
            var bullet = new GameObject();
            bullet.addComponents([
                new SpriteComponent(this.scene, "assets/images/Bullet.png"),
                new SimpleMover(),
            ]);

            bullet.deactivate();
            this.bullets.push(bullet);
            this.addChild(bullet);
        }
    }

    createParticleManager() {
        this.particleManager = new ParticleManager(
            1000,
            this.playArea,
            this.scene
        );
        this.addChild(this.particleManager);
    }

    createPointField() {
        this.pointField = new PointField(this.playArea, this.scene, 80, 80);
        this.addChild(this.pointField);
    }

    createEnemies() {
        var i;
        var enemy;

        for (i = 10 - 1; i >= 0; i--) {
            enemy = new GameObject();
            enemy.addComponents([
                new SpriteComponent(this.scene, "assets/images/Seeker.png"),
                new FollowTargetsMover(7, this.players),
            ]);

            this.spawnEnemy(enemy);
            this.enemies.push(enemy);
            this.addChild(enemy);
        }

        for (i = 10 - 1; i >= 0; i--) {
            enemy = new GameObject();
            enemy.addComponents([
                new SpriteComponent(this.scene, "assets/images/Wanderer.png"),
                new RandomPointMover(7, this.playArea, true),
            ]);

            this.spawnEnemy(enemy);
            this.enemies.push(enemy);
            this.addChild(enemy);
        }

        var j, nodes;

        for (i = 2 - 1; i >= 0; i--) {
            nodes = [];
            enemy = new GameObject();
            enemy.addComponents([
                new SpriteComponent(this.scene, "assets/images/Pointer.png"),
                new FollowTargetsMover(7, this.players),
            ]);

            this.spawnEnemy(enemy);
            this.enemies.push(enemy);
            this.addChild(enemy);

            nodes.push(enemy);

            for (j = 1; j <= 20; j++) {
                enemy = new GameObject();
                enemy.addComponents([
                    new SpriteComponent(this.scene, "assets/images/Seeker.png"),
                    new LinkedTargetMover(nodes, j - 1),
                ]);

                enemy.isCollisionable = false;

                nodes[j] = enemy;

                this.spawnEnemy(enemy);
                this.enemies.push(enemy);
                this.addChild(enemy);
            }
        }
    }

    addPlayers(inputSources) {
        Object.entries(inputSources).forEach(([k, v]) => {
            this.addPlayer(v);
        });
    }

    addPlayer(config) {
        var controller = new Controller(config.keyMap);
        var weapon = new Weapon(this.bullets);

        var inventory = new InventoryComponent();
        inventory.addItem(weapon);

        var player = new GameObject();
        player.addComponents([
            new SpriteComponent(this.scene, "assets/images/Player.png"),
            new PlayerControllerComponent(
                controller,
                inventory,
                this.particleManager
            ),
            inventory,
        ]);

        player.controller = controller;
        player.activate();
        this.addChild(player);

        this.setPlayerById(config.internalSourceId, player);
    }

    setPlayerById(id, value) {
        this.players[id] = value;
    }

    getPlayerById(id) {
        return this.players[id];
    }

    addToScreen() {
        document.body.appendChild(this.renderer.domElement);
    }

    removeFromScreen() {
        document.body.removeChild(this.renderer.domElement);
    }

    update(dt) {
        super.update(dt);
        this.checkCollisions(dt);
    }

    checkCollisions(dt) {
        //  enemy vs enemy
        var go_tmp_1;
        var go_tmp_2;
        var i;
        var j;

        for (i = this.enemies.length - 1; i >= 0; i--) {
            go_tmp_1 = this.enemies[i];
            if (!go_tmp_1.isActive || !go_tmp_1.isCollisionable) {
                continue;
            }
            for (j = i - 1; j >= 0; j--) {
                go_tmp_2 = this.enemies[j];
                if (!go_tmp_2.isActive || !go_tmp_2.isCollisionable) {
                    continue;
                }
                this.tmpVector.subVectors(go_tmp_2.position, go_tmp_1.position);
                var lenSq = this.tmpVector.lengthSq();
                if (lenSq < go_tmp_2.radius + go_tmp_1.radius) {
                    this.tmpVector.multiplyScalar(3 / (lenSq + 1));
                    go_tmp_2.velocity.add(this.tmpVector);
                    go_tmp_1.velocity.sub(this.tmpVector);
                }
            }
        }

        // bullet vs enemy

        for (i = this.bullets.length - 1; i >= 0; i--) {
            go_tmp_1 = this.bullets[i];
            if (!go_tmp_1.isActive) {
                continue;
            }

            // bullet vs boundaries
            if (this.playArea.isOut(go_tmp_1)) {
                this.particleManager.createExplosion(
                    go_tmp_1.position,
                    10,
                    15,
                    10
                );
                this.pointField.createExplosion(go_tmp_1.position, 10);
                go_tmp_1.deactivate();
            }

            // bullet vs enemies
            for (j = this.enemies.length - 1; j >= 0; j--) {
                go_tmp_2 = this.enemies[j];
                if (!go_tmp_2.isActive) {
                    continue;
                }
                this.tmpVector.subVectors(go_tmp_2.position, go_tmp_1.position);
                if (
                    this.tmpVector.lengthSq() <
                    go_tmp_2.radius + go_tmp_1.radius
                ) {
                    this.particleManager.createExplosion(
                        go_tmp_2.position,
                        50,
                        30,
                        20
                    );
                    this.pointField.createExplosion(go_tmp_2.position, 100);
                    go_tmp_1.deactivate();
                    go_tmp_2.deactivate();
                    // this.spawnEnemy(go_tmp_2);
                    break;
                }
            }
        }

        //  enemy vs player

        for (i = this.enemies.length - 1; i >= 0; i--) {
            go_tmp_1 = this.enemies[i];
            if (!go_tmp_1.isActive) {
                continue;
            }
            for (j = this.players.length - 1; j >= 0; j--) {
                go_tmp_2 = this.players[j];
                if (!go_tmp_2.isActive) {
                    continue;
                }
                this.tmpVector.subVectors(go_tmp_2.position, go_tmp_1.position);
                if (
                    this.tmpVector.lengthSq() <
                    go_tmp_2.radius + go_tmp_1.radius
                ) {
                    // this.onPlayerDead(go_tmp_2);
                    break;
                }
            }
        }

        // all with playArea
        //
        for (i = this.gameObjects.length - 1; i >= 0; i--) {
            for (j = this.gameObjects[i].length - 1; j >= 0; j--) {
                go_tmp_1 = this.gameObjects[i][j];
                if (!go_tmp_1.isActive) {
                    continue;
                }
                go_tmp_1.position.clamp(
                    this.playArea.vecMin,
                    this.playArea.vecMax
                );
            }
        }
    }

    onPlayerDead(player) {
        for (var k = this.enemies.length - 1; k >= 0; k--) {
            var enemy = this.enemies[k];
            enemy.deactivate();
            this.spawnEnemy(enemy);
        }
    }

    spawnEnemy(enemy) {
        var xPos =
            Math.random() > 0.5
                ? this.playArea.right - Math.random()
                : this.playArea.left + Math.random();
        var yPos =
            Math.random() > 0.5
                ? this.playArea.top - Math.random()
                : this.playArea.bottom + Math.random();
        enemy.position.set(xPos, yPos, 0);
        enemy.activate();
    }

    render() {
        super.render();

        this.renderer.clear();
        this.composer.render(0.1);
    }

    dispose() {
        this.removeFromScreen();
        window.onresize = null;
        this.players = null;
        this.bullets = null;
        this.enemies = null;
        this.gameObjects = null;

        super.dispose();
    }
}
export default LevelScreen;
