<script lang="ts">
  import { gameStore, gameActions } from '$lib/stores/gameStore';
  import Translate from '$lib/components/Translate.svelte';
  import Button from '$lib/components/Button.svelte';
  import Statistics from '$lib/components/Statistics.svelte';
  import Avatar from '$lib/components/Avatar.svelte';
  import { goto } from '$app/navigation';
  import { jobConfigs, getJobConfigByDisplayName, getJobDisplayNames, type JobConfig } from '$lib/data/jobConfigs';

  // Game setup state
  let numberOfPlayers = 1;
  let players = [
    { id: 1, name: 'Player 1', insurance: false, job: 'Random Job', color: 'Random Color' }
  ];

  // Game options state
  let insuranceEnabled = true;
  let kidsMode = 'standard'; // 'standard', 'optional', 'disabled'
  let fastTrackAvailable = true;

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

  // Check if game is already in progress
  $: gameInProgress = $gameStore.players.length > 0;
</script>

<div class="dashboard-page">
  <header class="header">
    <h1>Game Dashboard</h1>
  </header>

  <main class="main-content">
    <!-- Game Setup Section (shown when no game in progress) -->
    {#if !gameInProgress}
      <div class="setup-section">
        <h2><Translate key="setup.title" /></h2>
        
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

        <div class="game-options-section">
          <h3>Game Options</h3>
          
          <div class="option-row">
            <label class="option-checkbox">
              <input 
                type="checkbox" 
                bind:checked={insuranceEnabled}
              />
              <span>Enable Insurance</span>
            </label>
          </div>

          <div class="option-row">
            <label for="kids-mode">Kids Mode:</label>
            <select id="kids-mode" bind:value={kidsMode}>
              <option value="standard">Standard</option>
              <option value="optional">Optional</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div class="option-row">
            <label class="option-checkbox">
              <input 
                type="checkbox" 
                bind:checked={fastTrackAvailable}
              />
              <span>Fast Track Available</span>
            </label>
          </div>
        </div>

        <button class="start-game-button" on:click={startGame}>
          <Translate key="setup.startGame" />
        </button>
      </div>
    {:else}
      <!-- Game Status Section (shown when game is in progress) -->
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h2>Game Status</h2>
          <div class="status-info">
            <p><strong>Phase:</strong> {$gameStore.phase}</p>
            <p><strong>Turn:</strong> {$gameStore.turn}</p>
            <p><strong>Players:</strong> {$gameStore.players.length}</p>
          </div>
          <Button on:click={() => goto('/game')} fullWidth>
            View Game Board
          </Button>
        </div>

        <div class="dashboard-card">
          <h2>Player Overview</h2>
          <div class="players-list">
            {#each $gameStore.players as player}
              <div class="player-item">
                <Avatar name={player.name} size="small" />
                <div class="player-info">
                  <div class="player-name">{player.name}</div>
                  <div class="player-stats">
                    <span>Cash: ${player.cash.toLocaleString()}</span>
                    <span>Position: {player.position}</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
          <Button on:click={() => gameActions.resetGame()} variant="secondary" fullWidth>
            Reset Game
          </Button>
        </div>

        <div class="dashboard-card">
          <Statistics 
            title="Game Statistics"
            stats={[
              { label: 'Total Turns', value: $gameStore.turn },
              { label: 'Players', value: $gameStore.players.length },
              { label: 'Cards Drawn', value: $gameStore.discardedCards.length },
              { label: 'Phase', value: $gameStore.phase.charAt(0).toUpperCase() + $gameStore.phase.slice(1) }
            ]}
          />
        </div>

        <div class="dashboard-card">
          <h2>Game Options</h2>
          <div class="options-list">
            <div class="option-item">
              <span>Insurance:</span>
              <span>{insuranceEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div class="option-item">
              <span>Kids:</span>
              <span>{kidsMode.charAt(0).toUpperCase() + kidsMode.slice(1)}</span>
            </div>
            <div class="option-item">
              <span>Fast Track:</span>
              <span>{fastTrackAvailable ? 'Available' : 'Disabled'}</span>
            </div>
          </div>
          <p class="options-note">Options can only be changed when starting a new game</p>
        </div>
      </div>
    {/if}
  </main>
</div>

<style>
  .dashboard-page {
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

  .header h1 {
    margin: 0;
  }

  .main-content {
    flex: 1;
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  /* Setup Section Styles */
  .setup-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    max-width: 800px;
    margin: 0 auto;
  }

  .setup-section h2 {
    color: var(--primary);
    margin: 0;
    text-align: center;
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

  /* Game Options Section Styles */
  .game-options-section {
    background-color: var(--surface);
    border-radius: 8px;
    padding: var(--spacing-lg);
    margin-top: var(--spacing-lg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .game-options-section h3 {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--primary);
    border-bottom: 1px solid var(--outline);
    padding-bottom: var(--spacing-sm);
  }

  .option-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) 0;
  }

  .option-row label {
    font-weight: 500;
  }

  .option-row select {
    padding: var(--spacing-sm);
    border: 1px solid var(--outline);
    border-radius: 4px;
    background: var(--background);
    color: var(--on-background);
    font-size: var(--font-size-medium);
    min-width: 120px;
  }

  .option-checkbox {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
  }

  .option-checkbox input {
    width: 18px;
    height: 18px;
  }

  .options-note {
    font-size: var(--font-size-small);
    color: #666;
    font-style: italic;
    margin-top: var(--spacing-md);
    text-align: center;
  }

  /* Dashboard Grid Styles */
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
  }

  .dashboard-card {
    background-color: var(--surface);
    border-radius: 8px;
    padding: var(--spacing-lg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .dashboard-card h2 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--primary);
    border-bottom: 1px solid var(--outline);
    padding-bottom: var(--spacing-sm);
  }

  .status-info,
  .players-list,
  .options-list {
    flex: 1;
  }

  .player-item {
    display: flex;
    align-items: center;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid #eee;
  }

  .player-item:last-child {
    border-bottom: none;
  }

  .player-info {
    margin-left: var(--spacing-sm);
  }

  .player-name {
    font-weight: 600;
  }

  .player-stats {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-small);
    color: #666;
  }

  .option-item {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid #eee;
  }

  .option-item:last-child {
    border-bottom: none;
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

  @media (max-width: 768px) {
    .main-content {
      padding: var(--spacing-md);
    }

    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
</style>