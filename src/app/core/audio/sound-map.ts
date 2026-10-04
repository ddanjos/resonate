import type { SoundSpec } from './audio-engine.service';

interface FrequencyLike {
  id: string | number;
  name: string;
  goal: string;
  hz?: number; // use se o seu modelo tiver
}

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// valores ilustrativos de batida por objetivo
const BY_GOAL: Record<string, { carrierHz: number; beatHz: number }> = {
  foco: { carrierHz: 220, beatHz: 16 },
  relaxamento: { carrierHz: 200, beatHz: 10 },
  sono: { carrierHz: 150, beatHz: 3 },
};

export function toSoundSpec(f: FrequencyLike): SoundSpec {
  if (f.hz) return { kind: 'tone', hz: f.hz };

  const base = BY_GOAL[norm(f.goal)] ?? BY_GOAL['relaxamento'];
  // pequena variação por id para os cards não soarem todos iguais
  const hash = [...String(f.id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return { kind: 'binaural', carrierHz: base.carrierHz + (hash % 5) * 10, beatHz: base.beatHz };
}