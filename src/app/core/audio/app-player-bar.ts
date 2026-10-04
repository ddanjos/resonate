import { Component, inject } from '@angular/core';
import { AudioEngine } from '../../core/audio/audio-engine.service';
import { VolumeControl } from './app-volume-control';

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [VolumeControl],
  template: `
    @if (audio.playing()) {
      <div class="fixed inset-x-0 bottom-0 z-50 border-t border-borda bg-superficie/95 backdrop-blur" role="region" aria-label="Player">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p class="truncate text-sm"><span class="text-suave">Tocando:</span> {{ audio.playingLabel() }}</p>
          <div class="flex items-center gap-4">
            <app-volume-control />
            <button type="button" (click)="audio.stop()" class="rounded-full bg-destaque px-4 py-2 text-sm font-medium text-fundo hover:bg-onda">
              Parar
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class PlayerBar {
  protected audio = inject(AudioEngine);
}