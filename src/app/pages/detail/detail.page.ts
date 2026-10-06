import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AudioEngine } from '../../core/audio/audio-engine.service';
import { GOAL_LABELS, KIND_LABELS } from '../../core/models/frequency.model';
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
  readonly id = input.required<string>();

  readonly freq = inject(FrequencyService);
  readonly community = inject(CommunityService);
  readonly audio = inject(AudioEngine);
  readonly session = inject(SessionService);

  readonly item = computed(() => this.freq.items().find((f) => f.id === this.id()));
  readonly isPlaying = computed(() => this.audio.playing() && this.audio.currentFrequencyIds().includes(this.id()));
  readonly inSession = computed(() => this.session.items().some((item) => item.id === this.id()));

  readonly goalLabel = computed(() => {
    const goal = this.item()?.goal;
    return goal ? (GOAL_LABELS[goal] ?? goal) : '';
  });

  readonly kindLabel = computed(() => {
    const kind = this.item()?.kind;
    return kind ? (KIND_LABELS[kind] ?? kind) : '';
  });

  readonly amplitude = computed(() => {
    const hz = this.item()?.hz ?? 200;
    return Math.max(18, 70 - hz / 12);
  });

  constructor() {
    this.freq.load();

    effect(() => {
      const current = this.item();
      if (current?.communityPostId != null) {
        untracked(() => this.community.load(current.communityPostId!, current.id));
      }
    });

  }

  startPlayback(): void {
    const current = this.item();
    if (current && !this.isPlaying()) this.audio.playFrequency(current);
  }

  toggleSession(id: string): void {
    if (this.inSession()) {
      this.session.remove(id);
    } else {
      const frequency = this.item();
      if (frequency) this.session.add(frequency);
    }
  }
}