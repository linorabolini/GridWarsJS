define(function (require) {

    function PlayArea(width, height) {
        this.top = height/2;
        this.bottom = -height/2;
        this.left = -width/2;
        this.right = width/2;
        this.width = width;
        this.height = height;
    }

    function getMidRandom(number) {
        return Math.random() * number - number * 0.5;
    }

    PlayArea.prototype.getRandomXCoord = function () {
        return getMidRandom(this.width);
    }

    PlayArea.prototype.getRandomYCoord = function () {
        return getMidRandom(this.height);
    }

    return PlayArea;
});