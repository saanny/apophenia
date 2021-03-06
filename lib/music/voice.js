'use strict';

var _ = require('lodash');
var Envelope = require('fastidious-envelope-generator');

var context = require('./context');
var destination = require('./audio').synthDestination;

var SHOULD_USE_STEREO_PANNER = typeof context.createStereoPanner === 'function';

function Voice(id, frequency) {
  this.id = id;

  var osc = context.createOscillator();
  osc.frequency.value = frequency;
  var gain = context.createGain();

  var panner = SHOULD_USE_STEREO_PANNER ? context.createStereoPanner() : context.createPanner();
  this.env = new Envelope(context, gain.gain);
  this.env.mode = 'ASR';
  osc.connect(gain);
  gain.connect(panner);
  panner.connect(destination);
  if (SHOULD_USE_STEREO_PANNER) {
    panner.pan.value = _.random(-0.7, 0.7);
  } else {
    panner.panningModel = 'equalower';
    panner.setPosition(_.random(-0.7, 0.7), _.random(-0.7, 0.7), _.random(-0.7, 0.7));
  }
  gain.gain.value = 0;
  this.osc = osc;
  this.gain = gain;
  this.startTime = 0;
  this.timeDelta = 0;
}

Voice.prototype.start = function (opts) {
  this.osc.start(0);
  this.peak = opts.peak;
  this.attack = opts.attack;
  this.unit = this.peak / this.attack;
  this.env.attackLevel = opts.peak;
  this.env.attackRate = opts.attack / 1000;
  this.env.gateOn(opts.now + 0.001);
};

Voice.prototype.stop = function (opts) {
  this.env.releaseRate = opts.release;
  this.env.gateOff(opts.now + 0.001);
  this.osc.stop(opts.now + opts.release + 2);
};

module.exports = Voice;
