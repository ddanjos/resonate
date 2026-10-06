import { Injectable, signal, computed } from '@angular/core';
import { Frequency, frequencyDurationMinutes, PlaybackMode } from '../models/frequency.model';

@Injectable({
  providedIn: 'root',
})
export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private activeNodes: { sources: AudioScheduledSourceNode[]; gain: GainNode; volumeScale: number }[] = [];
  private timerInterval: any = null;
  private sessionQueue: Frequency[] = [];
  private sessionQueueIndex = 0;

  public playing = signal<boolean>(false);
  public paused = signal<boolean>(false);
  public previewingId = signal<string | null>(null);
  public currentFrequencyIds = signal<string[]>([]);
  public currentPresetId = signal<string | null>(null);
  public currentPlaybackMode = signal<PlaybackMode>('sequential');
  public queueLength = signal(0);
  public queuePosition = signal(0);
  public playingLabel = signal<string>('');
  public volume = signal<number>(0.5);
  public isMuted = signal<boolean>(false);
  
  public get muted() {
    return this.isMuted;
  }

  public remainingSeconds = signal<number>(0);
  public durationSeconds = signal<number>(0);

  public elapsedSeconds = computed(() => Math.max(0, this.durationSeconds() - this.remainingSeconds()));
  public progressPercent = computed(() => {
    const duration = this.durationSeconds();
    return duration > 0 ? Math.min(100, (this.elapsedSeconds() / duration) * 100) : 0;
  });

  public formattedElapsedTime = computed(() => this.formatTime(this.elapsedSeconds()));
  public formattedDuration = computed(() => this.formatTime(this.durationSeconds()));

  public formattedTimeLeft = computed(() => {
    return this.formatTime(this.remainingSeconds());
  });

  private formatTime(seconds: number): string {
    const total = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume();
    }
  }

public play(
  id: string,
  config: { kind?: string; hz?: number; carrierHz?: number; beatHz?: number; color?: string; [key: string]: any },
  label?: string
) {
  this.initContext();
  this.stop();

  this.playingLabel.set(label || id);
  this.playing.set(true);
  this.previewingId.set(id);
  this.currentPlaybackMode.set('sequential');
  this.queueLength.set(1);
  this.queuePosition.set(1);

  this.currentFrequencyIds.set([id]);
  this.currentPresetId.set(null);
  this.startTone(config.hz || config.carrierHz || 440, config.kind || 'tone', config.beatHz || 0);
  this.startTimer(10);
}

  public previewFrequency(freq: Frequency) {
    this.initContext();
    this.stop();

    const labelName = freq.name || freq.title || 'Frequência';
    const soundType = freq.kind || freq.type || freq.category || 'Tom';

    this.previewingId.set(freq.id);
    this.playingLabel.set(`Pré-escuta: ${labelName}`);
    this.playing.set(true);
    this.currentPlaybackMode.set('sequential');
    this.queueLength.set(1);
    this.queuePosition.set(1);

    this.currentFrequencyIds.set([freq.id]);
    this.currentPresetId.set(null);
    this.startTone(freq.hz, soundType, freq.beatHz || 0);
    this.startTimer(10);
  }

  public playFrequency(freq: Frequency) {
    this.initContext();
    this.stop();

    const labelName = freq.name || freq.title || 'Frequência';
    const soundType = freq.kind || freq.type || freq.category || 'Tom';
    this.playingLabel.set(labelName);
    this.playing.set(true);
    this.currentPlaybackMode.set('sequential');
    this.queueLength.set(1);
    this.queuePosition.set(1);
    this.currentFrequencyIds.set([freq.id]);
    this.startTone(freq.hz, soundType, freq.beatHz || 0);
    this.startTimer(frequencyDurationMinutes(freq) * 60 || 30 * 60);
  }

  public playSession(
    frequencies: Frequency[],
    durationMinutes: number,
    presetId: string | null = null,
    mode: PlaybackMode = 'sequential',
  ) {
    if (frequencies.length === 0) return;
    this.initContext();
    this.stop();

    this.playing.set(true);
    this.previewingId.set(null);
    this.currentPresetId.set(presetId);
    this.currentPlaybackMode.set(mode);
    this.queueLength.set(frequencies.length);

    if (mode === 'sequential') {
      this.sessionQueue = [...frequencies];
      this.sessionQueueIndex = 0;
      this.queuePosition.set(1);
      this.startSessionTrack();
      return;
    }

    this.currentFrequencyIds.set(frequencies.map((frequency) => frequency.id));
    this.queuePosition.set(0);
    this.playingLabel.set(frequencies.map((f) => f.name || f.title || 'Frequência').join(' + '));
    const volumeScale = 1 / Math.sqrt(frequencies.length);
    frequencies.forEach((frequency) => this.startFrequency(frequency, this.frequencySeconds(frequency), volumeScale));

    const durationInSeconds = Math.max(
      ...frequencies.map((frequency) => this.frequencySeconds(frequency)),
      durationMinutes > 0 ? 0 : 30 * 60,
    );
    this.startTimer(durationInSeconds);
  }

  private startSessionTrack() {
    const frequency = this.sessionQueue[this.sessionQueueIndex];
    if (!frequency) {
      this.stop();
      return;
    }

    this.currentFrequencyIds.set([frequency.id]);
    this.playingLabel.set(frequency.name || frequency.title || 'Frequência');
    this.startFrequency(frequency);
    this.startTimer(this.frequencySeconds(frequency));
  }

  private advanceSessionTrack() {
    this.stopActiveNodes();
    this.sessionQueueIndex += 1;
    this.queuePosition.set(this.sessionQueueIndex + 1);
    this.startSessionTrack();
  }

  private startFrequency(frequency: Frequency, durationSeconds?: number, volumeScale = 1) {
    const soundType = frequency.kind || frequency.type || frequency.category || 'Tom';
    this.startTone(frequency.hz, soundType, frequency.beatHz || 0, durationSeconds, volumeScale);
  }

  private frequencySeconds(frequency: Frequency): number {
    return (frequencyDurationMinutes(frequency) || 30) * 60;
  }

  private startTone(hz: number, type: string, beatHz = 0, durationSeconds?: number, volumeScale = 1) {
    if (!this.audioCtx) return;

    const masterGain = this.audioCtx.createGain();
    const effectiveVolume = this.isMuted() ? 0 : this.volume();
    masterGain.gain.setValueAtTime(effectiveVolume * 0.2 * volumeScale, this.audioCtx.currentTime);
    masterGain.connect(this.audioCtx.destination);

    const normalizedType = type.toLowerCase();
    const isBinaural = normalizedType.includes('binaural');
    const isNoise = normalizedType.includes('ruído') || normalizedType.includes('ruido') || normalizedType === 'noise';

    if (isBinaural) {
      const merger = this.audioCtx.createChannelMerger(2);
      merger.connect(masterGain);
      const left = this.audioCtx.createOscillator();
      const right = this.audioCtx.createOscillator();
      left.type = 'sine';
      right.type = 'sine';
      left.frequency.setValueAtTime(hz || 440, this.audioCtx.currentTime);
      right.frequency.setValueAtTime((hz || 440) + beatHz, this.audioCtx.currentTime);
      left.connect(merger, 0, 0);
      right.connect(merger, 0, 1);
      left.start();
      right.start();
      this.registerActiveNodes([left, right], masterGain, durationSeconds, volumeScale);
    } else if (isNoise) {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(hz || 1000, this.audioCtx.sampleRate / 2), this.audioCtx.currentTime);
      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      this.registerActiveNodes([whiteNoise], masterGain, durationSeconds, volumeScale);
    } else {
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz || 440, this.audioCtx.currentTime);
      osc.connect(masterGain);
      osc.start();

      this.registerActiveNodes([osc], masterGain, durationSeconds, volumeScale);
    }
  }

  private registerActiveNodes(
    sources: AudioScheduledSourceNode[],
    gain: GainNode,
    durationSeconds?: number,
    volumeScale = 1,
  ) {
    if (durationSeconds && this.audioCtx) {
      const stopAt = this.audioCtx.currentTime + durationSeconds;
      sources.forEach((source) => source.stop(stopAt));
    }
    this.activeNodes.push({ sources, gain, volumeScale });
  }

  public setVolume(val: number) {
    const volume = Math.max(0, Math.min(1, val));
    this.volume.set(volume);
    this.activeNodes.forEach((node) => {
      if (node.gain && this.audioCtx) {
        const effectiveVolume = this.isMuted() ? 0 : volume;
        node.gain.gain.setTargetAtTime(effectiveVolume * 0.2 * node.volumeScale, this.audioCtx.currentTime, 0.03);
      }
    });
  }

  public pause() {
    if (!this.playing() || this.paused()) return;
    this.paused.set(true);
    this.stopTimer();
    void this.audioCtx?.suspend();
  }

  public resume() {
    if (!this.playing() || !this.paused()) return;
    this.paused.set(false);
    void this.audioCtx?.resume();
    this.startTimer(this.remainingSeconds(), false);
  }

  public toggleMute() {
    const nextState = !this.isMuted();
    this.isMuted.set(nextState);
    this.setVolume(this.volume());
  }

  private startTimer(seconds: number, resetDuration = true) {
    this.stopTimer();
    this.remainingSeconds.set(seconds);
    if (resetDuration) this.durationSeconds.set(seconds);

    this.timerInterval = setInterval(() => {
      const current = this.remainingSeconds();
      if (current <= 1) {
        if (this.currentPlaybackMode() === 'sequential' && this.sessionQueueIndex < this.sessionQueue.length - 1) {
          this.advanceSessionTrack();
        } else {
          this.stop();
        }
      } else {
        this.remainingSeconds.set(current - 1);
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public stop() {
    this.stopTimer();
    this.stopActiveNodes();
    this.sessionQueue = [];
    this.sessionQueueIndex = 0;
    this.playing.set(false);
    this.paused.set(false);
    this.previewingId.set(null);
    this.currentFrequencyIds.set([]);
    this.currentPresetId.set(null);
    this.currentPlaybackMode.set('sequential');
    this.queueLength.set(0);
    this.queuePosition.set(0);
    this.remainingSeconds.set(0);
    this.durationSeconds.set(0);
  }

  private stopActiveNodes() {
    this.activeNodes.forEach((node) => {
      try {
        node.sources.forEach((source) => source.stop());
        node.gain.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }
}