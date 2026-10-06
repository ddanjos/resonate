import { Component, inject } from '@angular/core';
import { AudioEngine } from './audio-engine.service';
import { VolumeControl } from './app-volume-control';

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [VolumeControl],
  template: `
    @if (audio.playing()) {
      <section class="player-enter fixed inset-x-0 bottom-0 z-[60] border-t border-borda bg-fundo/95 px-4 py-3 shadow-brilho backdrop-blur-xl" aria-label="Player global">
        <div class="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(12rem,1.5fr)_minmax(0,1fr)] lg:gap-x-5 lg:gap-y-0">
          <div class="flex min-w-0 items-center gap-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center gap-0.5" aria-hidden="true">
              <span class="animate-bar-1 h-1.5 w-0.5 rounded-full bg-destaque" [class.animation-paused]="audio.paused()"></span>
              <span class="animate-bar-2 h-2.5 w-0.5 rounded-full bg-destaque" [class.animation-paused]="audio.paused()"></span>
              <span class="animate-bar-3 h-3 w-0.5 rounded-full bg-destaque" [class.animation-paused]="audio.paused()"></span>
              <span class="animate-bar-1 h-2 w-0.5 rounded-full bg-destaque" [class.animation-paused]="audio.paused()"></span>
              <span class="animate-bar-2 h-1 w-0.5 rounded-full bg-destaque" [class.animation-paused]="audio.paused()"></span>
            </span>
            <div class="min-w-0">
              <p class="text-xs text-suave">
                {{ audio.paused() ? 'Pausado' : 'Tocando agora' }} ·
                @if (audio.queueLength() > 1 && audio.currentPlaybackMode() === 'sequential') {
                  Faixa {{ audio.queuePosition() }} de {{ audio.queueLength() }}
                } @else if (audio.currentPlaybackMode() === 'simultaneous') {
                  Mix de {{ audio.queueLength() }} {{ audio.queueLength() === 1 ? 'frequência' : 'frequências' }}
                } @else {
                  {{ audio.currentFrequencyIds().length }} {{ audio.currentFrequencyIds().length === 1 ? 'frequência' : 'frequências' }}
                }
              </p>
              <p class="truncate text-sm font-medium text-texto">{{ audio.playingLabel() }}</p>
            </div>
          </div>

          <button
            type="button"
            (click)="togglePlayback()"
            [attr.aria-label]="audio.paused() ? 'Retomar reprodução' : 'Pausar reprodução'"
            [attr.title]="audio.paused() ? 'Retomar reprodução' : 'Pausar reprodução'"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-destaque/40 bg-destaque/10 text-destaque transition-colors hover:bg-destaque/15"
          >
            @if (audio.paused()) {
              <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            } @else {
              <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z" /></svg>
            }
          </button>

          <div class="col-span-2 grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 lg:col-span-1">
            <span class="font-mono text-[10px] tabular-nums text-suave">{{ audio.formattedElapsedTime() }}</span>
            <div
              class="h-1.5 overflow-hidden rounded-full bg-borda"
              role="progressbar"
              aria-label="Progresso da reprodução"
              [attr.aria-valuenow]="audio.progressPercent()"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div class="h-full rounded-full bg-destaque transition-[width] duration-700" [style.width.%]="audio.progressPercent()"></div>
            </div>
            <span class="font-mono text-[10px] tabular-nums text-suave">{{ audio.formattedDuration() }}</span>
          </div>

          <div class="col-span-2 flex min-w-0 items-center justify-end border-t border-borda/60 pt-2 lg:col-span-1 lg:border-0 lg:pt-0">
            <app-volume-control />
          </div>
        </div>
      </section>
    }
  `,
})
export class PlayerBar {
  protected audio = inject(AudioEngine);

  togglePlayback(): void {
    if (this.audio.paused()) this.audio.resume();
    else this.audio.pause();
  }
}