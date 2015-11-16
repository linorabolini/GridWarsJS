define(function (require) {

    function Weapon(bullets) {
        this.bullets = bullets || [];
        this.elapsed = 0;
        this.delay = 1/10;
        this.canFire = true;
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
        var bullet = this.getBullet();
        if (bullet) {
            this.fire(bullet, go);
        }
    }

    Weapon.prototype.fire = function (bullet, go) {
        if(!this.canFire)
            return
        
        bullet.position.copy(go.position);
        bullet.rotation = go.rotation;
        bullet.activate();
        this.elapsed = 0;
        this.canFire = false;
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