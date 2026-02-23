<script lang="ts">
  import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
  import Button from './Button.svelte';
  
  // Props
  export let open = false;
  export let title = '';
  export let closable = true;
  export let closeOnEscape = true;
  export let closeOnOutsideClick = true;
  export let size: 'small' | 'medium' | 'large' = 'medium';
  
  // Dispatch events
  const dispatch = createEventDispatcher();
  
  // Handle escape key
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && closeOnEscape) {
      closeModal();
    }
  }
  
  // Close modal
  function closeModal() {
    if (closable) {
      dispatch('close');
    }
  }
  
  // Handle outside click
  function handleOutsideClick(event: MouseEvent) {
    if (closeOnOutsideClick && event.target === event.currentTarget) {
      closeModal();
    }
  }
  
  // Add event listeners
  onMount(() => {
    if (closeOnEscape) {
      window.addEventListener('keydown', handleKeyDown);
    }
  });
  
  // Clean up event listeners
  afterUpdate(() => {
    if (!open && closeOnEscape) {
      window.removeEventListener('keydown', handleKeyDown);
    }
  });
</script>

{#if open}
  <div 
    class="modal-overlay" 
    on:click={handleOutsideClick}
    on:keydown={(e) => e.key === 'Escape' && handleOutsideClick(e)}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div 
      class="modal-content" 
      class:small={size === 'small'}
      class:medium={size === 'medium'}
      class:large={size === 'large'}
    >
      {#if title || closable}
        <div class="modal-header">
          {#if title}
            <h2 class="modal-title" id="modal-title">{title}</h2>
          {/if}
          
          {#if closable}
            <Button 
              variant="icon" 
              on:click={closeModal}
              aria-label="Close"
            >
              ×
            </Button>
          {/if}
        </div>
      {/if}
      
      <div class="modal-body">
        <slot />
      </div>
      
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: var(--spacing-md);
  }
  
  .modal-content {
    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .modal-content.small {
    width: 400px;
  }
  
  .modal-content.medium {
    width: 600px;
  }
  
  .modal-content.large {
    width: 800px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--outline);
  }
  
  .modal-title {
    margin: 0;
    font-size: var(--font-size-xl);
    color: var(--on-surface);
  }
  
  .modal-body {
    padding: var(--spacing-lg);
    flex: 1;
    overflow-y: auto;
  }
  
  .modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--outline);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
  }
  
  @media (max-width: 768px) {
    .modal-content.small,
    .modal-content.medium,
    .modal-content.large {
      width: 100%;
      max-width: 100%;
    }
    
    .modal-overlay {
      padding: var(--spacing-sm);
    }
  }
</style>