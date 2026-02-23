<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Translate from '$lib/components/Translate.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { DreamConfig } from '$lib/data/dreams';
  import { dreamConfigs, getAffordableDreams } from '$lib/data/dreams';
  import type { Player } from '$lib/stores/gameStore';

  export let show: boolean = false;
  export let player: Player | null = null;
  export let onSelect: (dream: DreamConfig) => void = () => {};

  let selectedDream: DreamConfig | null = null;
  let currentPage = 0;
  const dreamsPerPage = 3;

  const dispatch = createEventDispatcher();

  $: affordableDreams = player ? getAffordableDreams(player.cash) : [];
  $: totalPages = Math.ceil(affordableDreams.length / dreamsPerPage);
  $: currentDreams = affordableDreams.slice(currentPage * dreamsPerPage, (currentPage + 1) * dreamsPerPage);

  function handleSelect(dream: DreamConfig) {
    selectedDream = dream;
    onSelect(dream);
    dispatch('select', dream);
  }

  function handleClose() {
    dispatch('close');
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
    }
  }

  function handlePurchase() {
    if (selectedDream) {
      dispatch('purchase', selectedDream);
    }
  }
</script>

{#if show && player}
  <div class="modal-overlay" on:click={handleClose}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>🌟 Choose Your Dream</h2>
        <button class="close-btn" on:click={handleClose}>✕</button>
      </div>
      
      <div class="modal-body">
        <div class="dream-intro">
          <p class="intro-message">
            Congratulations! You've entered the Fast Track!
          </p>
          <p class="intro-submessage">
            Select the dream that will fulfill your ultimate goals.
          </p>
        </div>
        
        <div class="dream-gallery">
          {#if currentDreams.length > 0}
            <div class="dream-cards">
              {#each currentDreams as dream}
                <div 
                  class="dream-card" 
                  class:selected={selectedDream?.id === dream.id}
                  on:click={() => selectedDream = dream}
                >
                  <div class="dream-icon">
                    {#if dream.id === 'villa'}
                      🏡
                    {:else if dream.id === 'yacht'}
                      ⛵
                    {:else if dream.id === 'private-jet'}
                      ✈️
                    {:else if dream.id === 'race-car'}
                      🏎️
                    {:else if dream.id === 'art-collection'}
                      🎨
                    {:else if dream.id === 'winery'}
                      🍷
                    {:else if dream.id === 'island-resort'}
                      🏝️
                    {:else if dream.id === 'tech-company'}
                      💻
                    {:else if dream.id === 'charity-foundation'}
                      ❤️
                    {:else if dream.id === 'sports-team'}
                      🏟️
                    {:else}
                      🌟
                    {/if}
                  </div>
                  <div class="dream-info">
                    <h3 class="dream-name">{dream.name}</h3>
                    <p class="dream-description">{dream.description}</p>
                    <p class="dream-cost">${dream.cost.toLocaleString()}</p>
                    {#if dream.perk}
                      <p class="dream-perk">✨ {dream.perk}</p>
                    {/if}
                  </div>
                  <div class="dream-select">
                    {#if selectedDream?.id === dream.id}
                      <span class="selected-indicator">✓ Selected</span>
                    {:else}
                      <Button 
                        on:click={() => handleSelect(dream)} 
                        variant="secondary" 
                        size="small"
                      >
                        Select
                      </Button>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
            
            {#if totalPages > 1}
              <div class="pagination">
                <button 
                  class="pagination-btn" 
                  on:click={prevPage} 
                  disabled={currentPage === 0}
                >
                  ← Prev
                </button>
                <span class="page-info">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button 
                  class="pagination-btn" 
                  on:click={nextPage} 
                  disabled={currentPage === totalPages - 1}
                >
                  Next →
                </button>
              </div>
            {/if}
          {:else}
            <div class="no-dreams">
              <p>No dreams are currently affordable with your cash.</p>
              <p>Continue playing to accumulate more wealth!</p>
            </div>
          {/if}
        </div>
        
        {#if selectedDream}
          <div class="selected-dream-summary">
            <h3>Your Selected Dream</h3>
            <div class="summary-content">
              <div class="summary-info">
                <span class="summary-name">{selectedDream.name}</span>
                <span class="summary-cost">${selectedDream.cost.toLocaleString()}</span>
              </div>
              <Button 
                on:click={handlePurchase} 
                variant="success"
                disabled={player.cash < selectedDream.cost}
              >
                Purchase Dream
              </Button>
            </div>
            {#if player.cash < selectedDream.cost}
              <p class="insufficient-funds">
                ⚠️ You need ${(selectedDream.cost - player.cash).toLocaleString()} more to purchase this dream.
              </p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background: var(--surface);
    border-radius: 16px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 16px 16px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .modal-body {
    padding: 2rem;
  }

  .dream-intro {
    text-align: center;
    margin-bottom: 2rem;
  }

  .intro-message {
    font-size: 1.4rem;
    font-weight: bold;
    color: var(--primary);
    margin: 0 0 0.5rem 0;
  }

  .intro-submessage {
    color: var(--on-surface);
    margin: 0;
  }

  .dream-gallery {
    margin-bottom: 2rem;
  }

  .dream-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .dream-card {
    background: var(--background);
    border: 2px solid var(--outline);
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .dream-card:hover {
    border-color: #9c27b0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2);
  }

  .dream-card.selected {
    border-color: #9c27b0;
    background: #f3e5f5;
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
  }

  .dream-icon {
    font-size: 3rem;
    text-align: center;
  }

  .dream-info {
    flex: 1;
  }

  .dream-name {
    font-size: 1.3rem;
    font-weight: bold;
    color: var(--on-surface);
    margin: 0 0 0.5rem 0;
  }

  .dream-description {
    color: var(--on-surface);
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
  }

  .dream-cost {
    font-weight: bold;
    color: var(--primary);
    font-size: 1.1rem;
    margin: 0 0 0.5rem 0;
  }

  .dream-perk {
    color: #4caf50;
    font-weight: 600;
    margin: 0;
  }

  .dream-select {
    display: flex;
    justify-content: flex-end;
  }

  .selected-indicator {
    background: #4caf50;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .pagination-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .pagination-btn:hover:not(:disabled) {
    background: #7b1fa2;
  }

  .pagination-btn:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
  }

  .page-info {
    font-weight: 600;
    color: var(--on-surface);
  }

  .no-dreams {
    text-align: center;
    padding: 2rem;
    color: var(--on-surface);
  }

  .selected-dream-summary {
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
    border-radius: 12px;
    padding: 1.5rem;
    border: 2px solid #9c27b0;
  }

  .selected-dream-summary h3 {
    margin: 0 0 1rem 0;
    color: #7b1fa2;
    text-align: center;
  }

  .summary-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .summary-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .summary-name {
    font-weight: bold;
    font-size: 1.2rem;
    color: var(--on-surface);
  }

  .summary-cost {
    font-weight: bold;
    color: var(--primary);
    font-size: 1.1rem;
  }

  .insufficient-funds {
    text-align: center;
    color: var(--error);
    font-weight: 600;
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    .modal-content {
      width: 95%;
    }
    
    .modal-header h2 {
      font-size: 1.5rem;
    }
    
    .summary-content {
      flex-direction: column;
      align-items: stretch;
    }
    
    .summary-content button {
      width: 100%;
    }
  }
</style>