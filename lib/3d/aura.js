'use strict';

var THREE = require('three');
var _ = require('lodash');
var dynamics = require('dynamics.js');

var colours = require('../colours');
var config = require('../../config');
var scale = 0;

var animatables = {
  morph: 0.6,
  morph2: 0.0
};

var geometry = new THREE.SphereGeometry(0.42, 7, 7);
geometry.mergeVertices();
geometry.computeBoundingBox();

var targets = [];
var targets2 = [];

geometry.vertices.forEach(function (vertex) {
  targets.push(new THREE.Vector3(vertex.x + _.random(-0.11, 0.11), vertex.y + _.random(-0.11, 0.11), vertex.z + _.random(-0.11, 0.11)));
  targets2.push(new THREE.Vector3(vertex.x + _.random(-0.11, 0.11), vertex.y + _.random(-0.11, 0.11), vertex.z + _.random(-0.11, 0.11)));
});

geometry.morphTargets.push({
  name: 'random',
  vertices: targets
});

geometry.morphTargets.push({
  name: 'random2',
  vertices: targets2
});

var material = new THREE.MeshPhongMaterial({
  wireframe: true,
  wireframeLinewidth: 0.3,
  color: colours.darkGrey.hex(),
  emissive: colours.darkGrey.hex(),
  emissiveIntensity: 1.0,
  morphTargets: true,
  transparent: true,
  opacity: 1
});

var aura = new THREE.Mesh(geometry, material);
if (config.shadow) aura.castShadow = true;

module.exports.mesh = aura;

module.exports.update = function () {
  aura.morphTargetInfluences[0] = animatables.morph;
  aura.morphTargetInfluences[1] = animatables.morph2;
};

module.exports.expand = function () {
  var duration = 1100;
  dynamics.animate(aura.scale, {
    x: scale * 1.3,
    y: scale * 1.3,
    z: scale * 1.3,
  }, {
    duration: duration
  });
};

module.exports.reduce = function () {
  var duration = 1100;
  dynamics.animate(aura.scale, {
    x: scale,
    y: scale,
    z: scale,
  }, {
    duration: duration
  });
};

module.exports.distort = function () {
  var duration = _.random(300, 500);

  dynamics.animate(animatables, {
    morph: _.random(0.65, 0.70),
    morph2: _.random(0.2, 0.35)
  }, {
    type: dynamics.easeOut,
    friction: 1,
    duration: duration
  });
  setTimeout(function () {
    dynamics.animate(animatables, {
      morph: 0.6,
      morph2: 0,
    }, {
      type: dynamics.easeOut,
      friction: 1,
      duration: duration
    });
  }, duration + 150);
};

module.exports.setSize = function (reference) {
  scale = reference / (geometry.boundingBox.max.y * 1.55);
  aura.scale.set(scale, scale, scale);
};

module.exports.fadeOut = function (cb) {
  var duration = 3000;
  dynamics.animate(material, {
    opacity: 0
  }, {
    duration: duration
  });

  setTimeout(function () {
    material.visible = false;
    cb();
  }, duration);
};

module.exports.reset = function () {
  material.needsUpdate = true;
  material.visible = true;
  material.opacity = 1;
};
