import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Linhas onduladas decorativas. A quantidade e a intensidade mudam conforme os inputs. */
@Component({
  selector: 'app-wave-lines',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="wave" [attr.viewBox]="'0 0 800 ' + height()" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="waveStroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#2f6fd6" stop-opacity="0.2" />
          <stop offset="0.5" stop-color="#8de3ff" stop-opacity="0.9" />
          <stop offset="1" stop-color="#4cb3ff" stop-opacity="0.25" />
        </linearGradient>
      </defs>
      @for (d of paths(); track $index) {
        <path [attr.d]="d" fill="none" stroke="url(#waveStroke)" stroke-width="1" />
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    .wave { width: 100%; height: 100%; display: block; animation: drift 9s ease-in-out infinite alternate; }
    @keyframes drift { from { transform: translateX(-1.5%); } to { transform: translateX(1.5%); } }
    @media (prefers-reduced-motion: reduce) { .wave { animation: none; } }
  `,
})
export class WaveLinesComponent {
  readonly lines = input(36);
  readonly amplitude = input(40);
  readonly height = input(240);

  readonly paths = computed(() => {
    const total = this.lines();
    const amp = this.amplitude();
    const h = this.height();
    const mid = h / 2;

    return Array.from({ length: total }, (_, i) => {
      const t = i / Math.max(total - 1, 1);
      const phase = t * 2.4;
      const scale = 0.35 + t * 0.65;
      let d = '';
      for (let x = 0; x <= 800; x += 20) {
        const y =
          mid +
          Math.sin(x / 130 + phase) * amp * scale +
          Math.sin(x / 60 + phase * 1.7) * amp * 0.18 * (1 - t) +
          (t - 0.5) * amp * 0.9;
        d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
      }
      return d.trim();
    });
  });
}
