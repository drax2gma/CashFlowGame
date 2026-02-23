<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'primary';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let pill = false;
</script>

<span 
  class="badge" 
  class:primary={variant === 'primary'}
  class:secondary={variant === 'secondary'}
  class:success={variant === 'success'}
  class:warning={variant === 'warning'}
  class:error={variant === 'error'}
  class:info={variant === 'info'}
  class:small={size === 'small'}
  class:large={size === 'large'}
  class:pill={pill}
>
  <slot />
</span>

<style>
  .badge {
    display: inline-block;
    padding: 0.25em 0.75em;
    font-size: 0.75em;
    font-weight: 600;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.375rem;
  }
  
  .badge.pill {
    border-radius: 10rem;
    padding: 0.25em 1em;
  }
  
  .badge.small {
    font-size: 0.625em;
    padding: 0.125em 0.5em;
  }
  
  .badge.large {
    font-size: 0.875em;
    padding: 0.375em 1em;
  }
  
  .badge.primary {
    background-color: var(--primary);
    color: var(--on-primary);
  }
  
  .badge.secondary {
    background-color: var(--secondary);
    color: var(--on-secondary);
  }
  
  .badge.success {
    background-color: var(--success);
    color: var(--on-success);
  }
  
  .badge.warning {
    background-color: var(--warning);
    color: var(--on-warning);
  }
  
  .badge.error {
    background-color: var(--error);
    color: var(--on-error);
  }
  
  .badge.info {
    background-color: #2196f3;
    color: white;
  }
</style>