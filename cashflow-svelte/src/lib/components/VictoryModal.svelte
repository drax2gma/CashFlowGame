<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Translate from './Translate.svelte';
  import type { Player } from '$lib/stores/gameStore';

  export let player: Player;

  const dispatch = createEventDispatcher();

  function handleNewGame() {
    dispatch('newgame');
  }

  function handleViewStats() {
    dispatch('stats');
  }
</script>

<div class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h2>🏆 Victory!</h2>
    </div>
    
    <div class="modal-body">
      <div class="celebration">
        <div class="confetti">🎊</div>
        <div class="winner-info">
          <p class="winner-name">{player.name}</p>
          <p class="winner-title">Financial Freedom Achieved!</p>
        </div>
        <div class="confetti">🎊</div>
      </div>

      <div class="dream-section">
        <h3>Your Dream</h3>
        {#if player.dream}
          <div class="dream-card">
            <p class="dream-name">{player.dream.name}</p>
            <p class="dream-description">{player.dream.description}</p>
            {#if player.dream.perk}
              <p class="dream-perk">✨ {player.dream.perk}</p>
            {/if}
          </div>
        {:else}
          <p class="no-dream">You achieved financial freedom!</p>
        {/if}
      </div>

      <div class="financial-summary">
        <h3>Final Stats</h3>
        <div class="summary-item">
          <span class="label">Cash:</span>
          <span class="value">${player.cash.toLocaleString()}</span>
        </div>
        <div class="summary-item">
          <span class="label">Passive Income:</span>
          <span class="value">${player.passiveIncome.toLocaleString()}</span>
        </div>
        <div class="summary-item">
          <span class="label">Assets:</span>
          <span class="value">{player.assets.length}</span>
        </div>
        <div class="summary-item">
          <span class="label">Turns Played:</span>
          <span class="value">{player.downsizedTurns}</span>
        </div>
      </div>

      <div class="actions">
        <button class="btn-stats" on:click={handleViewStats}>
          📊 View Stats
        </button>
        <button class="btn-new-game" on:click={handleNewGame}>
          🎮 New Game
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
    background: var(--surface, #fff);
    border-radius: 16px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
    max-width: 550px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.4s ease;
  }

  @keyframes slideUp {
    from { 
      transform: translateY(50px);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
    color: #333;
    padding: 2rem;
    border-radius: 16px 16px 0 0;
    text-align: center;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .modal-body {
    padding: 2rem;
  }

  .celebration {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .confetti {
    font-size: 2.5rem;
    animation: bounce 1s ease infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .winner-info {
    flex: 1;
  }

  .winner-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--on-surface, #333);
    margin: 0 0 0.5rem 0;
  }

  .winner-title {
    color: #ffd700;
    font-weight: 600;
    font-size: 1.1rem;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  .dream-section {
    margin-bottom: 1.5rem;
  }

  .dream-section h3 {
    margin: 0 0 1rem 0;
    color: var(--on-surface, #333);
    font-size: 1.1rem;
  }

  .dream-card {
    background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
    border-radius: 8px;
    padding: 1rem;
    border: 2px solid #ffd700;
  }

  .dream-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #f57f17;
    margin: 0 0 0.5rem 0;
  }

  .dream-description {
    color: #666;
    margin: 0 0 0.5rem 0;
  }

  .dream-perk {
    color: #4caf50;
    font-weight: 600;
    margin: 0;
  }

  .no-dream {
    text-align: center;
    color: #666;
    font-style: italic;
  }

  .financial-summary {
    background: var(--background, #f5f5f5);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .financial-summary h3 {
    margin: 0 0 1rem 0;
    color: var(--on-surface, #333);
    font-size: 1.1rem;
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

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn-stats,
  .btn-new-game {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-stats {
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    color: white;
  }

  .btn-stats:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  .btn-new-game {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
  }

  .btn-new-game:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  @media (max-width: 600px) {
    .actions {
      flex-direction: column;
    }

    .btn-stats,
    .btn-new-game {
      width: 100%;
    }

    .celebration {
      flex-direction: column;
    }

    .confetti {
      font-size: 2rem;
    }
  }
</style>