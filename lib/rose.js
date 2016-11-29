'use strict';

var THREE = require('three');
var _ = require('lodash');
var dynamics = require('dynamics.js');
window.THREE = THREE;
require('../node_modules/three/examples/js/loaders/OBJLoader');

var textureLoader = new THREE.TextureLoader();
var urlPath = location.pathname;
var dotsNormalMap = textureLoader.load(urlPath + 'assets/images/dots-normal-map-resized.jpg');

var loader = new THREE.OBJLoader();
var scale = 0.028;

var rose = new THREE.Object3D();
var animatables = {
  morph: 0
};

var material = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  emissive: 'red',
  // color: 'red',
  emissiveIntensity: 0.05,
  shading: THREE.SmoothShading,
  shininess: 30,
  normalMap: dotsNormalMap,
  normalScale: new THREE.Vector3(0.1, 0.1),
  morphTargets: true
});

material.userData = {
  emissiveIntensityInitial: 0.05
};

var geometry;

var initialRotation = (2 * Math.PI) / 4;

module.exports.load = function (cb) {
  var urlPath = location.pathname;

  loader.load(urlPath + 'assets/models/rose.obj', function (object) {
    geometry = new THREE.Geometry().fromBufferGeometry(object.children[0].geometry);
    geometry.center();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var targets = [];

    geometry.vertices.forEach(function (vertex) {
      targets.push(new THREE.Vector3(vertex.x + _.random(-0.6, 0.6), vertex.y + _.random(-0.6, 0.6), vertex.z + _.random(-0.6, 0.6)));
    });

    geometry.morphTargets.push({
      name: 'random',
      vertices: targets
    });

    rose = new THREE.Mesh(geometry, material);
    rose.scale.set(scale, scale, scale);
    rose.rotation.z = initialRotation;
    rose.rotation.y = initialRotation;
    rose.castShadow = true;
    rose.receiveShadow = true;

    cb(null, rose, material);
  });
};

module.exports.updateRotation = function (x, y) {
  rose.rotation.x -= y * 0.007;
  rose.rotation.y += x * 0.008;

  rose.rotation.y = _.clamp(rose.rotation.y, initialRotation - 0.4, initialRotation + 0.4);
  rose.rotation.x = _.clamp(rose.rotation.x, -0.3, 0.3);
};

module.exports.setSize = function (reference) {
  var scale = reference / (geometry.boundingBox.max.y * 3);
  rose.userData.scale = scale;
  rose.scale.set(scale, scale, scale);
};

module.exports.update = function () {
  rose.morphTargetInfluences[0] = animatables.morph;
};

module.exports.distort = function () {
  dynamics.animate(animatables, {
    morph: _.random(1, 2)
  }, {
    type: dynamics.easeOut,
    friction: 1,
    duration: 300
  });
  setTimeout(function () {
    dynamics.animate(animatables, {
      morph: 0
    }, {
      type: dynamics.easeOut,
      friction: 1,
      duration: 300
    });
  }, 400);
};
