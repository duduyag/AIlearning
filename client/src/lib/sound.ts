// Tiny synthesized "you passed!" fanfare - a few quick claps then a rising chime.
// Generated entirely with the Web Audio API so there's no audio file to ship or license.

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playClap(ctx: AudioContext, when: number) {
  const duration = 0.08;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const decay = 1 - i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * decay * decay;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  filter.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, when);
  gain.gain.exponentialRampToValueAtTime(0.01, when + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(when);
  noise.stop(when + duration + 0.02);
}

function playChimeNote(ctx: AudioContext, freq: number, when: number, duration: number) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(0.28, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, when + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(when);
  osc.stop(when + duration + 0.05);
}

export function playSuccessSound() {
  try {
    const ctx = getCtx();
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;

    playClap(ctx, now);
    playClap(ctx, now + 0.12);
    playClap(ctx, now + 0.24);

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => playChimeNote(ctx, freq, now + 0.32 + i * 0.1, 0.4));
  } catch {
    // Web Audio unavailable - the sound is a nice-to-have, never block on it.
  }
}
