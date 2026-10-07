import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="border-b border-borda/70">
      <nav class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4" aria-label="Principal">
        <a routerLink="/" class="font-titulo text-xl font-semibold tracking-tight text-texto">
          Resonate
        </a>
        <ul class="flex items-center gap-1 text-sm">
          @for (link of links; track link.path) {
            <li>
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-destaque/15 text-destaque"
                [routerLinkActiveOptions]="{ exact: link.exact }"
                class="rounded-full px-4 py-2 text-suave transition-colors hover:text-texto"
              >
                {{ link.label }}
              </a>
            </li>
          }
        </ul>
      </nav>
    </header>
  `,
})
export class NavbarComponent {
  readonly links = [
    { path: '/', label: 'Catálogo', exact: true },
    { path: '/presets', label: 'Presets', exact: false },
    { path: '/login', label: 'Entrar', exact: false },
  ];
}
