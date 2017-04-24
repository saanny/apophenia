'use strict';

var context = require('./context');
var load = require('./load');

var limiter = context.createDynamicsCompressor();
var convolver = context.createConvolver();
convolver.normalize = false;
var synthGain = context.createGain();
var leadGain = context.createGain();
var kickGain = context.createGain();
var bgGain = context.createGain();
var guitarGain = context.createGain();
var snareGain = context.createGain();
var bassGain = context.createGain();
var hihatGain = context.createGain();
var keysGain = context.createGain();
var backMelodyGain = context.createGain();
var epicPercGain = context.createGain();
var epicRevGain = context.createGain();
var pianoGain = context.createGain();

limiter.ratio.value = 20;
limiter.attack.value = 0.01;
limiter.release.value = 0.01;
limiter.threshold.value = -1;

limiter.connect(context.destination);
convolver.connect(limiter);
synthGain.connect(convolver);
leadGain.connect(convolver);
guitarGain.connect(convolver);
kickGain.connect(limiter);
bgGain.connect(limiter);
snareGain.connect(limiter);
bassGain.connect(limiter);
hihatGain.connect(limiter);
keysGain.connect(limiter);
epicPercGain.connect(limiter);
backMelodyGain.connect(convolver);
epicRevGain.connect(convolver);
pianoGain.connect(limiter);

synthGain.gain.value = 0.10;
leadGain.gain.value = 0.10;
kickGain.gain.value = 0.30;
bgGain.gain.value = 0.06;
guitarGain.gain.value = 0.013;
snareGain.gain.value = 0.0;
bassGain.gain.value = 0.0;
hihatGain.gain.value = 0.04;
keysGain.gain.value = 0.65;
backMelodyGain.gain.value = 0.02;
epicPercGain.gain.value = 0.25;
epicRevGain.gain.value = 0.01;
pianoGain.gain.value = 0.5;

// synthGain.gain.value = 0;
// leadGain.gain.value = 0;
// kickGain.gain.value = 0;
// bgGain.gain.value = 0;
// guitarGain.gain.value = 0;
// snareGain.gain.value = 0;
// bassGain.gain.value = 0;
// hihatGain.gain.value = 0;
// keysGain.gain.value = 0;
// pianoGain.gain.value = 0;
// epicPercGain.gain.value = 0;
// backMelodyGain.gain.value = 0;
// epicRevGain.gain.value = 0;

load('./assets/audio/ir3.mp3', function (err, buffer) {
  convolver.buffer = buffer;
});

module.exports.synthDestination = synthGain;
module.exports.leadDestination = leadGain;
module.exports.kickDestination = kickGain;
module.exports.bgDestination = bgGain;
module.exports.guitarDestination = guitarGain;
module.exports.snareDestination = snareGain;
module.exports.bassDestination = bassGain;
module.exports.hihatDestination = hihatGain;
module.exports.keysDestination = keysGain;
module.exports.backMelodyDestination = backMelodyGain;
module.exports.percDestination = epicPercGain;
module.exports.revDestination = epicRevGain;
module.exports.pianoDestination = pianoGain;
