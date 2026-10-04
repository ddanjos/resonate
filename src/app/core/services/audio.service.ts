import { Injectable, effect, signal } from '@angular/core';
import { Frequency } from '../models/frequency.model';

/**
 * Gera o som direto no navegador com a Web Audio API.
 * Nenhum arquivo de áudio é usado: cada frequência é sintetizada na hora.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  private ctx?: AudioContext;
  private master?: GainNode;
  private sources: AudioScheduledSourceNode[] = [];

  readonly playingId = signal<string | null>(null);
  readonly volume = signal(0.25);

  constructor() {
    effect(() => {
      const volume = this.volume();
      if (this.ctx && this.master) {
        this.master.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05);
      }
    });
  }

  play(freq: Frequency): void {
    this.stop();

    const ctx = (this.ctx ??= new AudioContext());
    void ctx.resume();

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.setTargetAtTime(this.volume(), ctx.currentTime, 0.4);
    master.connect(ctx.destination);
    this.master = master;

    if (freq.kind === 'binaural') {
      const merger = ctx.createChannelMerger(2);
      merger.connect(master);
      [freq.hz, freq.hz + (freq.beatHz ?? 0)].forEach((hz, channel) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = hz;
        osc.connect(merger, 0, channel);
        osc.start();
        this.sources.push(osc);
      });
    } else if (freq.kind === 'tom') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq.hz;
      osc.connect(master);
      osc.start();
      this.sources.push(osc);
    } else {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = freq.hz;

      noise.connect(filter);
      filter.connect(master);
      noise.start();
      this.sources.push(noise);
    }

    this.playingId.set(freq.id);
  }

  stop(): void {
    if (this.ctx && this.master) {
      const end = this.ctx.currentTime + 0.2;
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      this.sources.forEach((s) => {
        try {
          s.stop(end);
        } catch {
          /* já parado */
        }
      });
    }
    this.sources = [];
    this.master = undefined;
    this.playingId.set(null);
  }
}
