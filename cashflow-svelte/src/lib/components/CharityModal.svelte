<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Translate from '$lib/components/Translate.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { Player } from '$lib/stores/gameStore';

  export let show: boolean = false;
  export let player: Player | null = null;
  export let charityAmount: number = 0;

  const dispatch = createEventDispatcher();

  function handleDonate() {
    dispatch('donate');
  }

  function handleClose() {
    dispatch('close');
  }

  $: charityAmount = player ? Math.floor(player.income * 0.1) : 0;
</script>

{#if show && player}
  <div class="modal-overlay" on:click={handleClose}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>💝 Charity Donation</h2>
      </div>
      
      <div class="modal-body">
        <div class="charity-info">
          <p class="charity-message">
            You've landed on a Charity space! As a responsible citizen, you can donate 10% of your income.
          </p>
          
          <div class="charity-details">
            <div class="detail-row">
              <span>Your Monthly Income:</span>
              <span>${player.income.toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span>Charity Donation (10%):</span>
              <span class="amount">-${charityAmount.toLocaleString()}</span>
            </div>
            <div class="detail-row highlight">
              <span>Charity Benefits:</span>
              <span>+3 turns of extra income</span>
            </div>
          </div>
          
          <p class="benefits-message">
            By donating to charity, you'll receive extra income benefits for the next 3 turns!
          </p>
        </div>
        
        <div class="modal-actions">
          <Button 
            on:click={handleDonate} 
            variant="success"
            disabled={player.cash < charityAmount}
          >
            Donate ${charityAmount.toLocaleString()}
          </Button>
          <Button on:click={handleClose} variant="secondary">
            Cancel
          </Button>
        </div>
        
        {#if player.cash < charityAmount}
          <p class="insufficient-funds">
            ⚠️ You don't have enough cash for this donation.
          </p>
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
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--surface);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 12px 12px 0 0;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .charity-info {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .charity-message {
    color: var(--on-surface);
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }

  .charity-details {
    background: var(--background);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--outline);
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-row.highlight {
    background: #fff3e0;
    padding: 0.75rem;
    border-radius: 4px;
    margin-top: 0.5rem;
  }

  .amount {
    font-weight: bold;
    color: var(--error);
  }

  .benefits-message {
    color: var(--success);
    font-weight: 600;
    margin: 1rem 0 0 0;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .insufficient-funds {
    text-align: center;
    color: var(--error);
    font-weight: 600;
    margin-top: 1rem;
  }

  @media (max-width: 600px) {
    .modal-actions {
      flex-direction: column;
    }

    .modal-actions button {
      width: 100%;
    }
  }
</style>