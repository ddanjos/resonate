import { Injectable, computed, inject, signal } from '@angular/core';
import { Goal, Preset } from '../models/frequency.model';
import { FrequencyService } from './frequency.service';

const STORAGE_KEY = 'resonate.presets';

/** Presets salvos pelo usuário. Contagens e totais são sempre calculados, nunca guardados. */
@Injectable({ providedIn: 'root' })
export class PresetService {
  private readonly frequencies = inject(FrequencyService);

  readonly presets = signal<Preset[]>(this.restore());

  readonly count = computed(() => this.presets().length);
  readonly activeCount = computed(() => this.presets().filter((p) => p.active).length);

  /** Minutos somados dos presets ativos. */
  readonly activeMinutes = computed(() => {
    const catalog = this.frequencies.items();
    return this.presets()
      .filter((p) => p.active)
      .flatMap((p) => p.frequencyIds)
      .reduce((total, id) => total + (catalog.find((f) => f.id === id)?.durationMin ?? 0), 0);
  });

  add(data: { name: string; goal: Goal; frequencyIds: string[] }): void {
    const preset: Preset = { id: crypto.randomUUID(), active: true, ...data };
    this.presets.update((list) => [preset, ...list]);
    this.save();
  }

  remove(id: string): void {
    this.presets.update((list) => list.filter((p) => p.id !== id));
    this.save();
  }

  toggleActive(id: string): void {
    this.presets.update((list) => list.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
    this.save();
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.presets()));
    } catch {
      /* armazenamento indisponível: o app continua funcionando em memória */
    }
  }

  private restore(): Preset[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Preset[]) : [];
    } catch {
      return [];
    }
  }
}
