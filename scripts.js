let STATE = {
  isOn: false,
  channel: 3,
  unloadChannel: null
}

const channelElem = document.querySelector('.channel');
const wrapper = document.querySelector('.wrapper');


const effects = (() => {
  const reverb = () => {
    return new Tone.Freeverb({
      roomSize: 0.5,
      dampening: 1200,
      wet: .35
    })
  }

  const dirt = () => {
    const eq = new Tone.EQ3(-4, -1, -5);
    const distortion = new Tone.Distortion({
      distortion: 0.5,
      oversample: '4x',
      wet: .1
    }).connect(eq);

    return { distortion, eq }
  }

  const delay = () => {
    return new Tone.FeedbackDelay({
      delayTime: 1,
      maxDelay: 8,
      wet: .2
    });
  }

  return { reverb, dirt, delay }
})();

const instruments = (() => {
  const cymbals = () => {
    return new Tone.MetalSynth({
      'harmonicity': 12,
      'resonance': 800,
      'modulationIndex': 20,
      'envelope': {'decay': 0.4},
      'volume': -60
    })
  }

  const snare = () => {
    return new Tone.MembraneSynth({
      volume: -20,
      pitchDecay: 0.01,
      octaves: 10,
      oscillator: {
        type: "sawtooth"
      },
      envelope: {
        attack: 0.001,
        decay: 0.16,
        sustain: 0.01,
        release: 1,
        attackCurve: "exponential"
      }
    });
  }

  const drums = () => {
    return new Tone.MembraneSynth({
    	pitchDecay: 0.008,
    	octaves: 2,
      volume: -10,
    	envelope: {
    		attack: 0.0006,
    		decay: 0.9,
    		sustain: 0.3
    	}
    });
  }

  const amtriangle = () => {
    return new Tone.Synth({
      volume: -15,
      oscillator: {
        type: "amtriangle",
        harmonicity: .5,
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
    });
  }

  const amtriangle2 = () => {
    return new Tone.Synth({
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
    });
  }

  const sine = () => {
    return new Tone.MonoSynth({
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
    });
  }

  return { cymbals, snare, drums, amtriangle, amtriangle2, sine }
})();

function displayLAO() {
  document.querySelector('.lao').style.display = 'block';

  Tone.Transport.bpm.value = 116;
  // effects
  const dirt = effects.dirt();
  dirt.eq.toMaster();
  const envelope = {
    attackCurve: "exponential",
    attack: 0.1,
    decay: 0.4,
    sustain: 0.4,
    release: 2
  }
  // instruments
  const drums = new Tone.MembraneSynth().connect(dirt.distortion);
  drums.volume.value = -22;
  drums.ocatves = 8;
  drums.pitchDeay = 0.08;

  const cymbals = instruments.cymbals().toMaster();
  const snare = instruments.snare().toMaster();
  const bass = instruments.amtriangle().connect(dirt.distortion);
  bass.volume.value = -14;
  const mainMelody = instruments.amtriangle2().connect(dirt.distortion);
  const mainMelody2 = instruments.amtriangle2().connect(dirt.distortion);
  mainMelody2.envelope = envelope;

  // parts
  const cymbalsPart = new Tone.Sequence(
    (time, freq) => {
			cymbals.frequency.setValueAtTime(freq, time, Math.random()*0.5 + 0.75);
			cymbals.triggerAttack(time);
		}, [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300], "8n").start();
  const snarePart = new Tone.Sequence(
    (time, note) => {
      snare.triggerAttackRelease(note, "0:0:1", time);
    },[
      null, "G3", null, "G3",
      null, "G3", "G3", "G3",
      null, "G3", null, "G3",
      null, "G3", null, "G3",
      null, "G3", "G3", "G3",
    ], "4n").start();
  const bassPart = new Tone.Sequence(
    (time, note) => {
      bass.triggerAttackRelease(note, "0:1", time);
    },[
      "G3",
      [null, [null, [null, "D3"]]],
      "G3",
      "G3",
      [null, [null, [null, "D3"]]]
    ], "1n").start();
  const drumPart = new Tone.Sequence(
    (time, note) => {
      drums.triggerAttackRelease(note, "0:1", time);
    },[
      "G2",
      [null, [null, [null, "D2"]]],
      "G2",
      "G2",
      [null, [null, [null, "D2"]]]
    ], "1n").start();
  const keyPart1 = new Tone.Sequence(
    (time, note) => {
      mainMelody.triggerAttackRelease(note, "0:0:5", time);
    },[
      null, ["G4", "G4"], ["G4", "A4"], [null, "Bb4"],
      null, null, null, null,
      null, ["G4", "G4"], ["G4", "A4"], [null, "Bb4"],
      null, [null, "A4"], null, null,
      null, null, null, null
    ], "4n").start();
  const keyPart2 = new Tone.Sequence(
    (time, note) => {
      mainMelody2.triggerAttackRelease(note, "0:0:5", time);
    },[
      null, ["D4", "D4"], ["D4", "E4"], [null, "F4"],
      null, null, null, null,
      null, ["D4", "D4"], ["D4", "E4"], [null, "F4"],
      null, [null, "E4"], null, null,
      null, null, null, null
    ], "4n").start();

  STATE = {...STATE, unloadChannel: function() {
      document.querySelector('.lao').style.display = 'none';

      Tone.Transport.stop();

      cymbals.dispose();
      snare.dispose();
      bass.dispose();
      drums.dispose();
      mainMelody.dispose();
      mainMelody2.dispose();

      cymbalsPart.dispose();
      snarePart.dispose();
      bassPart.dispose();
      drumPart.dispose();
      keyPart1.dispose();
      keyPart2.dispose();
    }
  }

  Tone.Transport.start("+0.1");
}


function displayXFiles() {
  document.querySelector('.xFiles').style.display = 'block';
  wrapper.style.background = '#1a201a';

  Tone.Transport.bpm.value = 104;

  const delay = effects.delay().toMaster();
  const delay2 = effects.delay().toMaster();
  delay2.wet = .01;
  const key = instruments.amtriangle().connect(delay);
  const melody = new Tone.MonoSynth({
    volume: -25,
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
  }).connect(delay2);

  const keyPart = new Tone.Sequence(
    function(time, note) {
      key.triggerAttackRelease(note, "0:0:1", time);
    },[
      ["C4", "Db5", "F5"], ["Gb5", "Db5", "F5"], ["Gb5", "Db5", "F5"], ["Gb5", "Db5", "F5"],
      "C5", "C5", "C5", "C5",
      ["Bb4", "Db5", "F5"], ["Gb5", "Db5", "F5"], ["Gb5", "Db5", "F5"], ["Gb5", "Db5", "F5"],
      "Bb4", "Bb4", "Bb4", "Bb4"
    ], "4n").start();

  const melodyPart = new Tone.Sequence(
    function(time, note) {
      melody.triggerAttackRelease(note, "0:2", time);
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

  STATE.unloadChannel = function() {
    document.querySelector('.xFiles').style.display = 'none';
    wrapper.style.background = 'black';

    key.dispose();
    melody.dispose();
    keyPart.dispose();
    melodyPart.dispose();
    Tone.Transport.stop();
  };

  Tone.Transport.start("+0.1");
}

function displayTwinPeaks() {
  const twinPeaks = document.querySelector('.twinPeaks');
  const twinPeaksBg = document.querySelector('.twinPeaksBg');
  let canvas;

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

  twinPeaksBg.classList.remove('hide');
  canvas.style.display = 'block';
  twinPeaks.style.display = 'block';


  Tone.Transport.bpm.value = 82;

  const delay = effects.delay().toMaster();
  delay.delayTime.value = '8n';

  const tenor = new Tone.Synth({
    volume: -18
  }).toMaster();
  const alto = instruments.amtriangle2().toMaster();
  const soprano = instruments.amtriangle2().toMaster();
  const highC = instruments.amtriangle2().toMaster();
  const tenor2 = instruments.amtriangle2().connect(delay);
  tenor2.volume.value = -20;

  let tenorPart = new Tone.Sequence(
    function(time, note) {
      tenor.triggerAttackRelease(note, "0:1", time);
    }, [
      "F2", "C3", "F3", "G3", "A3", "G3", "F3", "C3",
      "D3", null, null, null, null, null, null, null
    ], "8n").start();
  let altoPart = new Tone.Sequence(
    function(time, note) {
      alto.triggerAttackRelease(note, "0:1", time);
    }, [
      "C4", "G4", null, "F4",
      null, "E4", null, "D4"
    ], "4n").start();
  var twinPeaksSoprano = [null, "A4", null, null, null, "F4", null, null];
  let sopranoPart = new Tone.Sequence(
    function(time, note) {
      soprano.triggerAttackRelease(note, "0:1", time);
    }, twinPeaksSoprano, "4n").start();
  let highCPart = new Tone.Sequence(
    function(time, note) {
      highC.triggerAttackRelease(note, "0:1", time);
    }, [null, "C5", null, null, null, "A4", null, null], "4n").start();
  let tenor2Part = new Tone.Sequence(
    function(time, note) {
      tenor2.triggerAttackRelease(note, "1", time);
    },[
      "F4", "C5", "F5", "G5", "A5", "G5", "F5", "C5",
      "D5", null, null, null, null, null, null, null
    ], "8n").start();

  STATE.unloadChannel = function() {
    twinPeaks.style.display = 'none';
    twinPeaksBg.classList.add('hide');
    canvas.style.display = 'none';

    tenor.dispose();
    tenor2.dispose();
    alto.dispose();
    soprano.dispose();
    highC.dispose();

    highCPart.dispose();
    altoPart.dispose();
    sopranoPart.dispose();
    tenorPart.dispose();
    tenor2Part.dispose();

    Tone.Transport.stop();
  };

  Tone.Transport.start("+0.1");
}

function displayStrangerThings() {
  wrapper.classList.add('strangerWrapper');
  document.querySelector('.stranger').style.display = 'block';

  Tone.Transport.bpm.value = 84;
  // effects
  const delay = effects.delay().toMaster();
  delay.delayTime.value = '8n'
  const dirt = effects.dirt();
  dirt.eq.toMaster();
  // instruments
  const lowArp = instruments.amtriangle().toMaster();
  lowArp.volume.value = -16;
  const lowSine = instruments.sine().toMaster();
  lowSine.volume.value = -24;
  const highArp = instruments.amtriangle().connect(dirt.distortion);
  highArp.volume.value = -18;
  const bass = instruments.amtriangle().toMaster();
  bass.volume.value = -8;
  const drums = new Tone.MembraneSynth().toMaster();
  drums.volume.value = -22;
  drums.ocatves = 4;
  drums.pitchDeay = 0.008;
  // parts
  const lowArpPart = new Tone.Sequence(
    (time, note) => {
      lowArp.triggerAttackRelease(note, '0:0:1', time);
    }, ['C4', 'E4', 'G4', 'B4', 'C5', 'B4', 'G4', 'E4'], '16n').start();
  const lowSinePart = new Tone.Sequence(
    (time, note) => {
      lowSine.triggerAttackRelease(note, '0:0:1', time);
    }, ['C4', 'E4', 'G4', 'B4', 'C5', 'B4', 'G4', 'E4'], '16n').start();
  const highArpPart = new Tone.Sequence(
    (time, note) => {
      highArp.triggerAttackRelease(note, '0:0:1', time);
    },['C5', 'E5', 'G5', 'B5', 'C6', 'B5', 'G5', 'E5'], '16n').start();
  const drumPart = new Tone.Sequence(
    function(time, note) {
      drums.triggerAttackRelease(note, '0:1', time);
    },[['E2', 'E2'], null], '8n').start();
  const bassPart = new Tone.Sequence(
    (time, note) => {
      bass.triggerAttackRelease(note, '0:0:1', time);
    },[
      ['C3', 'C3'], null, null, null,
      ['C3', 'C3'], null, null, null,
      ['C3', 'C3'], null, null, null,
      ['C3', 'C3'], null, ['D3', 'D3'], null,
      ['E3', 'E3'], null, null, null,
      ['E3', 'E3'], null, null, null,
      ['E3', 'E3'], null, null, null,
      ['E3', 'E3'], null, ['D3', 'D3'], null,
    ], '8n').start();

  STATE = {...STATE, unloadChannel: function() {
      document.querySelector('.stranger').style.display = 'none';
      wrapper.classList.remove('strangerWrapper');

      Tone.Transport.stop();

      lowArp.dispose();
      lowSine.dispose();
      highArp.dispose();
      bass.dispose();
      drums.dispose();

      lowArpPart.dispose();
      lowSinePart.dispose();
      highArpPart.dispose();
      bassPart.dispose();
      drumPart.dispose();
    }
  }

  Tone.Transport.start("+0.1");
}





function displayStatic() {
  var noise = new Tone.Noise({
    "volume" : -20,
    "type" : "brown"
  }).toMaster();

  document.querySelectorAll('[class^=noise]').forEach(elem => {
    elem.style.display = 'block';
  });
  noise.start();
  STATE.unloadChannel = function() {
    console.log('unload static')
    document.querySelectorAll('[class^=noise]').forEach(elem => {
      elem.style.display = 'none';
    });
    noise.stop();
  }
}


function displayChannel() {
  if (STATE.channel == 8) STATE.channel = 3;
  if (STATE.channel == 2) STATE.channel = 7
  channelElem.classList.remove('fadeOut');
  displayStatic();
  Tone.Master.mute = true;
  window.setTimeout(() => {

    STATE.unloadChannel();
    channelElem.innerHTML = '';
    var num = "0";
    num += STATE.channel;
    channelElem.innerHTML = num;
    channelElem.classList.add('fadeOut');
    Tone.Master.mute = false;
    switch (STATE.channel) {
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
        displayStrangerThings();
        break;
      case 8:
       displayStatic();
    }
  }, 400);
}

function channelUp() {
  STATE.channel++;
  STATE.unloadChannel();
  displayChannel();
}

function channelDown() {
  STATE.channel--;
  STATE.unloadChannel();
  displayChannel();
}

function turnOn() {
  if (STATE.isOn) {
    Tone.Master.mute = true;
    STATE.unloadChannel();
    document.querySelector('.up').removeEventListener('click', channelUp);
    document.querySelector('.down').removeEventListener('click', channelDown);
    STATE = { ...STATE, isOn: false };
  } else {
    Tone.Master.mute = false;
    document.querySelector('.up').addEventListener('click', channelUp);
    document.querySelector('.down').addEventListener('click', channelDown);
    displayChannel();
    STATE = { ...STATE, isOn: true };
  }
  wrapper.classList.toggle('tvOn');
}

document.querySelector(".onOff").addEventListener("click", turnOn);
