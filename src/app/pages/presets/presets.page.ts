import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { startWith } from 'rxjs';
import { frequencyDurationMinutes, GOAL_LABELS, Goal, PlaybackMode, Preset } from '../../core/models/frequency.model';
import { AudioEngine } from '../../core/audio/audio-engine.service';
import { FrequencyService } from '../../core/services/frequency.service';
import { PresetService } from '../../core/services/preset.service';
import { SessionService } from '../../core/services/session.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { StateMessageComponent } from '../../shared/components/state-message.component';
import { PlaybackModeComponent } from '../../shared/components/playback-mode.component';

function atLeastOne(control: AbstractControl): ValidationErrors | null {
  return Array.isArray(control.value) && control.value.length > 0 ? null : { atLeastOne: true };
}

@Component({
  selector: 'app-presets-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, StatCardComponent, StateMessageComponent, PlaybackModeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './presets.page.html',
})
export class PresetsPage {
  private readonly fb = inject(FormBuilder);
  readonly freq = inject(FrequencyService);
  readonly store = inject(PresetService);
  readonly audio = inject(AudioEngine);
  readonly session = inject(SessionService);

  readonly goals = (Object.keys(GOAL_LABELS) as Goal[]).map((value) => ({ value, label: GOAL_LABELS[value] }));
  readonly goalLabels = GOAL_LABELS;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    goal: ['foco' as Goal, Validators.required],
    frequencyIds: [this.session.items().map((item) => item.id), atLeastOne],
  });

  readonly saved = signal(false);

  private readonly pickedIds = toSignal(
    this.form.controls.frequencyIds.valueChanges.pipe(startWith(this.form.controls.frequencyIds.value)),
    { initialValue: [] as string[] },
  );

  readonly pickedItems = computed(() => {
    const ids = this.pickedIds();
    return this.freq.items().filter((f) => ids.includes(f.id));
  });

  readonly pickedMinutes = computed(() => this.pickedItems().reduce((sum, f) => sum + frequencyDurationMinutes(f), 0));

  constructor() {
    this.freq.load();
  }

  isPicked(id: string): boolean {
    return this.pickedIds().includes(id);
  }

  togglePick(id: string): void {
    const control = this.form.controls.frequencyIds;
    const current = control.value;
    control.setValue(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
    control.markAsTouched();
    this.saved.set(false);
  }

  playPreset(preset: Preset): void {
    if (
      this.audio.currentPresetId() === preset.id &&
      this.audio.playing() &&
      this.audio.currentPlaybackMode() === this.session.playbackMode()
    ) {
      if (this.audio.paused()) this.audio.resume();
      else this.audio.pause();
      return;
    }

    const frequencies = this.freq.items().filter((frequency) => preset.frequencyIds.includes(frequency.id));
    if (frequencies.length === 0) return;

    this.session.loadPreset(frequencies, preset.id);
  }

  setPlaybackMode(mode: PlaybackMode): void {
    this.session.playbackMode.set(mode);
  }

  presetStatus(preset: Preset): string {
    if (this.audio.currentPresetId() === preset.id && this.audio.playing()) {
      return this.audio.paused() ? 'Pausado' : 'Tocando';
    }
    return 'Salvo';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, goal, frequencyIds } = this.form.getRawValue();
    this.store.add({ name: name.trim(), goal, frequencyIds });
    this.session.clear();
    this.form.reset({ name: '', goal: 'foco', frequencyIds: [] });
    this.saved.set(true);
  }

  namesOf(ids: string[]): string {
    const catalog = this.freq.items();
    return ids.map((id) => catalog.find((f) => f.id === id)?.name ?? id).join(', ');
  }
}
