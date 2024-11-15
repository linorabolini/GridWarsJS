import THREE from "../engine/three";

function getMidRandom(number) {
    return Math.random() * number - number * 0.5;
}

class PlayArea {
    constructor(width, height) {
        this.top = height / 2;
        this.bottom = -height / 2;
        this.left = -width / 2;
        this.right = width / 2;
        this.width = width;
        this.height = height;
        this.vecMin = new THREE.Vector3(this.left, this.bottom, 0);
        this.vecMax = new THREE.Vector3(this.right, this.top, 0);
    }

    getRandomXCoord() {
        return getMidRandom(this.width);
    }

    getRandomYCoord() {
        return getMidRandom(this.height);
    }

    isOut(go) {
        return (
            go.position.x < this.left ||
            go.position.y < this.bottom ||
            go.position.x > this.right ||
            go.position.y > this.top
        );
    }

    isInside(go) {
        return !this.isOut(go);
    }
}
export default PlayArea;
