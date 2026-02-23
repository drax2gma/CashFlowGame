<script lang="ts">
  export let loading = false;
  export let message = 'Loading...';
  export let size: 'small' | 'medium' | 'large' = 'medium';
</script>

{#if loading}
  <div class="loading-overlay">
    <div class="loading-content">
      <div class={`spinner ${size}`}></div>
      <p class="loading-message">{message}</p>
    </div>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .loading-content {
    background-color: var(--surface);
    border-radius: 8px;
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid var(--primary);
    animation: spin 1s linear infinite;
  }
  
  .spinner.small {
    width: 20px;
    height: 20px;
  }
  
  .spinner.medium {
    width: 40px;
    height: 40px;
  }
  
  .spinner.large {
    width: 60px;
    height: 60px;
  }
  
  .loading-message {
    margin: 0;
    color: var(--on-surface);
    font-weight: 500;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>