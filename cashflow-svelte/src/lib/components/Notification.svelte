<script lang="ts">
  import { onMount } from 'svelte';
  
  // Props
  export let message = '';
  export let type: 'info' | 'success' | 'warning' | 'error' = 'info';
  export let duration = 5000; // milliseconds
  export let dismissible = true;
  
  // State
  let visible = true;
  
  // Dismiss notification
  function dismiss() {
    visible = false;
  }
  
  // Auto-dismiss after duration
  onMount(() => {
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  });
</script>

{#if visible}
  <div 
    class="notification" 
    class:info={type === 'info'}
    class:success={type === 'success'}
    class:warning={type === 'warning'}
    class:error={type === 'error'}
    role="alert"
  >
    <div class="notification-content">
      <span class="notification-message">{message}</span>
      {#if dismissible}
        <button 
          class="notification-close" 
          on:click={dismiss}
          aria-label="Close notification"
        >
          ×
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .notification {
    position: fixed;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    max-width: 400px;
    border-radius: 4px;
    padding: var(--spacing-md);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  }
  
  .notification.info {
    background-color: #e3f2fd;
    color: #0d47a1;
    border-left: 4px solid #2196f3;
  }
  
  .notification.success {
    background-color: #e8f5e9;
    color: #1b5e20;
    border-left: 4px solid #4caf50;
  }
  
  .notification.warning {
    background-color: #fff8e1;
    color: #f57f17;
    border-left: 4px solid #ffc107;
  }
  
  .notification.error {
    background-color: #ffebee;
    color: #b71c1c;
    border-left: 4px solid #f44336;
  }
  
  .notification-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .notification-message {
    flex: 1;
    margin: 0;
  }
  
  .notification-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: inherit;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    .notification {
      top: var(--spacing-md);
      right: var(--spacing-md);
      left: var(--spacing-md);
      max-width: calc(100% - var(--spacing-md) * 2);
    }
  }
</style>