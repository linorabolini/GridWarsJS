define(function (require) {

    var THREE = require('three');

    function PlayArea(width, height) {
        this.top    = height/2;
        this.bottom = -height/2;
        this.left   = -width/2;
        this.right  = width/2;
        this.width  = width;
        this.height = height;
        this.vecMin = new THREE.Vector3(this.left, this.bottom, 0);
        this.vecMax = new THREE.Vector3(this.right, this.top, 0);
    }

    function getMidRandom(number) {
        return Math.random() * number - number * 0.5;
    }

    PlayArea.prototype.getRandomXCoord = function () {
        return Math.random() * this.width;
    }

    PlayArea.prototype.getRandomYCoord = function () {
        return Math.random() * this.height;
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