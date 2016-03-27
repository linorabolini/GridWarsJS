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
    
    
    function PointField (playArea, scene, rows, cols) {
        Entity.call(this);

        this.points = [];
        this.rows = rows;
        this.cols = cols;
        this.playArea = playArea;
        this.scene = scene;
        this.net = this.createNet(this.rows, this.cols);
        this.net.position.set(500, -250, 0);
        this.scene.add(this.net);
    }

    PointField.prototype = new Entity();

    PointField.prototype.createNet = function (rows, cols) {
        var material = new THREE.LineBasicMaterial({
            color: 0x003300,
            linewidth: 1,
            blending: THREE.AdditiveBlending
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
    }

    PointField.prototype.createExplosion = function (position, force) {
        force = force || 20;

        position.setZ(-1);
        
        // starts from 1 to avoid borders
        for (i = 1; i < this.rows; i++) {
            for (j = 1; j < this.cols; j++) {
                var point = this.points[i][j];

                tmpVector.subVectors(point.position, position)
                    .multiplyScalar(force / tmpVector.lengthSq());

                point.force.add(tmpVector);
            }
        };
    }

    PointField.prototype.update = function (dt) {
        Entity.prototype.update.call(this, arguments);

        for (i = 0; i <= this.rows; i++) {
            for (j = 0; j <= this.cols; j++) {
                var point = this.points[i][j];

                point.force.set(0, 0, 0);
            }
        }
    }

    PointField.prototype.lateUpdate = function (dt) {

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
    }

    PointField.prototype.dispose = function () {
        this.points = null;
        this.scene.remove(this.net);
        this.scene = null;
        
        Entity.prototype.dispose.call(this, arguments);
    }

    return PointField;

});