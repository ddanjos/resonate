export type Goal = 'foco' | 'relaxamento' | 'sono';
export type Kind = 'binaural' | 'tom' | 'ruido';

export interface Frequency {
  id: string;
  name: string;
  goal: Goal;
  kind: Kind;
  /** Tom base em Hz (ou frequência de corte, no caso dos ruídos). */
  hz: number;
  /** Diferença entre os dois ouvidos, só nas binaurais. */
  beatHz?: number;
  durationMin: number;
  /** Post do JSONPlaceholder usado para trazer notas da comunidade. */
  communityPostId: number;
  description: string;
  benefits: string[];
}

export interface Preset {
  id: string;
  name: string;
  goal: Goal;
  frequencyIds: string[];
  active: boolean;
}

export interface CommunityNote {
  id: number;
  name: string;
  email: string;
  body: string;
}

export const GOAL_LABELS: Record<Goal, string> = {
  foco: 'Foco',
  relaxamento: 'Relaxamento',
  sono: 'Sono',
};

export const KIND_LABELS: Record<Kind, string> = {
  binaural: 'Binaural',
  tom: 'Tom puro',
  ruido: 'Ruído',
};
