<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Translate from '$lib/components/Translate.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { Player } from '$lib/stores/gameStore';

  export let show: boolean = false;
  export let player: Player | null = null;

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
  }
</script>

{#if show && player}
  <div class="modal-overlay" on:click={handleClose}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>👶 Congratulations!</h2>
      </div>
      
      <div class="modal-body">
        <div class="child-info">
          <div class="icon">🎉</div>
          <p class="child-message">
            You've had a beautiful baby!
          </p>
          
          <div class="child-details">
            <div class="detail-row">
              <span>Number of Children:</span>
              <span>{player.children + 1}</span>
            </div>
            <div class="detail-row">
              <span>Additional Child Expense:</span>
              <span class="amount">+$200/month</span>
            </div>
            <div class="detail-row highlight">
              <span>Total Child Expenses:</span>
              <span class="amount">${(player.childExpenses + 200).toLocaleString()}/month</span>
            </div>
          </div>
          
          <p class="responsibility-message">
            Remember to budget for your child's expenses including education, activities, and care.
            Each child adds $200 to your monthly expenses.
          </p>
        </div>
        
        <div class="modal-actions">
          <Button on:click={handleClose} variant="success">
            Welcome Baby!
          </Button>
        </div>
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
    background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
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

  .child-info {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .child-message {
    color: var(--on-surface);
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }

  .child-details {
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
    background: #fce4ec;
    padding: 0.75rem;
    border-radius: 4px;
    margin-top: 0.5rem;
  }

  .amount {
    font-weight: bold;
    color: var(--error);
  }

  .responsibility-message {
    color: var(--primary);
    margin: 1rem 0 0 0;
    line-height: 1.5;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
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