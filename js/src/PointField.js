define(function (require) {

    var Entity = require('entity'),
        THREE  = require('three');

    function Point(mass, springConstant) {
        this.position        = new THREE.Vector3(0,0,0);
        this.initialPosition = new THREE.Vector3(0,0,0);
        this.velocity        = new THREE.Vector3(0,0,0);
        this.acceleration    = new THREE.Vector3(0,0,0);
        this.force           = new THREE.Vector3(0,0,0);
        this.springConstant  = springConstant || -0.5;
        this.mass = mass || 1;
    }

    // F = -kx;
    // m * a = -kx;
    // a = -kx / m
    // a = (-k/m) * x 
    
    var tmpVector = new THREE.Vector3(0,0,0);
    var geometry = null;
    
    return Entity.extend({
        init: function (playArea, scene, rows, cols) {
            this.__init();
            this.points = [];
            this.rows = rows;
            this.cols = cols;
            this.playArea = playArea;
            this.scene = scene;
            this.net = this.createNet(this.rows, this.cols);
            this.scene.add(this.net);
        },
        createNet: function (rows, cols) {
            var material = new THREE.LineBasicMaterial({
                color: 0x66ff00
            });

            geometry = new THREE.Geometry();

            var i, j, point;

            for (i = 0; i <= rows; i++) {
                this.points[i] = [];
                for (j = 0; j <= cols; j++) {
                    var point = new Point();
                    var x = this.playArea.width * i / rows - this.playArea.width * 0.5;
                    var y = this.playArea.height * j / cols - this.playArea.height * 0.5;
                    point.position.set(x, y, 0);
                    point.initialPosition.copy(point.position);
                    this.points[i][j] = point;
                };
            };

            for (i = 0; i <= rows; i++) {
                for (j = 0; j <= cols; j++) {
                    if(i % 2)
                        point = this.points[i][j];
                    else
                        point = this.points[i][cols - j];
                    geometry.vertices.push(point.position);
                };
            };

            for (j = cols; j >= 0; j--) {
                for (i = 0; i <= rows; i++) {
                    if(j % 2)
                        point = this.points[i][j];
                    else
                        point = this.points[rows - i][j];
                    geometry.vertices.push(point.position);
                };
            };


            var line = new THREE.Line( geometry, material );

            return line;
        },
        createExplosion: function (position, force) {
            force = force || 20;
            
            for (i = 0; i <= this.rows; i++) {
                for (j = 0; j <= this.cols; j++) {
                    var point = this.points[i][j];

                    tmpVector.subVectors(point.position, position)
                        .multiplyScalar(force / tmpVector.lengthSq());

                    point.force.add(tmpVector);
                }
            };
        },
        update: function (dt) {

            for (i = 0; i <= this.rows; i++) {
                for (j = 0; j <= this.cols; j++) {
                    var point = this.points[i][j];

                    point.force.set(0, 0, 0);
                }
            }

            this.__update(dt);
        },
        postUpdate: function (dt) {

            for (i = 0; i <= this.rows; i++) {
                for (j = 0; j <= this.cols; j++) {
                    var point = this.points[i][j];

                    // add spring force 
                    tmpVector.subVectors(point.position, point.initialPosition)
                        .multiplyScalar(point.springConstant);

                    point.force.add(tmpVector);

                    // convert force to acceleration
                    tmpVector.copy(point.force)
                        .multiplyScalar(1/point.mass);

                    point.acceleration.copy(tmpVector);

                    // add acceleration to velocity
                    point.velocity.add(point.acceleration)
                        .multiplyScalar(0.9);

                    // transform velocity into position
                    tmpVector.copy(point.velocity)
                        .multiplyScalar(dt);

                    point.position.add(tmpVector)
                        .clamp(this.playArea.vecMin, this.playArea.vecMax);

                    if (point.position.x <= this.playArea.left || point.position.x >= this.playArea.right) {
                        var  vx = point.velocity.x;
                        point.velocity.setX(-vx);
                    }

                    if (point.position.y <= this.playArea.bottom || point.position.y >= this.playArea.top) {
                        var  vy = point.velocity.y;
                        point.velocity.setY(-vy);
                    }

                }
            }
            geometry.verticesNeedUpdate = true;
        },
        dispose: function () {
            this.points = null;
            this.scene.remove(this.net);
            this.scene = null;
            this.__dispose();
        }
    });

});