import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Frequency } from '../models/frequency.model';

/** Busca o catálogo de frequências e guarda o estado de carregamento. */
@Injectable({ providedIn: 'root' })
export class FrequencyService {
  private readonly http = inject(HttpClient);

  readonly items = signal<Frequency[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /** Carrega o catálogo. Não repete a chamada se já houver dados, a menos que `force` seja true. */
  load(force = false): void {
    if (!force && (this.loading() || this.items().length > 0)) return;

    this.loading.set(true);
    this.error.set(null);

    this.http.get<Frequency[]>('data/frequencies.json').subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar as frequências. Verifique sua conexão e tente de novo.');
        this.loading.set(false);
      },
    });
  }
}
