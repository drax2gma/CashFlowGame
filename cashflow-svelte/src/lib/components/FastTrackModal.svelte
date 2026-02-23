<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Translate from './Translate.svelte';
  import type { Player } from '$lib/stores/gameStore';

  export let player: Player;
  export let passiveIncome: number;

  const dispatch = createEventDispatcher();

  function handleEnterFastTrack() {
    dispatch('enter');
  }
</script>

<div class="modal-overlay" on:click={handleEnterFastTrack}>
  <div class="modal-content" on:click|stopPropagation>
    <div class="modal-header">
      <h2>🎉 Fast Track Achieved!</h2>
    </div>
    
    <div class="modal-body">
      <div class="player-info">
        <p class="player-name">{player.name}</p>
        <p class="congratulations">Congratulations!</p>
      </div>

      <div class="achievement">
        <div class="icon">🚀</div>
        <p class="message">You have escaped the Rat Race!</p>
      </div>

      <div class="financial-summary">
        <div class="summary-item">
          <span class="label">Passive Income:</span>
          <span class="value positive">${passiveIncome.toLocaleString()}</span>
        </div>
        <div class="summary-item">
          <span class="label">Total Expenses:</span>
          <span class="value">${player.totalExpenses.toLocaleString()}</span>
        </div>
        <div class="summary-item highlight">
          <span class="label">Status:</span>
          <span class="value">Financially Free!</span>
        </div>
      </div>

      <div class="info-message">
        <p>You now have enough passive income to cover your expenses!</p>
        <p>Welcome to the Fast Track where you can:</p>
        <ul>
          <li>Purchase your dream</li>
          <li>Invest in bigger deals</li>
          <li>Win the game!</li>
        </ul>
      </div>

      <div class="actions">
        <button class="btn-enter" on:click={handleEnterFastTrack}>
          🏁 Enter Fast Track
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
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
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

  .congratulations {
    color: #4caf50;
    font-weight: 600;
    font-size: 1.1rem;
    margin: 0;
  }

  .achievement {
    text-align: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .message {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2e7d32;
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

  .summary-item.highlight {
    background: #4caf50;
    color: white;
    padding: 0.75rem;
    border-radius: 4px;
    margin-top: 0.5rem;
  }

  .label {
    font-weight: 600;
    color: var(--on-surface, #666);
  }

  .summary-item.highlight .label {
    color: white;
  }

  .value {
    font-weight: bold;
    color: var(--on-surface, #333);
  }

  .summary-item.highlight .value {
    color: white;
  }

  .value.positive {
    color: #4caf50;
  }

  .info-message {
    background: #e3f2fd;
    border-left: 4px solid #2196f3;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
  }

  .info-message p {
    margin: 0 0 0.5rem 0;
    color: #1565c0;
  }

  .info-message ul {
    margin: 0.5rem 0 0 1.5rem;
    color: #1565c0;
  }

  .info-message li {
    margin: 0.25rem 0;
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn-enter {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    transition: all 0.2s ease;
  }

  .btn-enter:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  @media (max-width: 600px) {
    .actions {
      flex-direction: column;
    }

    .btn-enter {
      width: 100%;
    }
  }
</style>