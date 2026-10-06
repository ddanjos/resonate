import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { PlayerBar } from './core/audio/app-player-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, PlayerBar],
  template: `
    <div class="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <app-navbar />

      <main class="container mx-auto flex-1 px-4 py-6 pb-36 sm:pb-28">
        <router-outlet />
      </main>

      <app-player-bar />
    </div>
  `
})
export class AppComponent {}