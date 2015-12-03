define(function (require) {

    var THREE = require('three');

    function Weapon(bullets, delay) {
        this.bullets = bullets || [];
        this.elapsed = 0;
        this.delay = delay || 1/10;
        this.canFire = true;
        this.cannonOffsets = [
            new THREE.Vector3( 1, 0.3, 0 ),
            new THREE.Vector3( 1, -0.3, 0 )
        ];

        this.tmpVector = new THREE.Vector3( 0, 0, 0 );
        this.quaternion = new THREE.Quaternion();
        this.UP = new THREE.Vector3( 0, 0, 1 );
    }

    Weapon.prototype.update = function (go, delta) {
        this.elapsed += delta;
        if(this.elapsed > this.delay) {
            this.elapsed -= this.delay;
            this.canFire = true;
        }
    }

    Weapon.prototype.dispose = function (go) {
        this.bullets = null;
    }

    Weapon.prototype.setup = function (go) { }
    Weapon.prototype.activate = function (go) { }
    Weapon.prototype.deactivate = function (go) { }
    Weapon.prototype.render = function (go) { }

    Weapon.prototype.doUseBy = function (go) {
        for (var i = this.cannonOffsets.length - 1; i >= 0; i--) {
            this.fire(this.getBullet(), go, this.cannonOffsets[i]);
        };
        this.canFire = false;
    }

    Weapon.prototype.fire = function (bullet, go, offset) {
        if(!this.canFire || !bullet)
            return

        this.quaternion.setFromAxisAngle( this.UP, go.rotation );

        this.tmpVector.copy(offset)
            .applyQuaternion(this.quaternion);
        
        bullet.position.copy(go.position)
            .add(this.tmpVector);

        bullet.rotation = go.rotation;
        bullet.activate();
        this.elapsed = 0;
    }

    Weapon.prototype.getBullet = function () {
        for (var i = 0; i < this.bullets.length; ++i) {
            if (!this.bullets[i].isActive) {
                return this.bullets[i];
            }
        }
        return null;
    }

    return Weapon;
});