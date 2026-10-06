import { Injectable, signal, computed, inject } from '@angular/core';
import { Frequency, frequencyDurationMinutes, PlaybackMode } from '../models/frequency.model';
import { AudioEngine } from '../audio/audio-engine.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private audioEngine = inject(AudioEngine);

  public items = signal<Frequency[]>([]);
  public playbackMode = signal<PlaybackMode>('sequential');

  public count = computed(() => this.items().length);

  public totalDuration = computed(() => {
    const durations = this.items().map(frequencyDurationMinutes);
    return this.playbackMode() === 'simultaneous'
      ? Math.max(0, ...durations)
      : durations.reduce((total, duration) => total + duration, 0);
  });

  public add(freq: Frequency) {
    if (!this.items().some((f) => f.id === freq.id)) {
      this.items.update((list) => [...list, freq]);
    }
  }

  public remove(id: string) {
    this.items.update((list) => list.filter((f) => f.id !== id));
    if (this.items().length === 0) {
      this.audioEngine.stop();
    }
  }

  public clear() {
    this.items.set([]);
    this.audioEngine.stop();
  }

  public playSession(presetId: string | null = null) {
    if (this.items().length > 0) {
      this.audioEngine.playSession(this.items(), this.totalDuration(), presetId, this.playbackMode());
    }
  }

  public loadPreset(frequencies: Frequency[], presetId: string | null = null) {
    this.items.set(frequencies);
    this.playSession(presetId);
  }
}