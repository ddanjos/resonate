import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WaveLinesComponent } from '../../shared/components/wave-lines.component';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink, WaveLinesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative isolate overflow-hidden rounded-onda border border-borda bg-superficie/60">
      <div class="absolute inset-0 -z-10 opacity-60">
        <!-- Onda quase reta: o sinal se perdeu -->
        <app-wave-lines [lines]="28" [amplitude]="6" [height]="260" />
      </div>
      <div class="px-6 py-20 text-center sm:py-28">
        <p class="font-titulo text-6xl font-semibold text-destaque">404</p>
        <h1 class="mt-4 font-titulo text-2xl font-semibold">Sem sinal nesta página</h1>
        <p class="mx-auto mt-3 max-w-md text-suave">O endereço que você abriu não existe. Volte ao catálogo para sintonizar de novo.</p>
        <a routerLink="/" class="mt-8 inline-block rounded-full bg-destaque px-6 py-3 font-medium text-fundo hover:bg-onda">
          Voltar ao catálogo
        </a>
      </div>
    </section>
  `,
})
export class NotFoundPage {}
