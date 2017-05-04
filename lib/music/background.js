'use strict';

var load = require('./load');
var grain = require('./grain');
var map = require('../map');

var destination = require('./audio').bgDestination;
var discoveryMax = require('../../config').discoveryThreshold;

var progress = 0;
var target = 0;
var speed = 1;
var bgBuffer = null;
var interval = null;

load('./assets/audio/bg-01.mp3', function (err, buffer) {
  if (err) return console.error(err);
  bgBuffer = buffer;
});

module.exports.proceed = function (amount) {
  target = map(amount, 0, discoveryMax, 0, 1);
};

module.exports.proceedRaw = function (amount) {
  target = amount;
};

module.exports.setSpeed = function (value) {
  speed = value;
};

module.exports.reset = function () {
  progress = 0;
  target = 0;
};

module.exports.start = function () {
  setInterval(function () {
    if (!bgBuffer) return;
    progress += (target - progress) * 0.15;

    grain(bgBuffer, destination, 0.3, 0.5, progress, speed);
  }, 50);
};

module.exports.stop = function () {
  window.clearInterval(interval);
};
