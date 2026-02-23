<script lang="ts">

  
  // Props
  export let checked = false;
  export let disabled = false;
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let label = '';
  export let labelPosition: 'left' | 'right' = 'right';
  

  
  // Handle toggle
  function handleToggle() {
    if (!disabled) {
      checked = !checked;
    }
  }
</script>

<div class="toggle-container" class:disabled={disabled}>
  {#if label && labelPosition === 'left'}
    <span class="toggle-label">{label}</span>
  {/if}
  
  <div 
    class="toggle-switch" 
    class:small={size === 'small'}
    class:large={size === 'large'}
    class:checked={checked}
    class:disabled={disabled}
    on:click={handleToggle}
    role="switch"
    aria-checked={checked}
    aria-disabled={disabled}
    tabindex={disabled ? -1 : 0}
    on:keydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    }}
  >
    <div class="toggle-track">
      <div class="toggle-thumb"></div>
    </div>
  </div>
  
  {#if label && labelPosition === 'right'}
    <span class="toggle-label">{label}</span>
  {/if}
</div>

<style>
  .toggle-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .toggle-container.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;
    cursor: pointer;
  }
  
  .toggle-switch.small {
    width: 32px;
    height: 20px;
  }
  
  .toggle-switch.large {
    width: 48px;
    height: 28px;
  }
  
  .toggle-switch.disabled {
    cursor: not-allowed;
  }
  
  .toggle-track {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ccc;
    border-radius: 12px;
    transition: background-color 0.3s ease;
  }
  
  .toggle-switch.small .toggle-track {
    border-radius: 10px;
  }
  
  .toggle-switch.large .toggle-track {
    border-radius: 14px;
  }
  
  .toggle-track::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    background-color: white;
    border-radius: 10px;
    transition: transform 0.3s ease;
  }
  
  .toggle-switch.small .toggle-track::before {
    border-radius: 8px;
  }
  
  .toggle-switch.large .toggle-track::before {
    border-radius: 12px;
  }
  
  .toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .toggle-switch.small .toggle-thumb {
    width: 14px;
    height: 14px;
    top: 3px;
    left: 3px;
  }
  
  .toggle-switch.large .toggle-thumb {
    width: 22px;
    height: 22px;
    top: 3px;
    left: 3px;
  }
  
  .toggle-switch.checked .toggle-track {
    background-color: var(--primary);
  }
  
  .toggle-switch.checked .toggle-thumb {
    transform: translateX(16px);
  }
  
  .toggle-switch.small.checked .toggle-thumb {
    transform: translateX(12px);
  }
  
  .toggle-switch.large.checked .toggle-thumb {
    transform: translateX(20px);
  }
  
  .toggle-label {
    user-select: none;
  }
</style>