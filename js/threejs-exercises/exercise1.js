$(document).ready(function () {

    var renderer;
    var scene;
    var camera;
    var controls;

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        controls = new THREE.OrbitControls( camera );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        var ambient = new THREE.AmbientLight( 0xffffff );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( -1, -1, -1 ).normalize();
        scene.add( directionalLight );

        var axis = new THREE.AxisHelper();
        axis.scale.set(10, 10, 10);
        scene.add(axis);

        var tableMaterial = new THREE.MeshPhongMaterial( { ambient: 0x7F7F7F, color: 0x7F7F7F, specular: 0x7F7F7F, shininess: 3 } );
        var floorMaterial = new THREE.MeshPhongMaterial( { ambient: 0x454545, color: 0x454545, specular: 0x454545, shininess: 3 } );

        var topGeom = new THREE.BoxGeometry(5, 0.3, 3);
        var legGeom = new THREE.BoxGeometry(0.3, 3.5, 0.3);
        var floorGeom = new THREE.BoxGeometry(8, 0.1, 6);

        var floorMesh = new THREE.Mesh( floorGeom, floorMaterial );
        floorMesh.position.set(4, 0, 3);
        scene.add( floorMesh );

        var topMesh = new THREE.Mesh( topGeom, tableMaterial );
        topMesh.position.set(4, 3.7, 3);
        scene.add( topMesh );

        var topLeftLeg = new THREE.Mesh( legGeom, tableMaterial );
        topLeftLeg.position.set( 6.2, 1.8,  4.2);
        scene.add( topLeftLeg );

        var topRightLeg = new THREE.Mesh( legGeom, tableMaterial );
        topRightLeg.position.set(6.2, 1.8, 1.8);
        scene.add( topRightLeg );

        var bottomLeftLeg = new THREE.Mesh( legGeom, tableMaterial );
        bottomLeftLeg.position.set(1.8, 1.8,  4.2);
        scene.add( bottomLeftLeg );

        var bottomRightLeg = new THREE.Mesh( legGeom, tableMaterial );
        bottomRightLeg.position.set(1.8, 1.8, 1.8);
        scene.add( bottomRightLeg );



        camera.position.set(4, 7, 7);
        camera.rotation.x = -1;
    }

    function update() {
        controls.update();
    }

    function display() {
        renderer.render( scene, camera );
    }

    function renderLoop() {
        requestAnimationFrame( renderLoop );

        update();
        display();
    }

    init();
    $('body').append( renderer.domElement );

    renderLoop();

});