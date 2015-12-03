define(function (require) {

    var THREE = require('three');

    function Point(mass) {
        this.position        = new THREE.Vector3(0,0,0);
        this.initialPosition = new THREE.Vector3(0,0,0);
        this.velocity        = new THREE.Vector3(0,0,0);
        this.acceleration    = new THREE.Vector3(0,0,0);
        this.mass = mass || 1;
    }

    // F = -kx;
    // m/a = -kx;
    // 1/a = -kx / m
    // a = -m/k * 1/x

    function PlayArea(width, height) {
        this.top    = height/2;
        this.bottom = -height/2;
        this.left   = -width/2;
        this.right  = width/2;
        this.width  = width;
        this.height = height;
        this.vecMin = new THREE.Vector3(this.left, this.bottom, 0);
        this.vecMax = new THREE.Vector3(this.right, this.top, 0);
        this.points = [];
        this.scene = this.createScene();
    }

    function getMidRandom(number) {
        return Math.random() * number - number * 0.5;
    }

    PlayArea.prototype.createScene = function () {
        var material = new THREE.LineBasicMaterial({
            color: 0x66ff00
        });

        var geometry = new THREE.Geometry();

        var rows = 40;
        var cols = 20;
        var i, j, point;

        for (i = 0; i <= rows; i++) {
            this.points[i] = [];
            for (j = 0; j <= cols; j++) {
                var point = new Point();
                var x = this.width * i / rows - this.width * 0.5;
                var y = this.height * j / cols - this.height * 0.5;
                point.position.set(x, y, 0);
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

    PlayArea.prototype.getRandomXCoord = function () {
        return getMidRandom(this.width);
    }

    PlayArea.prototype.getRandomYCoord = function () {
        return getMidRandom(this.height);
    }

    PlayArea.prototype.isOut = function (go) {
        return go.position.x < this.left
                 || go.position.y < this.bottom 
                 || go.position.x > this.right 
                 || go.position.y > this.top;
    }

    PlayArea.prototype.isInside = function (go) {
        return !this.isOut(go);
    }

    return PlayArea;
});