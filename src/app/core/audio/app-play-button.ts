import { Component, computed, inject, input } from '@angular/core';
import { AudioEngine, SoundSpec } from '../../core/audio/audio-engine.service';

@Component({
  selector: 'app-play-button',
  standalone: true,
  template: `
    <button
      type="button"
      (click)="onClick($event)"
      [attr.aria-pressed]="active()"
      [attr.aria-label]="(active() ? 'Parar ' : 'Ouvir ') + label()"
      class="rounded-full border px-4 py-2 text-sm transition"
      [class]="active()
        ? 'border-destaque bg-destaque text-fundo'
        : 'border-borda text-suave hover:text-texto'"
    >
      {{ active() ? 'Parar' : 'Ouvir' }}
    </button>
  `,
})
export class PlayButton {
  private audio = inject(AudioEngine);

  readonly soundKey = input.required<string>();
  readonly spec = input.required<SoundSpec | SoundSpec[]>();
  readonly label = input.required<string>();

  protected active = computed(() => this.audio.playingKey() === this.soundKey());

  onClick(e: Event): void {
    e.stopPropagation();
    this.audio.toggle(this.soundKey(), this.spec(), this.label());
  }
}