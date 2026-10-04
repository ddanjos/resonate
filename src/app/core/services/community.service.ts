import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CommunityNote } from '../models/frequency.model';

/** Notas de ouvintes, vindas da API pública JSONPlaceholder. */
@Injectable({ providedIn: 'root' })
export class CommunityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  readonly notes = signal<CommunityNote[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  load(postId: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.notes.set([]);

    this.http.get<CommunityNote[]>(`${this.baseUrl}/comments?postId=${postId}`).subscribe({
      next: (data) => {
        this.notes.set(data.slice(0, 3));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar as notas da comunidade.');
        this.loading.set(false);
      },
    });
  }
}
