<script lang="ts">
  import AudioSettings from '$lib/components/AudioSettings.svelte';
  import LanguageSelector from '$lib/components/LanguageSelector.svelte';
  import Translate from '$lib/components/Translate.svelte';
  import Button from '$lib/components/Button.svelte';
  import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
  import { goto } from '$app/navigation';
  import { settingsStore } from '$lib/stores/settingsStore';
  
  let audioSettings: AudioSettings;
  let saveMessage = '';
  
  // Tooltip settings from store
  let tooltipsEnabled = true;
  let tooltipDelay = 500;
  
  // Subscribe to store changes
  $: tooltipsEnabled = $settingsStore.tooltipsEnabled;
  $: tooltipDelay = $settingsStore.tooltipDelay;
  
  // Update store when settings change
  $: if (tooltipsEnabled !== $settingsStore.tooltipsEnabled) {
    settingsStore.update((s: import('$lib/stores/settingsStore').UserSettings) => ({ ...s, tooltipsEnabled }));
  }
  
  function handleTooltipDelayChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const delay = parseInt(target.value, 10);
    settingsStore.update((s: import('$lib/stores/settingsStore').UserSettings) => ({ ...s, tooltipDelay: delay }));
  }
  
  async function handleSave() {
    if (audioSettings) {
      audioSettings.save();
      saveMessage = 'Settings saved!';
      setTimeout(() => {
        saveMessage = '';
      }, 2000);
    }
  }
  
  function handleCancel() {
    if (audioSettings) {
      audioSettings.reset();
    }
    goto('/dashboard');
  }
</script>

<div class="settings-page">
  <header class="header">
    <h1><Translate key="navigation.settings" /></h1>
  </header>

  <main class="main-content">
    <div class="settings-section">
      <h2><Translate key="settings.language" /></h2>
      <LanguageSelector />
    </div>

    <div class="settings-section">
      <AudioSettings bind:this={audioSettings} />
    </div>

    <div class="settings-section">
      <h2><Translate key="settings.tooltips.title" /></h2>
      
      <div class="setting-group checkboxes">
        <ToggleSwitch 
          bind:checked={tooltipsEnabled}
          label="Enable Tooltips"
        />
      </div>
      
      {#if tooltipsEnabled}
        <div class="setting-group">
          <label for="tooltip-delay">
            <Translate key="settings.tooltips.delay" />
          </label>
          <div class="slider-container">
            <input 
              type="range" 
              id="tooltip-delay"
              min="100" 
              max="2000" 
              step="100" 
              value={tooltipDelay}
              on:change={handleTooltipDelayChange}
            />
            <span class="delay-value">{tooltipDelay}ms</span>
          </div>
        </div>
      {/if}
    </div>

    <div class="settings-actions">
      {#if saveMessage}
        <p class="save-message">{saveMessage}</p>
      {/if}
      <div class="button-row">
        <Button variant="secondary" on:click={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" on:click={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  </main>
</div>

<style>
  .settings-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--background);
    color: var(--on-background);
    font-family: var(--font-family);
  }

  .header {
    background-color: var(--primary);
    color: var(--on-primary);
    padding: var(--spacing-lg);
    text-align: center;
  }

  .main-content {
    flex: 1;
    padding: var(--spacing-lg);
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }

  .settings-section {
    margin-bottom: var(--spacing-xl);
  }

  .settings-section h2 {
    border-bottom: 1px solid var(--outline);
    padding-bottom: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .setting-group {
    margin-bottom: var(--spacing-md);
  }

  .setting-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .slider-container input[type="range"] {
    flex: 1;
  }

  .delay-value {
    min-width: 60px;
    text-align: right;
    font-family: monospace;
  }

  .checkboxes {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .settings-actions {
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--outline);
  }

  .save-message {
    color: var(--success);
    font-weight: 600;
    text-align: center;
    margin-bottom: var(--spacing-md);
  }

  .button-row {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
  }

  @media (max-width: 480px) {
    .main-content {
      padding: var(--spacing-md);
    }
    
    .button-row {
      flex-direction: column;
    }
  }
</style>