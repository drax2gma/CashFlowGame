<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Translate from './Translate.svelte';
  import type { Player } from '$lib/stores/gameStore';

  export let player: Player;
  export let netWorth: number;

  const dispatch = createEventDispatcher();

  function handleBankruptcy() {
    dispatch('bankrupt');
  }

  function handleLoan() {
    dispatch('loan');
  }
</script>

<div class="modal-overlay" on:click={handleBankruptcy}>
  <div class="modal-content" on:click|stopPropagation>
    <div class="modal-header">
      <h2>⚠️ Bankruptcy Warning</h2>
    </div>
    
    <div class="modal-body">
      <div class="player-info">
        <p class="player-name">{player.name}</p>
        <p class="status">You are in financial trouble!</p>
      </div>

      <div class="financial-summary">
        <div class="summary-item">
          <span class="label">Cash:</span>
          <span class="value">${player.cash.toLocaleString()}</span>
        </div>
        <div class="summary-item">
          <span class="label">Net Worth:</span>
          <span class="value negative">${netWorth.toLocaleString()}</span>
        </div>
        <div class="summary-item">
          <span class="label">Total Expenses:</span>
          <span class="value">${player.totalExpenses.toLocaleString()}</span>
        </div>
      </div>

      <div class="warning-message">
        <p>Your net worth is negative and you have no cash!</p>
        <p>You must either:</p>
        <ul>
          <li>Take out a loan to continue</li>
          <li>Declare bankruptcy and exit the game</li>
        </ul>
      </div>

      {#if player.loanApproval}
        <div class="actions">
          <button class="btn-loan" on:click={handleLoan}>
            💰 Request Loan
          </button>
          <button class="btn-bankrupt" on:click={handleBankruptcy}>
            📉 Declare Bankruptcy
          </button>
        </div>
      {:else}
        <div class="actions">
          <button class="btn-bankrupt" on:click={handleBankruptcy}>
            📉 Declare Bankruptcy
          </button>
        </div>
        <p class="no-loan">You are not eligible for a loan</p>
      {/if}
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
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
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

  .player-info {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .player-name {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--on-surface, #333);
    margin: 0 0 0.5rem 0;
  }

  .status {
    color: #d32f2f;
    font-weight: 600;
    margin: 0;
  }

  .financial-summary {
    background: var(--background, #f5f5f5);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--outline, #ddd);
  }

  .summary-item:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 600;
    color: var(--on-surface, #666);
  }

  .value {
    font-weight: bold;
    color: var(--on-surface, #333);
  }

  .value.negative {
    color: #d32f2f;
  }

  .warning-message {
    background: #fff3e0;
    border-left: 4px solid #ff9800;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
  }

  .warning-message p {
    margin: 0 0 0.5rem 0;
    color: #e65100;
  }

  .warning-message ul {
    margin: 0.5rem 0 0 1.5rem;
    color: #e65100;
  }

  .warning-message li {
    margin: 0.25rem 0;
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn-loan,
  .btn-bankrupt {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-loan {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
  }

  .btn-loan:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  .btn-bankrupt {
    background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
    color: white;
  }

  .btn-bankrupt:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
  }

  .no-loan {
    text-align: center;
    color: #757575;
    font-style: italic;
    margin-top: 1rem;
  }

  @media (max-width: 600px) {
    .actions {
      flex-direction: column;
    }

    .btn-loan,
    .btn-bankrupt {
      width: 100%;
    }
  }
</style>