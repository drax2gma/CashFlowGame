<script lang="ts">
  import { locale } from 'svelte-i18n';
  import Translate from '$lib/components/Translate.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let version = '1.5';

  // Set the initial locale
  onMount(() => {
    // In a real app, you might load this from localStorage or user preferences
    $locale = 'en';
  });

  function startGame() {
    // Navigate to game setup
    goto('/setup');
  }
  
  function viewGame() {
    // Navigate to game
    goto('/game');
  }
  
  function viewSettings() {
    // Navigate to settings
    goto('/settings');
  }
</script>

<div class="home-screen">
  <header class="header">
    <h1 class="title">
      <Translate key="app.title" />
    </h1>
    <div class="version">
      <Translate key="home.version" values={{ version }} />
    </div>
  </header>

  <main class="main-content">

    <div class="actions">
      <button class="start-button" on:click={startGame}>
        <Translate key="home.clickToStart" />
      </button>
      
      <button class="new-game-button">
        <Translate key="home.createNewGame" />
      </button>
      
      <button class="game-button" on:click={viewGame}>
        View Game
      </button>
      
      <button class="dashboard-button" on:click={() => goto('/dashboard')}>
        Game Dashboard
      </button>
      
      <button class="settings-button" on:click={viewSettings}>
        <Translate key="navigation.settings" />
      </button>
    </div>

  </main>
</div>

<style>
  .home-screen {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
    color: white;
    font-family: 'Roboto', sans-serif;
  }

  .header {
    text-align: center;
    padding: 2rem 1rem;
    background: rgba(0, 0, 0, 0.2);
  }

  .title {
    font-size: 3rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    letter-spacing: 2px;
  }

  .version {
    font-size: 1rem;
    opacity: 0.8;
    margin-top: 0.5rem;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    gap: 2rem;
  }


  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }

  button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
  }

  .start-button {
    background: #4CAF50;
    color: white;
  }

  .start-button:hover {
    background: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .new-game-button {
    background: #FF9800;
    color: white;
  }

  .new-game-button:hover {
    background: #e68a00;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .game-button {
    background: #673AB7;
    color: white;
  }
  
  .game-button:hover {
    background: #512DA8;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .dashboard-button {
    background: #009688;
    color: white;
  }
  
  .dashboard-button:hover {
    background: #00796B;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .settings-button {
    background: #607D8B;
    color: white;
  }
  
  .settings-button:hover {
    background: #455A64;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    .title {
      font-size: 2rem;
    }
    
    button {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
    }
  }
</style>
