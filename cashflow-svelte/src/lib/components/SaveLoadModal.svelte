<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Translate from './Translate.svelte';
  import { gameActions } from '$lib/stores/gameStore';

  export let mode: 'save' | 'load' = 'save';

  const dispatch = createEventDispatcher();

  let savedGames: Array<{ slot: number; savedAt: string; players: string[] }> = [];
  let selectedSlot: number | null = null;

  onMount(() => {
    loadSavedGames();
  });

  function loadSavedGames() {
    savedGames = gameActions.getSavedGames();
  }

  function formatDate(isoString: string): string {
    try {
      const date = new Date(isoString);
      return date.toLocaleString();
    } catch {
      return 'Unknown';
    }
  }

  function handleSlotClick(slot: number) {
    selectedSlot = slot;
  }

  function handleSave() {
    if (selectedSlot !== null) {
      const success = gameActions.saveGame(selectedSlot);
      if (success) {
        dispatch('saved', { slot: selectedSlot });
        loadSavedGames();
      }
    }
  }

  function handleLoad() {
    if (selectedSlot !== null) {
      const success = gameActions.loadGame(selectedSlot);
      if (success) {
        dispatch('loaded', { slot: selectedSlot });
      }
    }
  }

  function handleDelete(slot: number) {
    if (confirm('Are you sure you want to delete this save?')) {
      gameActions.deleteSavedGame(slot);
      loadSavedGames();
      if (selectedSlot === slot) {
        selectedSlot = null;
      }
    }
  }

  function handleClose() {
    dispatch('close');
  }

  function getSlotInfo(slot: number) {
    return savedGames.find(s => s.slot === slot);
  }
</script>

<div class="modal-overlay" on:click={handleClose}>
  <div class="modal-content" on:click|stopPropagation>
    <div class="modal-header">
      <h2>{mode === 'save' ? '💾 Save Game' : '📂 Load Game'}</h2>
      <button class="close-btn" on:click={handleClose}>✕</button>
    </div>
    
    <div class="modal-body">
      <div class="slots-container">
        {#each Array(5) as _, slot}
          {@const slotInfo = getSlotInfo(slot)}
          <button 
            class="slot-button" 
            class:selected={selectedSlot === slot}
            on:click={() => handleSlotClick(slot)}
          >
            <div class="slot-header">
              <span class="slot-number">Slot {slot + 1}</span>
              {#if slotInfo}
                <span class="slot-date">{formatDate(slotInfo.savedAt)}</span>
              {/if}
            </div>
            
            {#if slotInfo}
              <div class="slot-players">
                <span class="players-label">Players:</span>
                <span class="players-list">{slotInfo.players.join(', ')}</span>
              </div>
            {:else}
              <div class="slot-empty">Empty Slot</div>
            {/if}
            
            {#if slotInfo && mode === 'load'}
              <button 
                class="delete-btn" 
                on:click|stopPropagation={() => handleDelete(slot)}
                title="Delete save"
              >
                🗑️
              </button>
            {/if}
          </button>
        {/each}
      </div>

      <div class="actions">
        {#if mode === 'save'}
          <button 
            class="btn-primary" 
            on:click={handleSave}
            disabled={selectedSlot === null}
          >
            💾 Save Game
          </button>
        {:else}
          <button 
            class="btn-primary" 
            on:click={handleLoad}
            disabled={selectedSlot === null || !getSlotInfo(selectedSlot)}
          >
            📂 Load Game
          </button>
        {/if}
        <button class="btn-secondary" on:click={handleClose}>
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--surface, #fff);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
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
    padding: 1.5rem;
  }

  .slots-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .slot-button {
    background: var(--background, #f5f5f5);
    border: 2px solid var(--outline, #ddd);
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    position: relative;
  }

  .slot-button:hover {
    border-color: #2196f3;
    background: #e3f2fd;
  }

  .slot-button.selected {
    border-color: #2196f3;
    background: #bbdefb;
  }

  .slot-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .slot-number {
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--on-surface, #333);
  }

  .slot-date {
    font-size: 0.85rem;
    color: var(--on-surface, #666);
  }

  .slot-players {
    display: flex;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .players-label {
    color: var(--on-surface, #666);
  }

  .players-list {
    color: var(--on-surface, #333);
    font-weight: 500;
  }

  .slot-empty {
    color: var(--on-surface, #999);
    font-style: italic;
  }

  .delete-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .delete-btn:hover {
    background: rgba(244, 67, 54, 0.1);
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn-primary,
  .btn-secondary {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  .btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .btn-secondary {
    background: var(--background, #f5f5f5);
    color: var(--on-surface, #333);
    border: 1px solid var(--outline, #ddd);
  }

  .btn-secondary:hover {
    background: var(--surface, #e0e0e0);
  }

  @media (max-width: 600px) {
    .actions {
      flex-direction: column;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
    }
  }
</style>