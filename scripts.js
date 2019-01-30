var on = false;
var noiseScreens = document.querySelectorAll('[class^=noise]');
var tvWrapper = document.querySelector('.wrapper');
var channelElem = document.querySelector('.channel');
var channel = 3;
var lao = document.querySelector('.lao');
var xFiles = document.querySelector('.xFiles');
var twinPeaks = document.querySelector('.twinPeaks');
var twinPeaksBg = document.querySelector('.twinPeaksBg');
var simpsons = document.querySelector('.simpsons');
var wrapper = document.querySelector('.wrapper');
var unloadChannel;
let canvas;
var temp;

var twinPeaksBass = ["F2", [null, [null, "C2"]], "D2", [null, [null, "C2"]]];

var twinPeaksSoprano = [null, "A4", null, null, null, "F4", null, null];
// EFFECTS

let verb = new Tone.Freeverb({
  roomSize: 0.5,
  dampening: 1200,
  wet: .35
}).toMaster();

let eq = new Tone.EQ3(-5, -2, -8).toMaster();

let distortion = new Tone.Distortion({
  distortion: 0.5,
  oversample: '4x',
  wet: .08
}).connect(eq);

let delay = new Tone.FeedbackDelay({
  delayTime: 1,
  maxDelay: 8,
  wet: .2
}).toMaster();

// INSTRUMENTS

let cymbals = new Tone.MetalSynth({
  'harmonicity': 12,
  'resonance': 800,
  'modulationIndex': 20,
  'envelope': {'decay': 0.4},
  'volume': -55
}).toMaster();

var noise = new Tone.Noise({
  "volume" : -20,
  "type" : "brown"
}).toMaster();

let snare = new Tone.MembraneSynth({
  volume: -20,
  pitchDecay: 0.01,
  octaves: 10,
  oscillator: {
    type: "sawtooth"
  },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0.01,
    release: 1,
    attackCurve: "exponential"
  }
}).connect(verb);

let drums = new Tone.MembraneSynth({
	"pitchDecay" : 0.008,
	"octaves" : 2,
  'volume': -10,
	"envelope" : {
		"attack" : 0.0006,
		"decay" : 0.9,
		"sustain" : 0.3
	}
}).toMaster();

let mainMelody = new Tone.Synth({
  volume: -15,
  oscillator: {
    type: "amtriangle",
    harmonicity: 0.5,
    modulationType: "square"
  },
  envelope: {
    attackCurve: "exponential",
    attack: 0.1,
    decay: 0.4,
    sustain: 0.4,
    release: 2
  },
  portamento: 0.02
}).connect(distortion);

let bassMelody = new Tone.MonoSynth({
  volume: -20,
  oscillator: {
    type: "sine"
  },
  envelope: {
    attack: 0.05,
    decay: 0.3,
    sustain: 1,
    release: 0.8
  },
  filterEnvelope: {
    attack: 0.001,
    decay: 0.7,
    sustain: 0.1,
    release: 0.8,
    baseFrequency: 200,
    octaves: 4
  }
}).toMaster();

let mainMelody2 = new Tone.Synth({
  volume: -15,
  oscillator: {
    type: "amtriangle",
    harmonicity: 0.5,
    modulationType: "square"
  },
  envelope: {
    attackCurve: "exponential",
    attack: 0.1,
    decay: 0.4,
    sustain: 0.4,
    release: 2
  },
  portamento: 0.02
}).connect(distortion);

let mainMelody3 = new Tone.Synth({
  volume: -18,
  oscillator: {
    type: "amtriangle",
    harmonicity: 0.5,
    modulationType: "square"
  },
  envelope: {
    attackCurve: "exponential",
    attack: 0.1,
    decay: 0.4,
    sustain: 0.4,
    release: 2
  },
  portamento: 0.02
}).connect(distortion);

let bassMelody2 = new Tone.MonoSynth({
  volume: -18,
  oscillator: {
    type: "sine"
  },
  envelope: {
    attack: 0.05,
    decay: 0,
    sustain: 0.7,
    release: 0
  },
  filterEnvelope: {
    attack: 0,
    decay: 0.1,
    sustain: 0.4,
    release: 0,
    baseFrequency: 1000,
    octaves: 16
  }
}).toMaster();

let newInst = new Tone.Synth({
  volume: -18
}).toMaster();

let arp = new Tone.Synth({
  volume: -15,
  oscillator: {
    type: "amtriangle",
    harmonicity: 0.5,
    modulationType: "square"
  },
  envelope: {
    attackCurve: "exponential",
    attack: 0.003,
    decay: 0.2,
    sustain: 0.2,
    release: 0.01
  },
  portamento: 0.02
}).connect(delay);
function displaySimpsons() {
  Tone.Transport.stop();
  simpsons.style.display = 'block';
  wrapper.style.background = '#65AFFC';
  document.querySelectorAll('.cloud').forEach(function(elem) {
    elem.style.display = 'block';
  });
}

function zigZag() {
  let width = wrapper.offsetWidth;
  let height = wrapper.offsetHeight;

  let peak = 30;
  let zagLength = (width) / peak;
  zagLength++;
  let numZags = 19;

  canvas = document.querySelector("canvas");
  let context = canvas.getContext("2d");
  context.canvas.width = width;
  context.canvas.height = height;
  context.beginPath();
  for (let i = 0; i < numZags; i++ ) {
    let yOffset = i * peak;
    context.moveTo(0, yOffset);
    for (let j = 0; j < zagLength; j++ ) {
      let x = peak * j;
      let y = (j % 2 == 0) ? peak + yOffset : 0 + yOffset;
      context.lineTo(x, y);
    }
  }
  context.strokeStyle = "#2b120c";
  context.lineWidth = 10;
  context.stroke();
}
 zigZag();
function displayTwinPeaks() {
  Tone.Transport.bpm.value = 82;
  twinPeaksBg.classList.remove('hide');
  canvas.style.display = 'block';
  twinPeaks.style.display = 'block';
  let tenorPart = new Tone.Sequence(
    function(time, note) {
      newInst.triggerAttackRelease(note, "0:1", time);
    }, [
      "F2", "C3", "F3", "G3", "A3", "G3", "F3", "C3",
      "D3", null, null, null, null, null, null, null
    ], "8n").start();
  let altoPart = new Tone.Sequence(
    function(time, note) {
      mainMelody2.triggerAttackRelease(note, "0:1", time);
    }, [
      "C4", "G4", null, "F4",
      null, "E4", null, "D4"
    ], "4n").start();
  let sopranoPart = new Tone.Sequence(
    function(time, note) {
      mainMelody.triggerAttackRelease(note, "0:1", time);
    }, twinPeaksSoprano, "4n").start();
  let highC = new Tone.Sequence(
    function(time, note) {
      mainMelody3.triggerAttackRelease(note, "0:1", time);
    }, [null, "C5", null, null, null, "A4", null, null], "4n").start();
  let tenorOctUp = new Tone.Sequence(
    function(time, note) {
      arp.triggerAttackRelease(note, "1", time);
    },[
      "F4", "C5", "F5", "G5", "A5", "G5", "F5", "C5",
      "D5", null, null, null, null, null, null, null
    ], "8n").start();
  arp.volume.value = -20;
  delay.delayTime.value = .4;
  temp = highC;

  unloadChannel = function() {
    twinPeaks.style.display = 'none';
    twinPeaksBg.classList.add('hide');
    canvas.style.display = 'none';
    tenorOctUp.stop();
    highC.stop();
    sopranoPart.stop();
    altoPart.stop();
    tenorPart.stop();
    arp.volume.value = -14;
    delay.delayTime.value = 1;
    Tone.Transport.stop();
  };
  Tone.Transport.start("+0.1");
}

function displayXFiles() {
  Tone.Transport.bpm.value = 104;
  xFiles.style.display = 'block';
  wrapper.style.background = '#1a201a';

  let keyPart = new Tone.Sequence(
    function(time, note) {
      arp.triggerAttackRelease(note, "0:0:1", time);
    },[
      ["Bb4", "Db5", "F5"], ["Gb5", "Db5", "F5"], ["Gb5", "Db5", "F5"], ["Gb5", "Db5", "F5"],
      "C5", "C5", "C5", "C5",
      ["Bb4", "Db5", "F5"], ["Gb5", "Db5", "F5"], ["Gb5", "Db5", "F5"], ["Gb5", "Db5", "F5"],
      "Bb4", "Bb4", "Bb4", "Bb4"
    ], "4n").start();

  let melody = new Tone.Sequence(
    function(time, note) {
      bassMelody2.triggerAttackRelease(note, "0:2", time);
    },[
      null, null, null, null,
      null, null, null, "Bb4",
      "F5", "Eb5", "F5", "Ab5",
      "F5", null, null, "Bb4",
      "F5", "Eb5", "F5", "Bb5",
      "F5", null, null, "Bb4",
      "F5", "Eb5", "F5", "Ab5",
      "F5", null, null, null
    ], "4n").start();
  melody.mute = false;

  unloadChannel = function() {
    xFiles.style.display = 'none';
    melody.mute = true;
    keyPart.stop();
    melody.stop();
    Tone.Transport.stop();
  };
  Tone.Transport.start("+0.1");
}

function displayLAO() {
  lao.style.display = 'block';
  Tone.Transport.bpm.value = 116;
  var cymbalsPart = new Tone.Sequence(
    function(time, freq) {
			cymbals.frequency.setValueAtTime(freq, time, Math.random()*0.5 + 0.5);
			cymbals.triggerAttack(time);
		}, [300, 300, 300, 300, 300, 300, 300, 300, 200, 300, 300, 300], "8n").start();

  let snarePart = new Tone.Sequence(
    function(time, note) {
      snare.triggerAttackRelease(note, "0:0:1", time);
    },[
      null, "G3", null, "G3",
      null, "G3", "G3", "G3",
      null, "G3", null, "G3",
      null, "G3", null, "G3",
      null, "G3", "G3", "G3",
    ], "4n").start();

    let drumPart = new Tone.Sequence(
      function(time, note) {
        drums.triggerAttackRelease(note, "0:1", time);
      },[
        "G2",
        [null, [null, [null, "D2"]]],
        "G2",
        "G2",
        [null, [null, [null, "D2"]]]
      ], "1n").start();

  let keyPart1 = new Tone.Sequence(
    function(time, note) {
      mainMelody.triggerAttackRelease(note, "0:0:5", time);
    },[
      null, ["G4", "G4"], ["G4", "A4"], [null, "Bb4"],
      null, null, null, null,
      null, ["G4", "G4"], ["G4", "A4"], [null, "Bb4"],
      null, [null, "A4"], null, null,
      null, null, null, null
    ], "4n").start();

  let keyPart2 = new Tone.Sequence(
    function(time, note) {
      mainMelody2.triggerAttackRelease(note, "0:0:5", time);
    },[
      null, ["D4", "D4"], ["D4", "E4"], [null, "F4"],
      null, null, null, null,
      null, ["D4", "D4"], ["D4", "E4"], [null, "F4"],
      null, [null, "E4"], null, null,
      null, null, null, null
    ], "4n").start();

  let bassPart = new Tone.Sequence(
    function(time, note) {
      bassMelody.triggerAttackRelease(note, "0:3", time);
    },[
      "G2",
      [null, [null, [null, "D2"]]],
      "G2",
      "G2",
      [null, [null, [null, "D2"]]]
    ], "1n").start();

    let bass2Part = new Tone.Sequence(
      function(time, note) {
        newInst.triggerAttackRelease(note, "0:0:1", time);
      },[
        "G3",
        [null, [null, [null, "D3"]]],
        "G3",
        "G3",
        [null, [null, [null, "D3"]]]
      ], "1n").start();
  // let bassMelodyPart2 = new Tone.Sequence(
  //   function(time, note) {
  //     bassMelody2.triggerAttackRelease(note, "0:1", time);
  //   },
  //   [
  //     null, null,
  //     null, null,
  //     null, null,
  //     null, [null, [null, "F4"]],
  //     [[null, "F4"], [null, "F4"]], [[null, "F4"], [null, "F4"]]
  //   ], "2n"
  // ).start();
  Tone.Transport.start("+0.1");
  unloadChannel = function() {
    drumPart.stop();
    cymbalsPart.stop();
    snarePart.stop();
    bassPart.stop();
    bass2Part.stop();
    keyPart1.stop();
    keyPart2.stop();
    Tone.Transport.stop();
    lao.style.display = 'none';
  };
}

function displayStatic() {
  noiseScreens.forEach(elem => {
    elem.style.display = 'block';
  });
  noise.start();
  unloadChannel = function() {
    noiseScreens.forEach(elem => {
      elem.style.display = 'none';
    });
    noise.stop();
  }
}

function displayChannel() {
  if (channel == 7) channel = 3;
  if (channel == 2) channel = 6
  wrapper.style.background = 'black';
  channelElem.classList.remove('fadeOut');
  displayStatic();
  Tone.Master.mute = true;
  window.setTimeout(() => {

    unloadChannel();
    channelElem.innerHTML = '';
    var num = "0";
    num += channel;
    channelElem.innerHTML = num;
    channelElem.classList.add('fadeOut');
    Tone.Master.mute = false;
    switch (channel) {
      case 3:
        displayStatic();
        break;
      case 4:
        displayLAO();
        break;
      case 5:
        displayXFiles();
        break;
      case 6:
        displayTwinPeaks();
        break;
      case 7:
       displayStatic();
    }
  }, 400);
}

function channelUp() {
  channel++;
  unloadChannel();
  displayChannel();
}

function channelDown() {
  channel--;
  unloadChannel();
  displayChannel();
}

function turnOn() {
  if (on) {
    Tone.Master.mute = true;
    // Tone.Master.volume.rampTo(-Infinity, 0.05);
    tvWrapper.classList.remove('tvOn');
    unloadChannel();
    wrapper.style.background = 'black';
    document.querySelector('.up').removeEventListener('click', channelUp);
    document.querySelector('.down').removeEventListener('click', channelDown);
  } else {
    Tone.Master.mute = false;
    document.querySelector('.up').addEventListener('click', channelUp);
    document.querySelector('.down').addEventListener('click', channelDown);
    tvWrapper.classList.add('tvOn');
    displayChannel();
  }
  on = !on;
}

document.querySelector(".onOff").addEventListener("click", turnOn);
