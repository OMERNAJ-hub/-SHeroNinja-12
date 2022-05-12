import { VoiceSettings } from "../types";

// Helper for Web Audio API Sound Effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play Katana Sword Slash SFX
export function playSwordSlashSFX() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.25; // 250ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(8000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.warn("Audio Context error:", e);
  }
}

// Play Dojo Gong SFX
export function playDojoGongSFX() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime); // Low gong base
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.5);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(183, ctx.currentTime); // Harmonic overtone
    osc2.frequency.exponentialRampToValueAtTime(175, ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 1.8);
    osc2.stop(ctx.currentTime + 1.8);
  } catch (e) {
    console.warn("Gong SFX error:", e);
  }
}

// Play Correct Answer / Success Chime
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch (e) {
    console.warn("Success Chime error:", e);
  }
}

// Play Error Buzz
export function playErrorBuzz() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.setValueAtTime(110, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.warn("Error Buzz error:", e);
  }
}

// Speak English text with SpeechSynthesis using voice settings
export function speakText(text: string, voiceSettings: VoiceSettings) {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech Synthesis is not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language to British English
  utterance.lang = 'en-GB';

  // Base pitch and rate adjustments for the 6 AI Voice Profiles
  let profilePitch = 1.0;
  let profileRate = 1.0;
  let genderPreference: 'male' | 'female' | 'any' = 'any';

  switch (voiceSettings.profile) {
    case 'tiny_ninja':
      profilePitch = 1.55;
      profileRate = 1.15;
      genderPreference = 'male';
      break;
    case 'little_sakura':
      profilePitch = 1.40;
      profileRate = 1.08;
      genderPreference = 'female';
      break;
    case 'sensei':
      profilePitch = 0.70;
      profileRate = 0.85;
      genderPreference = 'male';
      break;
    case 'assassin':
      profilePitch = 1.08;
      profileRate = 1.12;
      genderPreference = 'female';
      break;
    case 'guardian':
      profilePitch = 0.58;
      profileRate = 0.88;
      genderPreference = 'male';
      break;
    case 'shadow':
      profilePitch = 0.75;
      profileRate = 0.92;
      genderPreference = 'any';
      break;
  }

  utterance.pitch = Math.max(0.4, Math.min(2.0, profilePitch * voiceSettings.pitch));
  utterance.rate = Math.max(0.4, Math.min(2.0, profileRate * voiceSettings.speed));

  // Find best available British or English voice matching gender preference
  const voices = window.speechSynthesis.getVoices();
  const gbVoices = voices.filter(v => v.lang === 'en-GB' || v.lang.startsWith('en_GB'));
  const allEnglishVoices = voices.filter(v => v.lang.startsWith('en'));

  let targetVoice: SpeechSynthesisVoice | undefined;

  if (gbVoices.length > 0) {
    if (genderPreference === 'female') {
      targetVoice = gbVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('hazel') || v.name.toLowerCase().includes('victoria') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha'));
    } else if (genderPreference === 'male') {
      targetVoice = gbVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('james') || v.name.toLowerCase().includes('daniel'));
    }
    if (!targetVoice) targetVoice = gbVoices[0];
  }

  if (!targetVoice && allEnglishVoices.length > 0) {
    targetVoice = allEnglishVoices[0];
  }

  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  // If "shadow" whisper voice is selected, play a subtle breath noise overlay
  if (voiceSettings.profile === 'shadow' && voiceSettings.soundEffects) {
    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.05;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      noise.connect(filter);
      filter.connect(ctx.destination);
      noise.start();
    } catch (e) {
      // Ignore audio overlay errors
    }
  }

  window.speechSynthesis.speak(utterance);
}
