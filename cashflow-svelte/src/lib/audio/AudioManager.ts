export class AudioManager {
  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;
  private settingsLoaded: boolean = false;
  
  // Audio settings
  private masterVolume: number = 0.75;
  private musicVolume: number = 0.0; // Disabled by default for now
  private sfxVolume: number = 0.8;
  private musicEnabled: boolean = false;
  private sfxEnabled: boolean = true;
  private uiSoundsEnabled: boolean = true; // UI click sounds enabled by default
  
  private readonly STORAGE_KEY = 'cashflow-audio-settings';
  
  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.init();
    }
  }
  
  private ensureSettingsLoaded() {
    if (!this.settingsLoaded && typeof window !== 'undefined') {
      this.loadSettings();
      this.settingsLoaded = true;
    }
  }
  
  private loadSettings() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        this.masterVolume = settings.masterVolume ?? this.masterVolume;
        this.musicVolume = settings.musicVolume ?? this.musicVolume;
        this.sfxVolume = settings.sfxVolume ?? this.sfxVolume;
        this.musicEnabled = settings.musicEnabled ?? this.musicEnabled;
        this.sfxEnabled = settings.sfxEnabled ?? this.sfxEnabled;
        this.uiSoundsEnabled = settings.uiSoundsEnabled ?? this.uiSoundsEnabled;
      }
    } catch (e) {
      console.warn('Failed to load audio settings:', e);
    }
  }
  
  private saveSettings() {
    try {
      const settings = {
        masterVolume: this.masterVolume,
        musicVolume: this.musicVolume,
        sfxVolume: this.sfxVolume,
        musicEnabled: this.musicEnabled,
        sfxEnabled: this.sfxEnabled,
        uiSoundsEnabled: this.uiSoundsEnabled
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save audio settings:', e);
    }
  }
  
  private async init() {
    try {
      // Check if window is available (browser environment)
      if (typeof window === 'undefined') {
        return;
      }
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }
  
  public playSfx(sound: string, volume: number = this.sfxVolume) {
    if (!this.isInitialized || !this.sfxEnabled || !this.audioContext) return;
    
    if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
    }
    
    const v = volume * this.masterVolume;
    
    switch (sound) {
      case 'card-flip':
        this.playSweep(1200, 200, 0.05, 'sine', v * 0.5);
        break;
      case 'card-deal':
        this.playNoise(0.08, v * 0.4, 2000, 500);
        break;
      case 'dice-roll':
        this.playDiceRoll(v * 0.7);
        break;
      case 'cash-receive':
        this.playCoin(v * 0.6);
        break;
      case 'success':
        this.playSuccess(v * 0.7);
        break;
      case 'error':
        this.playSweep(150, 80, 0.3, 'sawtooth', v * 0.7);
        break;
      case 'turn-start':
        this.playSweep(880, 880, 0.6, 'sine', v * 0.5, true);
        break;
      case 'ui-click':
        this.playClick(v * 0.4);
        break;
      default:
        this.playSweep(440, 440, 0.1, 'sine', v * 0.5);
    }
  }
  
  // Play UI click sound (public method for global use)
  public playUiClick() {
    this.ensureSettingsLoaded();
    if (!this.isInitialized || !this.uiSoundsEnabled || !this.audioContext) return;
    this.playClick(this.sfxVolume * this.masterVolume * 0.4);
  }
  
  private playSweep(startFreq: number, endFreq: number, duration: number, type: OscillatorType, volume: number, bellDecay: boolean = false) {
    if (!this.audioContext) return;
    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), t + duration);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.02);
    if (bellDecay) {
      gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
    } else {
      gain.gain.setValueAtTime(volume, t + duration * 0.8);
      gain.gain.linearRampToValueAtTime(0, t + duration);
    }
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.start(t);
    osc.stop(t + duration);
  }

  private playCoin(volume: number) {
    if (!this.audioContext) return;
    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.03);
    gain.gain.setValueAtTime(volume, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  private playSuccess(volume: number) {
    if (!this.audioContext) return;
    const t = this.audioContext.currentTime;
    
    [523.25, 659.25, 783.99].forEach((freq, i) => { // C5, E5, G5
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.1);
      
      gain.gain.setValueAtTime(0, t + i * 0.1);
      gain.gain.linearRampToValueAtTime(volume * 0.6, t + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.5);
      
      osc.connect(gain);
      gain.connect(this.audioContext!.destination);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.5);
    });
  }

  private playNoise(duration: number, volume: number, freqStart: number, freqEnd: number) {
    if (!this.audioContext) return;
    const t = this.audioContext.currentTime;
    
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freqStart, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t + duration);
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);
    
    noise.start(t);
  }

  private playDiceRoll(volume: number) {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.playSweep(800 + Math.random() * 400, 100, 0.05, 'triangle', volume * 0.7);
        this.playNoise(0.03, volume * 0.5, 3000, 1000);
      }, i * 60 + Math.random() * 20);
    }
  }

  private playClick(volume: number) {
    if (!this.audioContext) return;
    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.03);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.start(t);
    osc.stop(t + 0.05);
  }
  
  public playMusic(track: string, volume: number = this.musicVolume) {
     // No background music implemented currently
  }
  
  public stopAll() {
    if (this.audioContext) this.audioContext.suspend();
  }
  
  public resume() {
    if (this.audioContext) this.audioContext.resume();
  }
  
  // Setters - update values without saving (call save() to persist)
  public setMasterVolume(v: number) { this.masterVolume = Math.max(0, Math.min(1, v)); }
  public setMusicVolume(v: number) { this.musicVolume = Math.max(0, Math.min(1, v)); }
  public setSfxVolume(v: number) { this.ensureSettingsLoaded(); this.sfxVolume = Math.max(0, Math.min(1, v)); }
  public setMusicEnabled(e: boolean) { this.ensureSettingsLoaded(); this.musicEnabled = e; }
  public setSfxEnabled(e: boolean) { this.ensureSettingsLoaded(); this.sfxEnabled = e; }
  public setUiSoundsEnabled(e: boolean) { this.ensureSettingsLoaded(); this.uiSoundsEnabled = e; }
  
  // Legacy toggle methods (for backwards compatibility - these do save)
  public toggleMusic(e: boolean) { this.setMusicEnabled(e); this.saveSettings(); }
  public toggleSfx(e: boolean) { this.setSfxEnabled(e); this.saveSettings(); }
  public toggleUiSounds(e: boolean) { this.setUiSoundsEnabled(e); this.saveSettings(); }
  
  // Save current settings to localStorage
  public save() {
    this.saveSettings();
  }
  
  // Getters
  public isUiSoundsEnabled(): boolean { this.ensureSettingsLoaded(); return this.uiSoundsEnabled; }
  public isSfxEnabled(): boolean { this.ensureSettingsLoaded(); return this.sfxEnabled; }
  public getSfxVolume(): number { this.ensureSettingsLoaded(); return this.sfxVolume; }
}

export const audioManager = new AudioManager();