import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />
    <main class="mx-auto max-w-5xl px-5 py-8 sm:py-10">
      <router-outlet />
    </main>
    <footer class="mx-auto max-w-5xl px-5 pb-10 text-sm text-suave">
      O som é gerado no navegador. Use volume baixo.
    </footer>
  `,
})
export class AppComponent {}
