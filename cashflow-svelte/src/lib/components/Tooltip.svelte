<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { settingsStore } from '../stores/settingsStore';
  import { _ } from '../i18n';
  
  // Props
  export let text = '';
  export let position: 'top' | 'right' | 'bottom' | 'left' = 'top';
  export let delay: number | undefined = undefined; // Use store value if not provided
  
  // State
  let showTooltip = false;
  let timeoutId: number;
  let triggerElement: HTMLElement;
  
  // Get actual delay to use (prop override or store value)
  $: actualDelay = delay ?? $settingsStore.tooltipDelay;
  
  // Get translated text (supports both direct text and translation keys)
  $: displayText = text.includes('.') ? $_(text) : text;
  
  // Show tooltip with delay (only if enabled in settings)
  function handleMouseEnter() {
    if (!$settingsStore.tooltipsEnabled) return;
    
    timeoutId = window.setTimeout(() => {
      showTooltip = true;
    }, actualDelay);
  }
  
  // Hide tooltip
  function handleMouseLeave() {
    clearTimeout(timeoutId);
    showTooltip = false;
  }
  
  // Clean up timeout
  onDestroy(() => {
    clearTimeout(timeoutId);
  });
</script>

<div 
  class="tooltip-trigger"
  bind:this={triggerElement}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:focus={handleMouseEnter}
  on:blur={handleMouseLeave}
  role="group"
>
  <slot />
  
  {#if showTooltip && displayText && $settingsStore.tooltipsEnabled}
    <div 
      class="tooltip" 
      class:top={position === 'top'}
      class:right={position === 'right'}
      class:bottom={position === 'bottom'}
      class:left={position === 'left'}
      role="tooltip"
    >
      <div class="tooltip-content">
        {displayText}
      </div>
    </div>
  {/if}
</div>

<style>
  .tooltip-trigger {
    display: inline-block;
    position: relative;
  }
  
  .tooltip {
    position: absolute;
    z-index: 1000;
    padding: var(--spacing-sm);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    font-size: var(--font-size-small);
    white-space: nowrap;
    pointer-events: none;
  }
  
  .tooltip.top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
  }
  
  .tooltip.right {
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    margin-left: 8px;
  }
  
  .tooltip.bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
  }
  
  .tooltip.left {
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    margin-right: 8px;
  }
  
  .tooltip-content {
    position: relative;
  }
  
  .tooltip.top::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
  
  .tooltip.right::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: transparent rgba(0, 0, 0, 0.8) transparent transparent;
  }
  
  .tooltip.bottom::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, 0.8) transparent;
  }
  
  .tooltip.left::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: transparent transparent transparent rgba(0, 0, 0, 0.8);
  }
</style>