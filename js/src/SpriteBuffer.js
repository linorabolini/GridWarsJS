define(function (require) {

    var Entity = require('entity'),
        THREE  = require('three');


    function SpriteModel(color) {
        this.position = {x: 0, y:0, z:0};
        this.rotation = 0.0;
        this.size = 1.0;
        this.alpha = 1.0;
        this.color = color;
        this.isFree = true;
    }

    function SpriteBuffer (texture, bufferCount, scene) {
        Entity.call(this);

        this.scene = scene;
        this.bufferCount = bufferCount;
        this.buffer = [];

        var uniforms = {
            color:     { type: "c", value: new THREE.Color( 0xffffff ) },
            texture:   { type: "t", value: THREE.ImageUtils.loadTexture( texture ) },
            scale:     { type: 'f', value: window.innerHeight / 40 }
        };

        var shaderMaterial = new THREE.ShaderMaterial( {
            uniforms:       uniforms,
            vertexShader:   document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

            // blending:       THREE.AdditiveBlending,
            depthTest:      false,
            transparent:    true
        });

        var geometry = new THREE.BufferGeometry();

        var positions = new Float32Array( bufferCount * 3 );
        var colors = new Float32Array( bufferCount * 3 );
        var sizes = new Float32Array( bufferCount );
        var rotations = new Float32Array( bufferCount );
        var alphas = new Float32Array( bufferCount );

        var sprite = null;

        for ( var i = 0, i3 = 0; i < bufferCount; i ++, i3 += 3 ) {

            sprite = new SpriteModel();

            sprite.color = new THREE.Color();
            sprite.color.setHSL( i / bufferCount, 1.0, 1.0 );

            this.buffer.push(sprite);

            positions[ i3 + 0 ] = sprite.position.x;
            positions[ i3 + 1 ] = sprite.position.y;
            positions[ i3 + 2 ] = sprite.position.z;

            colors[ i3 + 0 ] = sprite.color.r;
            colors[ i3 + 1 ] = sprite.color.g;
            colors[ i3 + 2 ] = sprite.color.b;

            sizes[ i ] = sprite.size;

            alphas[ i ] = 0.0;
        }

        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
        geometry.addAttribute( 'rotation', new THREE.BufferAttribute( rotations, 1 ) );
        geometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );

        this.bufferGeometry = new THREE.Points( geometry, shaderMaterial );

        this.scene.add(this.bufferGeometry);
    }

    SpriteBuffer.prototype = new Entity();

    SpriteBuffer.prototype.dispose = function () {
        this.scene.remove(this.bufferGeometry);
        this.scene = null;
        this.buffer = null;

        Entity.prototype.dispose.call(this, arguments);
    }

    SpriteBuffer.prototype.getSprite = function () {
        for (var i = this.buffer.length - 1; i >= 0; i--) {
            var sprite = this.buffer[i];
            if(sprite.isFree) {
                sprite.isFree = false;
                return sprite;
            }
        };
        return null;
    }

    SpriteBuffer.prototype.update = function (dt) {
        Entity.prototype.update.call(this, dt);

        var positions = this.bufferGeometry.geometry.attributes.position.array;
        var sizes     = this.bufferGeometry.geometry.attributes.size.array;
        var rotations = this.bufferGeometry.geometry.attributes.rotation.array;
        var alphas    = this.bufferGeometry.geometry.attributes.alpha.array;
        var colors    = this.bufferGeometry.geometry.attributes.customColor.array;
        var sprite  = null;

        for ( var i = 0, i3 = 0; i < this.bufferCount; i ++, i3 += 3 ) {

            sprite = this.buffer[i];

            if(sprite.isFree || !sprite.alpha) {
                continue;
            }

            positions[ i3 + 0 ] = sprite.position.x;
            positions[ i3 + 1 ] = sprite.position.y;
            
            colors[ i3 + 0 ] = sprite.color.r;
            colors[ i3 + 1 ] = sprite.color.g;
            colors[ i3 + 2 ] = sprite.color.b;

            sizes[ i ] = sprite.size;

            rotations[ i ] = sprite.rotation;

            alphas[ i ] = sprite.alpha;
        }

        // flag to the sprite system
        // that we've changed its vertices.
        this.bufferGeometry.geometry.attributes.position.needsUpdate = true;
        this.bufferGeometry.geometry.attributes.size.needsUpdate = true;
        this.bufferGeometry.geometry.attributes.rotation.needsUpdate = true;
        this.bufferGeometry.geometry.attributes.alpha.needsUpdate = true;
        this.bufferGeometry.geometry.attributes.customColor.needsUpdate = true;
    }

    return SpriteBuffer;
});