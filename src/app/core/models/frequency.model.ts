export type Goal = 'foco' | 'relaxamento' | 'sono' | 'meditacao' | 'cura' | 'todos' | string;
export type PlaybackMode = 'sequential' | 'simultaneous';

export const GOAL_LABELS: Record<string, string> = {
  foco: 'Foco & Concentração',
  relaxamento: 'Relaxamento',
  sono: 'Sono Profundo',
  meditacao: 'Meditação',
  cura: 'Cura & Regeneração',
  todos: 'Todas as Metas'
};

export const KIND_LABELS: Record<string, string> = {
  binaural: 'Tom Binaural',
  tom: 'Tom Puro / Isocrônico',
  tone: 'Tom Puro',
  noise: 'Ruído'
};

export interface CommunityNote {
  id: string | number;
  author?: string;
  email?: string;
  body?: string;
  content?: string;
  createdAt?: string;
}

export interface Preset {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  goal?: Goal;
  frequencyIds: string[];
  active?: boolean;
}

export interface Frequency {
  id: string;
  name?: string;
  title?: string;
  hz: number;
  category: string;
  description: string;
  durationMinutes?: number;
  duration?: number;
  durationMin?: number;
  type?: string;
  kind?: 'binaural' | 'tom' | 'tone' | 'noise' | string;
  beatHz?: number;
  benefits?: string[];
  communityPostId?: number;
  goal?: Goal;
}

export function frequencyName(frequency: Frequency): string {
  return frequency.name ?? frequency.title ?? '';
}

export function frequencyDurationMinutes(frequency: Frequency): number {
  return frequency.durationMin ?? frequency.durationMinutes ?? frequency.duration ?? 0;
}