<script lang="ts">
  export let title = '';
  export let description = '';
  export let icon = '🏆';
  export let unlocked = false;
  export let progress = 0; // Percentage (0-100)
  export let showProgress = false;
</script>

<div 
  class="achievement" 
  class:unlocked={unlocked}
  class:locked={!unlocked}
>
  <div class="achievement-icon">
    {icon}
  </div>
  
  <div class="achievement-content">
    <h4 class="achievement-title">{title}</h4>
    <p class="achievement-description">{description}</p>
    
    {#if showProgress && progress > 0}
      <div class="achievement-progress">
        <div class="progress-bar">
          <div class="progress-fill" style={`width: ${progress}%`}></div>
        </div>
        <span class="progress-text">{Math.round(progress)}%</span>
      </div>
    {/if}
  </div>
  
  <div class="achievement-status">
    {#if unlocked}
      <span class="unlocked-badge">Unlocked</span>
    {:else}
      <span class="locked-badge">Locked</span>
    {/if}
  </div>
</div>

<style>
  .achievement {
    display: flex;
    align-items: center;
    padding: var(--spacing-md);
    border-radius: 8px;
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
    transition: all 0.3s ease;
  }
  
  .achievement.unlocked {
    background-color: #e8f5e9;
    border-color: #c8e6c9;
  }
  
  .achievement.locked {
    opacity: 0.7;
  }
  
  .achievement-icon {
    font-size: 2rem;
    margin-right: var(--spacing-md);
  }
  
  .achievement-content {
    flex: 1;
  }
  
  .achievement-title {
    margin: 0 0 var(--spacing-xs) 0;
    color: var(--on-surface);
  }
  
  .achievement-description {
    margin: 0 0 var(--spacing-sm) 0;
    color: #666;
    font-size: var(--font-size-small);
  }
  
  .achievement-status {
    display: flex;
    align-items: center;
  }
  
  .unlocked-badge {
    background-color: var(--success);
    color: var(--on-success);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 4px;
    font-size: var(--font-size-small);
    font-weight: 600;
  }
  
  .locked-badge {
    background-color: #9e9e9e;
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 4px;
    font-size: var(--font-size-small);
    font-weight: 600;
  }
  
  .achievement-progress {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .progress-bar {
    flex: 1;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: var(--primary);
    border-radius: 3px;
  }
  
  .progress-text {
    font-size: var(--font-size-small);
    color: #666;
    min-width: 40px;
    text-align: right;
  }
</style>