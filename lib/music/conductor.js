'use strict';

var _ = require('lodash');
var teoria = require('teoria');

var introKicks = require('./introKicks');
var secondSection = require('./secondSection');
var context = require('../context');
var audio = require('../audio');
var notes = require('../music').notes;

module.exports.startIntroKicks = function () {
  introKicks.start();
};

module.exports.stopFirstSection = function (done) {
  introKicks.stop();
  done();
};

module.exports.startSecondSection = function () {
  secondSection.start();
};

module.exports.playLead = function () {
  var osc = context.createOscillator();
  var gain = context.createGain();
  var now = context.currentTime;

  var note = notes[_.random(0, notes.length - 1, false)];
  var frequency = note.fq() * 6;

  if (_.random(0, 100) > 50) frequency = note.fq() * 8;

  osc.start(now);
  osc.frequency.value = frequency;
  osc.connect(gain);
  gain.gain.value = 0;
  gain.connect(audio.leadDestination);

  gain.gain.cancelScheduledValues(now);
  gain.gain.setTargetAtTime(0, now, 0.5);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
  gain.gain.linearRampToValueAtTime(0, now + 0.2);

  osc.stop(now + 1.5);

  setTimeout(function () {
    gain.disconnect();
  }, 4000);
};

module.exports.playBass = function () {
  var osc = context.createOscillator();
  var gain = context.createGain();
  var now = context.currentTime;

  var note = notes[_.random(0, notes.length - 1, false)];
  var midi = note.midi() - 12;
  var frequency = teoria.note.fromMIDI(midi).fq();

  osc.start(now);
  osc.frequency.value = frequency;
  osc.connect(gain);
  gain.gain.value = 0;
  gain.connect(audio.leadDestination);

  gain.gain.cancelScheduledValues(now);
  gain.gain.setTargetAtTime(0, now, 0.5);
  gain.gain.linearRampToValueAtTime(0.2, now + 3);
  gain.gain.linearRampToValueAtTime(0, now + 4.5);

  osc.stop(now + 5);

  setTimeout(function () {
    gain.disconnect();
  }, 5500);
};