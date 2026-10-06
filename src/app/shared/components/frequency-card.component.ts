import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Frequency } from '../../core/models/frequency.model';
import { SessionService } from '../../core/services/session.service';
import { AudioEngine } from '../../core/audio/audio-engine.service';

@Component({
  selector: 'app-frequency-card',
  standalone: true,
  imports: [RouterLink],
  styles: ':host { display: block; height: 100%; }',
  template: `
    <div class="flex h-full flex-col justify-between rounded-xl border border-borda bg-superficie/80 p-5 transition-colors hover:border-destaque/50">
      <div>
        <div class="flex items-center justify-between gap-2">
          <a [routerLink]="['/detail', freq().id]" class="font-semibold text-texto transition-colors hover:text-destaque">
            {{ freq().name ?? freq().title }}
          </a>
          <span class="rounded-full border border-borda px-2.5 py-0.5 text-xs text-onda">{{ freq().category }}</span>
        </div>
        <p class="mt-1 text-xs text-suave">{{ freq().type ?? freq().kind }} • {{ freq().hz }} Hz • {{ freq().durationMin ?? freq().durationMinutes ?? freq().duration ?? 0 }} min</p>
        <p class="mt-3 text-sm text-texto/85">{{ freq().description }}</p>
      </div>

      <div class="mt-5 flex items-center justify-between gap-2">
        <button
          type="button"
          (click)="audio.previewFrequency(freq())"
          class="min-h-10 rounded-full border border-borda px-4 py-2 text-xs font-medium text-suave transition-colors hover:border-destaque/60 hover:text-texto"
        >
          @if (audio.previewingId() === freq().id) {
            Ouvindo...
          } @else {
            Pré-escutar
          }
        </button>

        @if (isInSession()) {
          <button
            type="button"
            (click)="session.remove(freq().id)"
            [attr.aria-label]="'Remover ' + (freq().name ?? freq().title) + ' da sessão'"
            [attr.title]="'Remover ' + (freq().name ?? freq().title) + ' da sessão'"
            [attr.aria-pressed]="true"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-erro/40 bg-erro/10 text-xl leading-none text-erro transition-colors hover:bg-erro/15"
          >
            <span aria-hidden="true">-</span>
          </button>
        } @else {
          <button
            type="button"
            (click)="session.add(freq())"
            [attr.aria-label]="'Adicionar ' + (freq().name ?? freq().title) + ' à sessão'"
            [attr.title]="'Adicionar ' + (freq().name ?? freq().title) + ' à sessão'"
            [attr.aria-pressed]="false"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-destaque/35 bg-destaque/10 text-xl leading-none text-destaque transition-colors hover:border-destaque/60 hover:bg-destaque/15"
          >
            <span aria-hidden="true">+</span>
          </button>
        }
      </div>
    </div>
  `,
})
export class FrequencyCardComponent {
  public freq = input.required<Frequency>();
  protected session = inject(SessionService);
  protected audio = inject(AudioEngine);

  protected isInSession() {
    return this.session.items().some((f) => f.id === this.freq().id);
  }
}