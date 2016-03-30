define(function (require) {

    var THREE = require('three');
    

    function GameRenderer (playArea) {
        // setup scene 
        this.scene = new THREE.Scene(); // setup scene 
        this.setupCamera(playArea);             // camera
        this.setupRenderer();           // setup renderer
        this.setupComposer();           // setup composer

    }

    GameRenderer.prototype.setupCamera = function (playArea) {
        var width = window.innerWidth;
        var height = window.innerHeight;

        this.camera = new THREE.PerspectiveCamera( 60, width / height, 1, 5000 );
        this.camera.position.z = 500;
        this.camera.position.x = playArea.width / 2;
        this.camera.position.y = -playArea.height / 2;
    }

    GameRenderer.prototype.setupRenderer = function () {
        var scope = this;

        // setup renderer
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setPixelRatio( window.devicePixelRatio || 1 );
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.autoClear = false;

        window.onresize = function() {
            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;

            scope.camera.aspect = window.innerWidth / window.innerHeight;
            scope.camera.updateProjectionMatrix();

            scope.renderer.setSize( window.innerWidth, window.innerHeight );

            scope.composer && scope.composer.reset();
        };
    }

    GameRenderer.prototype.setupComposer = function () {
        var renderModel = new THREE.RenderPass( this.scene, this.camera );
        var effectBloom = new THREE.BloomPass( 2.2, 25, 4.0, 256 );
        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
            effectCopy.renderToScreen = true;

        this.composer = new THREE.EffectComposer( this.renderer );

        this.composer.addPass( renderModel );
        this.composer.addPass( effectBloom );
        this.composer.addPass( effectCopy );
    }

    GameRenderer.prototype.getScene = function () {
        return this.scene;
    }

    GameRenderer.prototype.addToScreen = function () {
        document.body.appendChild( this.renderer.domElement );
    }

    GameRenderer.prototype.removeFromScreen = function () {
        document.body.removeChild( this.renderer.domElement );
    }

    GameRenderer.prototype.render = function () {
        // this.renderer.clear();
        // this.renderer.render(this.scene, this.camera);
        this.composer.render( 0.1 ); 
    }

    GameRenderer.prototype.dispose = function () {
        this.removeFromScreen();
        window.onresize  = null;
    }

    return GameRenderer;
});