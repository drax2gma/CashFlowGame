<script lang="ts">
  import { onMount } from 'svelte';
  
  // Props
  export let tabs = [];
  export let activeTab = 0;
  export let variant: 'primary' | 'secondary' = 'primary';
  
  // Handle tab change
  function handleTabChange(index: number) {
    activeTab = index;
  }
</script>

<div class="tabs">
  <div class="tab-list" role="tablist">
    {#each tabs as tab, index}
      <button
        class="tab-button"
        class:primary={variant === 'primary'}
        class:secondary={variant === 'secondary'}
        class:active={index === activeTab}
        role="tab"
        aria-selected={index === activeTab}
        aria-controls={`panel-${index}`}
        on:click={() => handleTabChange(index)}
      >
        {tab.label}
      </button>
    {/each}
  </div>
  
  <div class="tab-panels">
    {#each tabs as tab, index}
      <div
        id={`panel-${index}`}
        class="tab-panel"
        role="tabpanel"
        aria-hidden={index !== activeTab}
        class:active={index === activeTab}
      >
        {#if index === activeTab}
          <svelte:component this={tab.component} {...tab.props} />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: column;
  }
  
  .tab-list {
    display: flex;
    border-bottom: 1px solid var(--outline);
  }
  
  .tab-button {
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    background: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .tab-button.primary {
    color: #666;
  }
  
  .tab-button.primary.active {
    color: var(--primary);
    border-bottom: 2px solid var(--primary);
  }
  
  .tab-button.secondary {
    color: var(--on-surface);
    background-color: #f5f5f5;
  }
  
  .tab-button.secondary.active {
    background-color: var(--primary);
    color: var(--on-primary);
  }
  
  .tab-button:hover:not(.active) {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .tab-panel {
    display: none;
    padding: var(--spacing-lg) 0;
  }
  
  .tab-panel.active {
    display: block;
  }
</style>