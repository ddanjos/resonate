import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GOAL_LABELS, KIND_LABELS } from '../../core/models/frequency.model';
import { AudioService } from '../../core/services/audio.service';
import { CommunityService } from '../../core/services/community.service';
import { FrequencyService } from '../../core/services/frequency.service';
import { SessionService } from '../../core/services/session.service';
import { StateMessageComponent } from '../../shared/components/state-message.component';
import { WaveLinesComponent } from '../../shared/components/wave-lines.component';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [RouterLink, StateMessageComponent, WaveLinesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail.page.html',
})
export class DetailPage {
  /** Vem da rota /detail/:id (withComponentInputBinding). */
  readonly id = input.required<string>();

  readonly freq = inject(FrequencyService);
  readonly community = inject(CommunityService);
  readonly audio = inject(AudioService);
  readonly session = inject(SessionService);

  readonly item = computed(() => this.freq.items().find((f) => f.id === this.id()));
  readonly isPlaying = computed(() => this.audio.playingId() === this.id());
  readonly inSession = computed(() => this.session.ids().includes(this.id()));
  readonly goalLabel = computed(() => (this.item() ? GOAL_LABELS[this.item()!.goal] : ''));
  readonly kindLabel = computed(() => (this.item() ? KIND_LABELS[this.item()!.kind] : ''));

  /** Quanto maior o tom, mais comprimida a onda desenhada. */
  readonly amplitude = computed(() => {
    const hz = this.item()?.hz ?? 200;
    return Math.max(18, 70 - hz / 12);
  });

  constructor() {
    this.freq.load();

    effect(() => {
      const current = this.item();
      if (current) {
        untracked(() => this.community.load(current.communityPostId));
      }
    });

    inject(DestroyRef).onDestroy(() => this.audio.stop());
  }

  togglePlay(): void {
    const current = this.item();
    if (!current) return;
    if (this.isPlaying()) {
      this.audio.stop();
    } else {
      this.audio.play(current);
    }
  }

  onVolume(event: Event): void {
    this.audio.volume.set(Number((event.target as HTMLInputElement).value));
  }
}
