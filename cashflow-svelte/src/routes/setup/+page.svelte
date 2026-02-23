<script lang="ts">
  import Translate from '$lib/components/Translate.svelte';
  import { goto } from '$app/navigation';
  import { gameActions } from '$lib/stores/gameStore';
  import { jobConfigs, getJobConfigByDisplayName, getJobDisplayNames, type JobConfig } from '$lib/data/jobConfigs';
  import { onMount } from 'svelte';

  // Game setup state
  let numberOfPlayers = 1;
  let players = [
    { id: 1, name: 'Player 1', insurance: false, job: 'Random Job', color: 'Random Color' }
  ];

  // Available jobs - use display names from jobConfigs
  const jobs = ['Random Job', ...getJobDisplayNames()];

  // Available colors
  const colors = [
    'Random Color',
    'Green',
    'Red',
    'Blue',
    'Black',
    'Pink',
    'Aqua',
    'Orange',
    'White'
  ];

  // Available color values for random selection
  const availableColors = ['Green', 'Red', 'Blue', 'Black', 'Pink', 'Aqua', 'Orange', 'White'];

  // Update players when number changes
  function updatePlayerCount() {
    if (numberOfPlayers > players.length) {
      // Add new players
      for (let i = players.length + 1; i <= numberOfPlayers; i++) {
        players = [...players, { id: i, name: `Player ${i}`, insurance: false, job: 'Random Job', color: 'Random Color' }];
      }
    } else if (numberOfPlayers < players.length) {
      // Remove excess players
      players = players.slice(0, numberOfPlayers);
    }
  }

  function updatePlayerName(id: number, name: string) {
    players = players.map(player => 
      player.id === id ? { ...player, name } : player
    );
  }

  function updatePlayerInsurance(id: number, insurance: boolean) {
    players = players.map(player => 
      player.id === id ? { ...player, insurance } : player
    );
  }

  function updatePlayerJob(id: number, job: string) {
    players = players.map(player => 
      player.id === id ? { ...player, job } : player
    );
  }

  function updatePlayerColor(id: number, color: string) {
    players = players.map(player => 
      player.id === id ? { ...player, color } : player
    );
  }

  function getRandomJob(): JobConfig {
    const jobKeys = Object.keys(jobConfigs);
    const randomKey = jobKeys[Math.floor(Math.random() * jobKeys.length)];
    return jobConfigs[randomKey];
  }

  function getRandomColor(usedColors: string[]): string {
    const available = availableColors.filter(c => !usedColors.includes(c));
    if (available.length === 0) {
      // If all colors are used, pick any color
      return availableColors[Math.floor(Math.random() * availableColors.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  function startGame() {
    // Validate players
    const validPlayers = players.filter(p => p.name.trim().length > 0);
    if (validPlayers.length === 0) {
      alert('Please enter at least one player name');
      return;
    }

    // Track used colors to avoid duplicates when random
    const usedColors: string[] = [];

    // Map players to game initialization format
    const gamePlayers = validPlayers.map(player => {
      // Determine job
      let jobConfig: JobConfig;
      if (player.job === 'Random Job') {
        jobConfig = getRandomJob();
      } else {
        jobConfig = getJobConfigByDisplayName(player.job) || getRandomJob();
      }

      // Determine color
      let playerColor = player.color;
      if (playerColor === 'Random Color') {
        playerColor = getRandomColor(usedColors);
      }
      usedColors.push(playerColor);

      return {
        name: player.name.trim(),
        color: playerColor,
        job: jobConfig.name,
        insurance: player.insurance,
        salary: jobConfig.salary,
        expenses: jobConfig.totalExpenses,
        savings: jobConfig.savings
      };
    });

    // Initialize the game
    gameActions.initializeGame(gamePlayers);

    // Navigate to the game board
    goto('/game');
  }
</script>

<div class="setup-screen">
  <header class="header">
    <h1><Translate key="setup.title" /></h1>
  </header>

  <main class="main-content">
    <div class="setup-section">
      <div class="player-count-control">
        <label for="player-number">
          <Translate key="setup.numberOfPlayers" />
        </label>
        <select 
          id="player-number" 
          bind:value={numberOfPlayers} 
          on:change={updatePlayerCount}
        >
          {#each Array(8).fill(0).map((_, i) => i + 1) as num}
            <option value={num}>{num}</option>
          {/each}
        </select>
      </div>

      <div class="players-setup">
        {#each players as player (player.id)}
          <div class="player-input" id="player{player.id}input">
            <div class="player-header">
              <label for="player{player.id}name">
                <Translate key="setup.player" values={{ number: player.id }} />:
              </label>
              <input 
                type="text" 
                id="player{player.id}name" 
                bind:value={player.name}
                on:input={(e) => updatePlayerName(player.id, (e.target as HTMLInputElement).value)}
                maxlength="16"
              />
            </div>

            <div class="player-options">
              <label class="player-options-checkbox">
                <input 
                  type="checkbox" 
                  id="po-insurance-p{player.id}" 
                  bind:checked={player.insurance}
                  on:change={(e) => updatePlayerInsurance(player.id, (e.target as HTMLInputElement).checked)}
                />
                <span class="player-input-checkmark">
                  <Translate key="setup.insurance" />
                </span>
              </label>

              <div class="player-option-dropdowns">
                <select 
                  id="job-input-player{player.id}" 
                  class="job-input"
                  bind:value={player.job}
                  on:change={(e) => updatePlayerJob(player.id, (e.target as HTMLSelectElement).value)}
                >
                  {#each jobs as job}
                    <option>{job}</option>
                  {/each}
                </select>

                <select 
                  id="color-input-player{player.id}" 
                  class="color-input"
                  bind:value={player.color}
                  on:change={(e) => updatePlayerColor(player.id, (e.target as HTMLSelectElement).value)}
                >
                  {#each colors as color}
                    <option>{color}</option>
                  {/each}
                </select>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <button class="start-game-button" on:click={startGame}>
        <Translate key="setup.startGame" />
      </button>
    </div>
  </main>
</div>

<style>
  .setup-screen {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--background);
    color: var(--on-background);
    font-family: var(--font-family);
  }

  .header {
    background-color: var(--primary);
    color: var(--on-primary);
    padding: var(--spacing-lg);
    text-align: center;
  }

  .main-content {
    flex: 1;
    padding: var(--spacing-lg);
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }

  .setup-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .player-count-control {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .player-count-control label {
    font-weight: 600;
    color: var(--on-surface);
  }

  .player-count-control select {
    padding: var(--spacing-sm);
    border: 1px solid var(--outline);
    border-radius: 4px;
    background: var(--background);
    color: var(--on-background);
    font-size: var(--font-size-medium);
    max-width: 100px;
  }

  .players-setup {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .player-input {
    padding: var(--spacing-md);
    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .player-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .player-header label {
    font-weight: 600;
    min-width: 80px;
  }

  .player-header input {
    flex: 1;
    padding: var(--spacing-sm);
    border: 1px solid var(--outline);
    border-radius: 4px;
    font-size: var(--font-size-medium);
  }

  .player-options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .player-options-checkbox {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
  }

  .player-options-checkbox input {
    width: 18px;
    height: 18px;
  }

  .player-option-dropdowns {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .player-option-dropdowns select {
    padding: var(--spacing-sm);
    border: 1px solid var(--outline);
    border-radius: 4px;
    background: var(--background);
    color: var(--on-background);
    font-size: var(--font-size-medium);
    width: 100%;
  }

  .start-game-button {
    padding: var(--spacing-md);
    background-color: var(--success);
    color: var(--on-success);
    border: none;
    border-radius: 8px;
    font-size: var(--font-size-large);
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .start-game-button:hover {
    background-color: #45a049;
  }

  @media (min-width: 768px) {
    .player-option-dropdowns {
      flex-direction: row;
      gap: var(--spacing-md);
    }
    
    .player-option-dropdowns select {
      flex: 1;
    }
  }
</style>