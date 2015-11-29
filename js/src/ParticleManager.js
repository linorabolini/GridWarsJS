define(function (require) {

    var Entity = require('entity'),
        THREE  = require('three');

    return Entity.extend({
        init: function (particleCount, playArea, scene) {
            this.__init();
            this.scene = scene;
            this.playArea = playArea;
            this.particleCount = particleCount;

            var uniforms = {
                color:     { type: "c", value: new THREE.Color( 0xffffff ) },
                texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "assets/images/Laser.png" ) }
            };

            var shaderMaterial = new THREE.ShaderMaterial( {

                uniforms:       uniforms,
                vertexShader:   document.getElementById( 'vertexshader' ).textContent,
                fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

                blending:       THREE.AdditiveBlending,
                depthTest:      false,
                transparent:    true

            });

            var geometry = new THREE.BufferGeometry();

            var positions = new Float32Array( particleCount * 3 );
            var colors = new Float32Array( particleCount * 3 );
            var sizes = new Float32Array( particleCount );
            var rotations = new Float32Array( particleCount );

            var color = new THREE.Color();

            for ( var i = 0, i3 = 0; i < particleCount; i ++, i3 += 3 ) {

                positions[ i3 + 0 ] = this.playArea.getRandomXCoord();
                positions[ i3 + 1 ] = this.playArea.getRandomYCoord();
                positions[ i3 + 2 ] = 0;

                color.setHSL( i / particleCount, 1.0, 0.5 );

                colors[ i3 + 0 ] = color.r;
                colors[ i3 + 1 ] = color.g;
                colors[ i3 + 2 ] = color.b;

                sizes[ i ] = 2;


            }

            geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
            geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
            geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
            geometry.addAttribute( 'rotation', new THREE.BufferAttribute( rotations, 1 ) );

            this.particleSystem = new THREE.Points( geometry, shaderMaterial );

            this.scene.add(this.particleSystem);
        },

        dispose: function () {
            this.scene.remove(this.particleSystem);
            this.scene = null;
            this.playArea = null;
            this.__dispose();
        },
        update: function (dt) {
            this.__update(dt);

            var time = Date.now() * 0.005;

            var sizes = this.particleSystem.geometry.attributes.size.array;
            var rotations = this.particleSystem.geometry.attributes.rotation.array;

            for ( var i = 0; i < this.particleCount; i++ ) {

                sizes[ i ] = 3 * ( 1 + Math.sin( 0.1 * i + time ) );
                rotations[ i ] = 1 * ( 1 + Math.sin( 0.1 * i + time ) );

            }

            // flag to the particle system
            // that we've changed its vertices.
            this.particleSystem.geometry.attributes.size.needsUpdate = true;
            this.particleSystem.geometry.attributes.rotation.needsUpdate = true;
        }
    })
});