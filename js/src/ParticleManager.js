define(function (require) {

    var Entity = require('entity'),
        THREE  = require('three');


    function Particle(color) {
        this.position = new THREE.Vector3(0,0,0);
        this.velocity = new THREE.Vector3(0,0,0);
        this.rotation = 0.0;
        this.size = 2.0;
        this.alpha = 1.0;
        this.color = color;
    }

    tmpVector = new THREE.Vector3(0,0,0);

    return Entity.extend({
        init: function (particleCount, playArea, scene) {
            this.__init();
            this.scene = scene;
            this.playArea = playArea;
            this.particleCount = particleCount;
            this.particles = [];

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
            var alphas = new Float32Array( particleCount );

            var particle = null;

            for ( var i = 0, i3 = 0; i < particleCount; i ++, i3 += 3 ) {

                particle = new Particle();

                particle.color = new THREE.Color();
                particle.color.setHSL( i / particleCount, 1.0, 0.5 );
                particle.position.setX(this.playArea.getRandomXCoord());
                particle.position.setY(this.playArea.getRandomYCoord());

                particle.velocity.setX(this.playArea.getRandomXCoord());
                particle.velocity.setY(this.playArea.getRandomYCoord());

                this.particles.push(particle);

                positions[ i3 + 0 ] = particle.position.x;
                positions[ i3 + 1 ] = particle.position.y;
                positions[ i3 + 2 ] = particle.position.z;

                colors[ i3 + 0 ] = particle.color.r;
                colors[ i3 + 1 ] = particle.color.g;
                colors[ i3 + 2 ] = particle.color.b;

                sizes[ i ] = particle.size;

                alphas[ i ] = 0.0;
            }

            geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
            geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
            geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
            geometry.addAttribute( 'rotation', new THREE.BufferAttribute( rotations, 1 ) );
            geometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );

            this.particleSystem = new THREE.Points( geometry, shaderMaterial );

            this.scene.add(this.particleSystem);
        },

        dispose: function () {
            this.scene.remove(this.particleSystem);
            this.scene = null;
            this.playArea = null;
            this.__dispose();
        },
        createBurst: function (position, qty, force, forceV) {
            force = force || 20;
            forceV = forceV || 20;
            var count = qty;
            while(--count) {
                var particle = this.getParticle();
                if(!particle) {
                    console.warn("NO PARTICLE");
                    return;
                }

                particle.position.copy(position);
                particle.velocity.set(this.playArea.getRandomXCoord(), this.playArea.getRandomYCoord(), 0);
                particle.velocity.setLength(Math.random() * forceV + force);
                particle.alpha = 1.0;
            };
        },
        getParticle: function () {
            for (var i = this.particles.length - 1; i >= 0; i--) {
                var particle = this.particles[i];
                if(particle.alpha === 0.0) {
                    return particle;
                }
            };
            return null;
        },
        update: function (dt) {
            this.__update(dt);

            var positions = this.particleSystem.geometry.attributes.position.array;
            var sizes = this.particleSystem.geometry.attributes.size.array;
            var rotations = this.particleSystem.geometry.attributes.rotation.array;
            var alphas = this.particleSystem.geometry.attributes.alpha.array;
            var colors = this.particleSystem.geometry.attributes.customColor.array;
            var particle = null;

            for ( var i = 0, i3 = 0; i < this.particleCount; i ++, i3 += 3 ) {

                particle = this.particles[i];

                tmpVector.set(0,0,0);
                particle.velocity.multiplyScalar(0.9);
                tmpVector.add(particle.velocity);
                tmpVector.multiplyScalar(dt);
                particle.rotation = Math.atan2(tmpVector.x, tmpVector.y) + Math.PI / 2;
                particle.position.add(tmpVector);
                particle.alpha = Math.min(2.0, particle.velocity.lengthSq());
                if(particle.alpha < 0.05) {
                    particle.alpha = 0.0;
                }

                positions[ i3 + 0 ] = particle.position.x;
                positions[ i3 + 1 ] = particle.position.y;
                // positions[ i3 + 2 ] = particle.position.z;

                colors[ i3 + 0 ] = particle.color.r;
                colors[ i3 + 1 ] = particle.color.g;
                colors[ i3 + 2 ] = particle.color.b;

                sizes[ i ] = particle.size;

                rotations[ i ] = particle.rotation;

                alphas[ i ] = particle.alpha;

            }

            // flag to the particle system
            // that we've changed its vertices.
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
            this.particleSystem.geometry.attributes.size.needsUpdate = true;
            this.particleSystem.geometry.attributes.rotation.needsUpdate = true;
            this.particleSystem.geometry.attributes.alpha.needsUpdate = true;
            this.particleSystem.geometry.attributes.customColor.needsUpdate = true;
        }
    })
});