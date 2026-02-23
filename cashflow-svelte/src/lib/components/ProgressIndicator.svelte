<script lang="ts">
  export let progress = 0; // Percentage (0-100)
  export let label = '';
  export let showPercentage = true;
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let color: 'primary' | 'success' | 'warning' | 'error' = 'primary';
</script>

<div class="progress-container">
  {#if label}
    <div class="progress-label">{label}</div>
  {/if}
  
  <div 
    class="progress-bar" 
    class:small={size === 'small'}
    class:large={size === 'large'}
    class:primary={color === 'primary'}
    class:success={color === 'success'}
    class:warning={color === 'warning'}
    class:error={color === 'error'}
  >
    <div 
      class="progress-fill" 
      style={`width: ${Math.min(100, Math.max(0, progress))}%`}
    ></div>
  </div>
  
  {#if showPercentage}
    <div class="progress-percentage">{Math.round(progress)}%</div>
  {/if}
</div>

<style>
  .progress-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .progress-label {
    font-weight: 500;
    color: var(--on-surface);
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  
  .progress-bar.small {
    height: 4px;
  }
  
  .progress-bar.large {
    height: 12px;
  }
  
  .progress-fill {
    height: 100%;
    background-color: var(--primary);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .progress-bar.success .progress-fill {
    background-color: var(--success);
  }
  
  .progress-bar.warning .progress-fill {
    background-color: var(--warning);
  }
  
  .progress-bar.error .progress-fill {
    background-color: var(--error);
  }
  
  .progress-percentage {
    text-align: right;
    font-size: var(--font-size-small);
    color: #666;
  }
</style>