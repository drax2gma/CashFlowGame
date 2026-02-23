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
    <label for="sfx-volume">
      <Translate key="settings.audio.sfxVolume" />
    </label>
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
  
  <div class="setting-group checkboxes">
    <ToggleSwitch 
      bind:checked={sfxEnabled}
      label="Enable Sound Effects"
    />
    
    <ToggleSwitch 
      bind:checked={uiSoundsEnabled}
      label="Enable UI Sounds"
    />
  </div>
  
  <div class="test-buttons">
    <button on:click={testSfx} class="test-button">
      <Translate key="settings.audio.testSfx" />
    </button>
    
    <button on:click={testUiClick} class="test-button">
      Test UI Click
    </button>
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

  .checkboxes {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .test-buttons {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }

  .test-button {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--primary);
    color: var(--on-primary);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s ease;
  }

  .test-button:hover {
    background-color: #1565C0;
  }

  @media (max-width: 480px) {
    .test-buttons {
      flex-direction: column;
    }
    
    .test-button {
      width: 100%;
    }
  }
</style>