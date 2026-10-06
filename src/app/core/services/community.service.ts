import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CommunityNote } from '../models/frequency.model';

type DemoReview = Pick<CommunityNote, 'body' | 'email'>;

const DEMO_REVIEWS: Record<string, DemoReview[]> = {
  'alpha-focus': [
    { email: 'celiaCsharp@gmail.com', body: 'O binaural de 10 Hz ficou agradável em volume baixo e me acompanhou bem durante a leitura.' },
    { email: 'jason@hotmail.com', body: 'Usei em uma sessão curta de estudo; os dois tons são perceptíveis sem serem invasivos.' },
    { email: 'linux_no_topo@mior.com', body: 'Gostei da pulsação regular para manter um fundo sonoro enquanto organizo tarefas.' },
  ],
  'beta-sprint': [
    { email: 'celiaCsharp@gmail.com', body: 'A pulsação de 16 Hz tem presença e combina com uma sessão de trabalho mais ativa.' },
    { email: 'jason@hotmail.com', body: 'Deixei tocando durante um bloco de programação; o tom ficou constante no fundo.' },
    { email: 'linux_no_topo@mior.com', body: 'A diferença entre os ouvidos é clara com fones e o som não precisa ficar alto.' },
  ],
  'pure-440': [
    { email: 'celiaCsharp@gmail.com', body: 'O tom único de 440 Hz é direto, sem camadas, bom para testar o áudio do setup.' },
    { email: 'jason@hotmail.com', body: 'Curti a simplicidade; fica fácil usar por alguns minutos sem mudar de faixa.' },
    { email: 'linux_no_topo@mior.com', body: 'Um som estável para deixar como referência, especialmente em volume baixo.' },
  ],
  'theta-drift': [
    { email: 'celiaCsharp@gmail.com', body: 'A pulsação de 6 Hz soa mais espaçada e encaixou bem numa pausa tranquila.' },
    { email: 'jason@hotmail.com', body: 'Usei depois do trabalho; achei o ritmo menos acelerado que o preset Beta.' },
    { email: 'linux_no_topo@mior.com', body: 'O binaural é discreto e cria um ambiente contínuo para desacelerar.' },
  ],
  'soft-432': [
    { email: 'celiaCsharp@gmail.com', body: 'O tom de 432 Hz é uniforme e agradável para deixar ao fundo durante a meditação.' },
    { email: 'jason@hotmail.com', body: 'Gostei da textura simples; mantive o volume baixo para ouvir por mais tempo.' },
    { email: 'linux_no_topo@mior.com', body: 'Funciona bem como som ambiente sem mudanças bruscas ou batidas.' },
  ],
  'pink-rain': [
    { email: 'celiaCsharp@gmail.com', body: 'O ruído rosa cria um fundo constante e ajudou a disfarçar sons do cômodo.' },
    { email: 'jason@hotmail.com', body: 'A textura lembra chuva distante e fica melhor num volume moderado.' },
    { email: 'linux_no_topo@mior.com', body: 'Usei durante a leitura; o ruído preenche o silêncio sem chamar tanta atenção.' },
  ],
  'delta-night': [
    { email: 'celiaCsharp@gmail.com', body: 'A pulsação de 2 Hz é bem lenta e o tom grave deixou a sessão mais calma.' },
    { email: 'jason@hotmail.com', body: 'Ouvi com fones em volume baixo; a variação entre canais ficou sutil.' },
    { email: 'linux_no_topo@mior.com', body: 'A duração longa facilita deixar o som rodando enquanto preparo a rotina noturna.' },
  ],
  'brown-deep': [
    { email: 'celiaCsharp@gmail.com', body: 'O ruído marrom tem bastante grave e soa encorpado em caixas pequenas.' },
    { email: 'jason@hotmail.com', body: 'Gostei do som contínuo; usei para mascarar ruídos leves do ambiente.' },
    { email: 'linux_no_topo@mior.com', body: 'É uma textura mais profunda que o ruído rosa, ótima para variar o fundo sonoro.' },
  ],
  'low-hum': [
    { email: 'celiaCsharp@gmail.com', body: 'O zumbido de 110 Hz é discreto e previsível, sem oscilações perceptíveis.' },
    { email: 'jason@hotmail.com', body: 'Um grave contínuo que funciona bem como fundo, especialmente em volume baixo.' },
    { email: 'linux_no_topo@mior.com', body: 'A faixa de 45 minutos combina com uma rotina de descanso.' },
  ],
};

@Injectable({ providedIn: 'root' })
export class CommunityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  readonly notes = signal<CommunityNote[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  load(postId: number, frequencyId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.notes.set(this.demoNotes(frequencyId));

    this.http.get<CommunityNote[]>(`${this.baseUrl}/comments?postId=${postId}`).subscribe({
      next: (data) => {
        this.notes.set(this.demoNotes(frequencyId, data));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar as notas da comunidade.');
        this.notes.set(this.demoNotes(frequencyId));
        this.loading.set(false);
      },
    });
  }

  private demoNotes(frequencyId: string, apiNotes: CommunityNote[] = []): CommunityNote[] {
    const reviews = DEMO_REVIEWS[frequencyId] ?? apiNotes.slice(0, 3);
    return reviews.map((review, index) => ({
      ...review,
      id: apiNotes[index]?.id ?? `${frequencyId}-${index + 1}`,
    }));
  }
}
