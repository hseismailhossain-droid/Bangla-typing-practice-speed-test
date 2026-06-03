/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple Browser Audio Synthesis for mechanical keyboard keypress sound effects
let audioCtx: AudioContext | null = null;

export function playKeyClick(type: "normal" | "space" | "backspace" | "success" = "normal") {
  try {
    // Lazy initialize standard AudioContext
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === "space") {
      // Deeper, dull thud for space bar
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gainNode.gain.setValueAtTime(0.35, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "backspace") {
      // Lower slide sweep for delete
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.08);

      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "success") {
      // Nice ascending chirpy chime for completing a lesson successfully!
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.setValueAtTime(0.15, now + 0.24);
      gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.4);
    } else {
      // High-pitched tactile mechanical click
      osc.type = "triangle";
      // Slightly randomize frequency to sound realistic and alive!
      const randFreq = 800 + Math.random() * 250;
      osc.frequency.setValueAtTime(randFreq, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      // Noise click part
      const noise = audioCtx.createOscillator();
      const noiseGain = audioCtx.createGain();
      noise.type = "sine";
      noise.frequency.setValueAtTime(2000, now);
      noise.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noiseGain.gain.setValueAtTime(0.03, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      noise.start(now);
      noise.stop(now + 0.02);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (error) {
    // Graceful absolute fallback if AudioContext is not initialized or supported in iframe sandboxes
    console.debug("Audio click sound skipped", error);
  }
}
