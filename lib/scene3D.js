'use strict';

var THREE = require('three');
var dynamics = require('dynamics.js');
var async = require('async');
var OrbitControls = require('three-orbit-controls')(THREE);
// var textureLoader = new THREE.TextureLoader();
window.THREE = THREE;
require('../node_modules/three/examples/js/loaders/OBJLoader');

var generateGeometry = require('./generate3DGeometry');
var globals = require('./globals');
// var sine = require('./sine');
var space = require('./pt').space;
var materials = require('./materials');
var rose = require('./rose');
var aura = require('./aura');

var geometry, mesh, wireframe, camera, controls, sphere, floaters;
var shouldSpin = false;
// scene and camera
var scene = new THREE.Scene();

var roseMesh = new THREE.Object3D();

rose.load(function (mesh) {
  roseMesh = mesh;
});
// var raycaster = new THREE.Raycaster();

// renderer
var renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});

renderer.domElement.className = 'test';
renderer.domElement.style.visibility = 'hidden';
renderer.domElement.style.opacity = 0;

renderer.setSize(window.innerWidth, window.innerHeight);

// var normalMap = textureLoader.load('/assets/images/normal-map.jpg');
// var textureMap = textureLoader.load('../assets/images/normal-map.jpg');
// var displacementMap = textureLoader.load('../assets/images/displacement.jpg');

// main material
var material = materials.shell;

// wire frame material
var wireframeMaterial = materials.wireframe;


// spot light
var spotLight = new THREE.SpotLight(0xffc60f);
spotLight.position.set(0, 1, 0);
spotLight.castShadow = true;
spotLight.angle = 0.3;
spotLight.penumbra = 0.1;
spotLight.decay = 0.8;
spotLight.distance = 8;
spotLight.intensity = 0.5;
spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;

// var lightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(lightHelper);

// point light
var pointLight = new THREE.PointLight(0x390fff);
pointLight.intensity = 0.3;
pointLight.distance = 2;
pointLight.decay = 0.8;
pointLight.position.z = 0.4;

// var c = new THREE.Mesh(new THREE.SphereGeometry(0.01, 0.01, 0.01));

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(4, 1.5, 10);

var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight2.position.set(-4, -1.5, 12);
// window.dir = directionalLight;


// var pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);

// var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
// scene.add(directionalLightHelper);

function scaleUpTo3D(done) {
  async.parallel([
    function morphTo3D(cb) {
      dynamics.animate(wireframe.scale, {
        z: 1.0,
        x: 1.1,
        y: 1.1
      }, {
        duration: 3000
      });

      dynamics.animate(mesh.scale, {
        z: 1.0,
        x: 1.1,
        y: 1.1
      }, {
        duration: 3000
      });

      setTimeout(cb, 3100);
    },
    function revealTheBody(cb) {
      dynamics.animate(material, {
        opacity: 1
      }, {
        duration: 5000
      });
      setTimeout(cb, 5100);
    }
  ], done);
}

function startSpinning(done) {
  setTimeout(function () {
    shouldSpin = true;
    done();
  }, 500);
}


// initialise
module.exports.init = function (triangles) {
  var geometries = generateGeometry(triangles);
  var secondary = geometries.secondary;

  geometry = geometries.main;
  var spaceHeight = 2;
  var distance = 5;
  var fov = 2 * Math.atan(spaceHeight / (2 * distance)) * (180 / Math.PI);
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.z = distance;
  controls = new OrbitControls(camera);

  mesh = new THREE.Mesh(geometry, material);
  floaters = new THREE.Mesh(secondary, wireframeMaterial);

  mesh.id2 = 'mainMesh';
  wireframe = new THREE.Mesh(geometry, wireframeMaterial);
  wireframe.scale.set(1, 1, 0.00000001);

  var radius = geometry.boundingBox.max.y + Math.abs(geometry.boundingBox.min.y);
  var sphereG = new THREE.SphereGeometry(radius / 4, 10, 10);
  sphere = new THREE.Mesh(sphereG, wireframeMaterial);

  mesh.rotation.z = Math.PI;
  mesh.rotation.y = Math.PI;
  mesh.flipSided = true;
  mesh.doubleSided = true;
  mesh.morphTargetBase = 0;

  wireframe.rotation.copy(mesh.rotation);
  spotLight.target = mesh;
  directionalLight.target = mesh;

  pointLight.target = mesh;
  pointLight.lookAt(new THREE.Vector3(0, 0, -10));

  // var h = new THREE.FaceNormalsHelper(mesh);
  // scene.add(h);

  // var edges = new THREE.FaceNormalsHelper(mesh, 2, 0x00ff00, 1);
  // scene.add(edges);

  controls.update();

  scene.add(new THREE.AmbientLight('white', 0.09));
  scene.add(directionalLight);
  // scene.add(spotLight);
  // scene.add(pointLight);

  scene.add(wireframe);
  scene.add(mesh);

};

function addTheInsideMeshes(done) {
  // scene.add(sphere);
  // scene.add(floaters);
  scene.add(roseMesh);
  scene.add(aura);
  material.side = THREE.DoubleSide;
  material.needsUpdate = true;
  done();
}

module.exports.render = function () {
  var mouse = globals.getMousePosition();

  if (shouldSpin) {
    mesh.rotation.y += 0.007;
    sphere.rotation.y -= 0.006;
    floaters.rotation.y += 0.006;
    aura.rotation.y -= 0.006;
    roseMesh.rotation.y += 0.001;
  }

  mesh.scale.copy(wireframe.scale);

  // spotLight.position.x = sine(0.7, 0.35, Date.now() * 0.001, 0) * 2;
  // spotLight.position.y = 4.5 + sine(1.5, 0.2, Date.now() * 0.001, 0.5) * 8;

  var mouseVertex = new THREE.Vector2(((mouse.x / space.size.x) - 0.5) * 2, (((mouse.y / space.size.y) - 0.5) * 2) * -1);
  pointLight.position.x = mouseVertex.x;
  pointLight.position.y = mouseVertex.y;

  spotLight.lookAt(mesh.position);
  // roseMesh.rotation.y += mouseVertex.x * 0.0006;
  // roseMesh.rotation.x -= mouseVertex.y * 0.0006;
  wireframe.rotation.copy(mesh.rotation);

  wireframeMaterial.opacity = 1;

  renderer.render(scene, camera);
};

module.exports.updateMorph = function (value) {
  mesh.morphTargetInfluences[0] = value;
  wireframe.morphTargetInfluences[0] = value;
  // material.bumpScale = value * 10;
};

module.exports.displayCanvas = function () {
  renderer.domElement.style.visibility = 'visible';
  dynamics.animate(renderer.domElement, {
    opacity: 1
  }, {
    duration: 3000
  });
};

module.exports.startTransition = function (done) {
  async.series([
    scaleUpTo3D,
    addTheInsideMeshes,
    startSpinning
  ], done);
};

module.exports.hideCanvas = function () {
  renderer.domElement.style.visibility = 'hidden';
};

module.exports.display = document.getElementById('pt').appendChild(renderer.domElement);
