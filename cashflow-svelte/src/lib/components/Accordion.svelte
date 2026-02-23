<script lang="ts">
  import { onMount } from 'svelte';
  
  // Props
  export let items = [];
  export let allowMultiple = false;
  export let allowNone = true;
  
  // State
  let openItems = new Set();
  
  // Toggle item
  function toggleItem(index: number) {
    if (openItems.has(index)) {
      // Close item
      openItems.delete(index);
    } else {
      // Open item
      if (!allowMultiple) {
        // Close all other items
        openItems.clear();
      }
      openItems.add(index);
    }
    
    // If no items can be open and we're closing the last one, prevent it
    if (!allowNone && openItems.size === 0 && openItems.has(index)) {
      openItems.add(index);
    }
  }
</script>

<div class="accordion">
  {#each items as item, index}
    <div class="accordion-item">
      <button
        class="accordion-header"
        on:click={() => toggleItem(index)}
        aria-expanded={openItems.has(index)}
        aria-controls={`accordion-content-${index}`}
      >
        <span class="accordion-title">{item.title}</span>
        <span class="accordion-icon">{openItems.has(index) ? '−' : '+'}</span>
      </button>
      
      <div
        id={`accordion-content-${index}`}
        class="accordion-content"
        class:open={openItems.has(index)}
        role="region"
        aria-hidden={!openItems.has(index)}
      >
        <div class="accordion-content-inner">
          {item.content}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .accordion {
    border: 1px solid var(--outline);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .accordion-item {
    border-bottom: 1px solid var(--outline);
  }
  
  .accordion-item:last-child {
    border-bottom: none;
  }
  
  .accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--spacing-md);
    background-color: var(--surface);
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: var(--on-surface);
    transition: background-color 0.3s ease;
  }
  
  .accordion-header:hover {
    background-color: #f5f5f5;
  }
  
  .accordion-icon {
    font-size: 1.5rem;
    line-height: 1;
  }
  
  .accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .accordion-content.open {
    max-height: 1000px; /* Adjust based on content */
  }
  
  .accordion-content-inner {
    padding: var(--spacing-md);
    background-color: #fafafa;
  }
</style>