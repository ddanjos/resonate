import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { frequencyName, GOAL_LABELS } from '../../core/models/frequency.model';
import { FrequencyService } from '../../core/services/frequency.service';
import { PresetService } from '../../core/services/preset.service';
import { SessionService } from '../../core/services/session.service';
import { FrequencyCardComponent } from '../../shared/components/frequency-card.component';
import { GoalFilterComponent, GoalFilterValue } from '../../shared/components/goal-filter.component';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { StateMessageComponent } from '../../shared/components/state-message.component';
import { WaveLinesComponent } from '../../shared/components/wave-lines.component';
import { PlaybackModeComponent } from '../../shared/components/playback-mode.component';
import { AudioEngine } from '../../core/audio/audio-engine.service';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    FrequencyCardComponent,
    GoalFilterComponent,
    StatCardComponent,
    StateMessageComponent,
    WaveLinesComponent,
    PlaybackModeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
})
export class HomePage {
  audio = inject(AudioEngine);
  readonly freq = inject(FrequencyService);
  readonly session = inject(SessionService);
  readonly presets = inject(PresetService);

  readonly goal = signal<GoalFilterValue>('todos');
  readonly query = signal('');

  readonly goalOptions: { value: GoalFilterValue; label: string }[] = [
    { value: 'todos', label: 'Todas' },
    { value: 'foco', label: GOAL_LABELS.foco },
    { value: 'relaxamento', label: GOAL_LABELS.relaxamento },
    { value: 'sono', label: GOAL_LABELS.sono },
  ];

  readonly filtered = computed(() => {
    const goal = this.goal();
    const text = this.query().trim().toLowerCase();
    return this.freq.items().filter(
      (f) =>
        (goal === 'todos' || f.goal === goal) &&
        (text === '' || frequencyName(f).toLowerCase().includes(text) || f.description.toLowerCase().includes(text)),
    );
  });

  readonly sessionItems = computed(() => {
    return this.session.items();
  });

  readonly sessionMinutes = computed(() => this.session.totalDuration());

  readonly sessionLevel = computed(() => {
    const minutes = this.sessionMinutes();
    if (minutes === 0) return 'Nenhuma frequência escolhida';
    if (minutes <= 30) return 'Sessão curta';
    if (minutes <= 75) return 'Sessão média';
    return 'Sessão longa';
  });

  constructor() {
    this.freq.load();
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  formatMinutes(total: number): string {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return h > 0 ? `${h} h ${m} min` : `${m} min`;
  }
}
