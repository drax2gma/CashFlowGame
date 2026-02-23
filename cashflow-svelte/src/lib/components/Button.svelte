<script lang="ts">
  // Props
  export let variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'icon' = 'primary';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let disabled = false;
  export let fullWidth = false;
  export let icon = '';
</script>

<button 
  class="button" 
  class:primary={variant === 'primary'}
  class:secondary={variant === 'secondary'}
  class:success={variant === 'success'}
  class:warning={variant === 'warning'}
  class:danger={variant === 'danger'}
  class:icon={variant === 'icon'}
  class:small={size === 'small'}
  class:medium={size === 'medium'}
  class:large={size === 'large'}
  class:full-width={fullWidth}
  class:disabled={disabled}
  aria-disabled={disabled}
  {disabled}
  on:click
  on:focus
  on:blur
>
  {#if icon}
    <span class="button-icon">{icon}</span>
  {/if}
  <slot />
</button>

<style>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    user-select: none;
    white-space: nowrap;
  }
  
  .button:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  
  .button:disabled,
  .button.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  /* Variants */
  .button.primary {
    background-color: var(--primary);
    color: var(--on-primary);
  }
  
  .button.primary:hover:not(:disabled) {
    background-color: #1565C0;
  }
  
  .button.secondary {
    background-color: var(--secondary);
    color: var(--on-secondary);
  }
  
  .button.secondary:hover:not(:disabled) {
    background-color: #303030;
  }
  
  .button.success {
    background-color: var(--success);
    color: var(--on-success);
  }
  
  .button.success:hover:not(:disabled) {
    background-color: #45a049;
  }
  
  .button.warning {
    background-color: var(--warning);
    color: var(--on-warning);
  }
  
  .button.warning:hover:not(:disabled) {
    background-color: #e6ac00;
  }
  
  .button.danger {
    background-color: var(--error);
    color: var(--on-error);
  }
  
  .button.danger:hover:not(:disabled) {
    background-color: #d32f2f;
  }
  
  .button.icon {
    background-color: transparent;
    color: var(--on-background);
  }
  
  .button.icon:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  /* Sizes */
  .button.small {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-small);
  }
  
  .button.medium {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-medium);
  }
  
  .button.large {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-large);
  }
  
  /* Full width */
  .button.full-width {
    width: 100%;
  }
  
  /* Icon */
  .button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>