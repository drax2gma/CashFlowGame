<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { audioManager } from '../audio/AudioManager';
  import Translate from './Translate.svelte';
  import ToggleSwitch from './ToggleSwitch.svelte';
  
  // Initialize directly from AudioManager (which loads from localStorage)
  let sfxVolume = audioManager.getSfxVolume();
  let sfxEnabled = audioManager.isSfxEnabled();
  let uiSoundsEnabled = audioManager.isUiSoundsEnabled();
  
  const dispatch = createEventDispatcher();

  // Expose save method for parent component
  export function save() {
    audioManager.setSfxVolume(sfxVolume);
    audioManager.setSfxEnabled(sfxEnabled);
    audioManager.setUiSoundsEnabled(uiSoundsEnabled);
    audioManager.save();
    dispatch('saved');
  }
  
  // Expose reset method to reload from storage
  export function reset() {
    sfxVolume = audioManager.getSfxVolume();
    sfxEnabled = audioManager.isSfxEnabled();
    uiSoundsEnabled = audioManager.isUiSoundsEnabled();
  }

  function testSfx() {
    audioManager.playSfx('card-flip');
  }
  
  function testUiClick() {
    // Temporarily enable UI sounds to test, then restore state
    const wasEnabled = audioManager.isUiSoundsEnabled();
    audioManager.setUiSoundsEnabled(true);
    audioManager.playUiClick();
    audioManager.setUiSoundsEnabled(wasEnabled);
  }
</script>

<div class="audio-settings">
  <h2><Translate key="settings.audio.title" /></h2>
  
  <div class="setting-group">
    <label for="sfx-volume">Volume</label>
    <div class="slider-container">
      <input 
        type="range" 
        id="sfx-volume"
        min="0" 
        max="1" 
        step="0.01" 
        bind:value={sfxVolume}
      />
      <span class="volume-value">{Math.round(sfxVolume * 100)}%</span>
    </div>
  </div>
  
  <div class="setting-group">
    <div class="toggle-row">
      <ToggleSwitch 
        bind:checked={sfxEnabled}
        label="Sound Effects"
      />
      <button on:click={testSfx} class="test-button" disabled={!sfxEnabled}>
        Test
      </button>
    </div>
    
    <div class="toggle-row">
      <ToggleSwitch 
        bind:checked={uiSoundsEnabled}
        label="UI Sounds"
      />
      <button on:click={testUiClick} class="test-button" disabled={!uiSoundsEnabled}>
        Test
      </button>
    </div>
  </div>
</div>

<style>
  .audio-settings {
    background-color: var(--surface);
    border-radius: 8px;
    padding: var(--spacing-lg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: var(--spacing-lg) auto;
  }

  .setting-group {
    margin-bottom: var(--spacing-lg);
  }

  .setting-group label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 600;
    color: var(--on-surface);
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .slider-container input[type="range"] {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  }

  .slider-container input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
  }

  .slider-container input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
  }

  .volume-value {
    min-width: 40px;
    text-align: right;
    font-weight: 600;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) 0;
  }

  .toggle-row + .toggle-row {
    border-top: 1px solid var(--outline);
    padding-top: var(--spacing-md);
    margin-top: var(--spacing-sm);
  }

  .test-button {
    padding: var(--spacing-xs) var(--spacing-md);
    background-color: var(--primary);
    color: var(--on-primary);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: var(--font-size-small);
    font-weight: 500;
    transition: background-color 0.2s ease, opacity 0.2s ease;
    min-width: 60px;
  }

  .test-button:hover:not(:disabled) {
    background-color: #1565C0;
  }

  .test-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    .toggle-row {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-sm);
    }
    
    .test-button {
      align-self: flex-end;
    }
  }
</style>