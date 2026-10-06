import { Injectable, computed, inject, signal } from '@angular/core';
import { AudioEngine } from '../audio/audio-engine.service';
import { Goal, Preset, frequencyDurationMinutes } from '../models/frequency.model';
import { FrequencyService } from './frequency.service';

const STORAGE_KEY = 'resonate.presets';

@Injectable({ providedIn: 'root' })
export class PresetService {
  private readonly frequencies = inject(FrequencyService);
  private readonly audio = inject(AudioEngine);

  readonly presets = signal<Preset[]>(this.restore());

  readonly count = computed(() => this.presets().length);
  readonly activeCount = computed(() => {
    const currentPresetId = this.audio.currentPresetId();
    return this.audio.playing() && currentPresetId ? 1 : 0;
  });

  readonly activeMinutes = computed(() => {
    const currentPresetId = this.audio.currentPresetId();
    if (!this.audio.playing() || !currentPresetId) return 0;

    const catalog = this.frequencies.items();
    const preset = this.presets().find((item) => item.id === currentPresetId);
    const durations = preset?.frequencyIds.map((id) => {
      const frequency = catalog.find((item) => item.id === id);
      return frequency ? frequencyDurationMinutes(frequency) : 0;
    }) ?? [];
    return this.audio.currentPlaybackMode() === 'simultaneous'
      ? Math.max(0, ...durations)
      : durations.reduce((total, duration) => total + duration, 0);
  });

  add(data: { name: string; goal: Goal; frequencyIds: string[] }): void {
    const preset: Preset = { id: crypto.randomUUID(), ...data };
    this.presets.update((list) => [preset, ...list]);
    this.save();
  }

  remove(id: string): void {
    this.presets.update((list) => list.filter((p) => p.id !== id));
    this.save();
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.presets()));
    } catch {}
  }

  private restore(): Preset[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Preset[]).map((preset) => ({ ...preset, active: false })) : [];
    } catch {
      return [];
    }
  }
}
