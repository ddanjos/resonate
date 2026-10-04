import { Injectable, computed, effect, signal } from '@angular/core';

export type SoundSpec =
  | { kind: 'tone'; hz: number }
  | { kind: 'noise'; color: 'white' | 'pink' | 'brown' }
  | { kind: 'binaural'; carrierHz: number; beatHz: number };

const VOLUME_KEY = 'resonate:volume';
const LEVEL = 0.5; // nível de uma camada; dividido pelo nº de camadas

@Injectable({ providedIn: 'root' })
export class AudioEngine {
  private ctx?: AudioContext;
  private master?: GainNode;
  private current?: { out: GainNode; sources: AudioScheduledSourceNode[] };
  private noiseCache = new Map<string, AudioBuffer>();

  readonly volume = signal(this.loadVolume()); // 0..1
  readonly muted = signal(false);
  readonly playingKey = signal<string | null>(null);
  readonly playingLabel = signal('');
  readonly playing = computed(() => this.playingKey() !== null);

  constructor() {
    effect(() => {
      const v = this.volume();
      const m = this.muted();
      this.saveVolume(v);
      if (this.master && this.ctx) {
        this.master.gain.setTargetAtTime(this.gainFor(v, m), this.ctx.currentTime, 0.03);
      }
    });
  }

  toggle(key: string, spec: SoundSpec | SoundSpec[], label: string): void {
    if (this.playingKey() === key) this.stop();
    else this.play(key, spec, label);
  }

  play(key: string, spec: SoundSpec | SoundSpec[], label: string): void {
    this.stop();
    const ctx = this.ensure();
    const specs = Array.isArray(spec) ? spec : [spec];

    const out = ctx.createGain();
    out.gain.setValueAtTime(0, ctx.currentTime);
    out.gain.linearRampToValueAtTime(LEVEL / specs.length, ctx.currentTime + 0.4);
    out.connect(this.master!);

    const sources = specs.flatMap((s) => this.layer(ctx, s, out));
    sources.forEach((s) => s.start());

    this.current = { out, sources };
    this.playingKey.set(key);
    this.playingLabel.set(label);
  }

  stop(): void {
    const cur = this.current;
    if (!cur || !this.ctx) return;
    const t = this.ctx.currentTime;
    cur.out.gain.cancelScheduledValues(t);
    cur.out.gain.setValueAtTime(cur.out.gain.value, t);
    cur.out.gain.linearRampToValueAtTime(0, t + 0.3);
    cur.sources.forEach((s) => s.stop(t + 0.35));
    this.current = undefined;
    this.playingKey.set(null);
    this.playingLabel.set('');
  }

  private ensure(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.gainFor(this.volume(), this.muted());
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  // curva quadrática: o slider fica mais natural e os volumes baixos mais finos
  private gainFor(v: number, muted: boolean): number {
    return muted ? 0 : v * v;
  }

  private layer(ctx: AudioContext, spec: SoundSpec, out: GainNode): AudioScheduledSourceNode[] {
    if (spec.kind === 'tone') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = spec.hz;
      osc.connect(out);
      return [osc];
    }
    if (spec.kind === 'noise') {
      const src = ctx.createBufferSource();
      src.buffer = this.noise(ctx, spec.color);
      src.loop = true;
      src.connect(out);
      return [src];
    }
    return [
      { hz: spec.carrierHz, pan: -1 },
      { hz: spec.carrierHz + spec.beatHz, pan: 1 },
    ].map(({ hz, pan }) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = hz;
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      osc.connect(p).connect(out);
      return osc;
    });
  }

  private noise(ctx: AudioContext, color: 'white' | 'pink' | 'brown'): AudioBuffer {
    let buf = this.noiseCache.get(color);
    if (!buf) {
      buf = this.noiseBuffer(ctx, color);
      this.noiseCache.set(color, buf);
    }
    return buf;
  }

    private noiseBuffer(ctx: AudioContext, color: 'white' | 'pink' | 'brown'): AudioBuffer {
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (color === 'white') {
        d[i] = w * 0.5;
      } else if (color === 'pink') {
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      } else {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
    return buf;
  }

  private loadVolume(): number {
    try {
      const raw = localStorage.getItem(VOLUME_KEY);
      const n = raw === null ? NaN : Number(raw);
      return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.4;
    } catch {
      return 0.4;
    }
  }

  private saveVolume(v: number): void {
    try {
      localStorage.setItem(VOLUME_KEY, String(v));
    } catch {
      /* armazenamento indisponível: ignora */
    }
  }
}