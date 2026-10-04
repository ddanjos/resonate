import { Injectable, signal } from '@angular/core';

/** Frequências que o usuário separou para a sessão de escuta atual. */
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly ids = signal<string[]>([]);

  toggle(id: string): void {
    this.ids.update((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  }

  clear(): void {
    this.ids.set([]);
  }
}
