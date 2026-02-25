<script lang="ts">
  import { gameStore, currentPlayer, getPlayerColor, type BoardSpace } from '../stores/gameStore';
  import { onMount, tick } from 'svelte';
  import Translate from './Translate.svelte';
  import Tooltip from './Tooltip.svelte';
  import Badge from './Badge.svelte';
  
  // Board properties
  let boardContainer: HTMLElement;
  let hoveredSpace: number | null = null;
  
  // Space type icons and colors
  const spaceConfig: Record<string, { icon: string; color: string; gradient: string }> = {
    opportunity: { 
      icon: '💡', 
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
    },
    liability: { 
      icon: '💸', 
      color: '#F44336',
      gradient: 'linear-gradient(135deg, #F44336 0%, #C62828 100%)'
    },
    charity: { 
      icon: '❤️', 
      color: '#E91E63',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #AD1457 100%)'
    },
    offer: { 
      icon: '🎁', 
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)'
    },
    payday: { 
      icon: '💰', 
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)'
    },
    downsize: { 
      icon: '📉', 
      color: '#FF5722',
      gradient: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)'
    },
    child: { 
      icon: '👶', 
      color: '#00BCD4',
      gradient: 'linear-gradient(135deg, #00BCD4 0%, #00838F 100%)'
    },
    dream: { 
      icon: '⭐', 
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)'
    },
    market: { 
      icon: '📊', 
      color: '#607D8B',
      gradient: 'linear-gradient(135deg, #607D8B 0%, #37474F 100%)'
    },
    deal: { 
      icon: '🤝', 
      color: '#8BC34A',
      gradient: 'linear-gradient(135deg, #8BC34A 0%, #558B2F 100%)'
    }
  };
  
  // Get space configuration
  function getSpaceConfig(type: string) {
    return spaceConfig[type] || { 
      icon: '❓', 
      color: '#9E9E9E',
      gradient: 'linear-gradient(135deg, #9E9E9E 0%, #616161 100%)'
    };
  }
  
  // Handle space click
  function handleSpaceClick(index: number) {
    console.log(`Clicked on space ${index}`);
  }
  
  // Handle space hover
  function handleSpaceHover(index: number | null) {
    hoveredSpace = index;
  }
  
  // Get tooltip text for a space
  function getSpaceTooltip(space: BoardSpace): string {
    const tooltips: Record<string, string> = {
      opportunity: 'Draw an Opportunity card - Small or Big Deal',
      liability: 'Draw a Liability card - Pay an expense',
      charity: 'Charity - Donate 10% of income for 3 turns of 2 dice',
      offer: 'Offer - Receive a special business offer',
      payday: 'Payday - Collect your monthly salary',
      downsize: 'Downsize - Lose your job and pay expenses',
      child: 'Child - Add a child to your family (increases expenses)',
      dream: 'Dream - Work toward your dream goal',
      market: 'Market - Market conditions affect your assets',
      deal: 'Deal - Big deal opportunity awaits'
    };
    return tooltips[space.type] || space.type;
  }
  
  // Get space display name
  function getSpaceName(type: string): string {
    const names: Record<string, string> = {
      opportunity: 'Opportunity',
      liability: 'Liability',
      charity: 'Charity',
      offer: 'Offer',
      payday: 'Payday',
      downsize: 'Downsize',
      child: 'Child',
      dream: 'Dream',
      market: 'Market',
      deal: 'Deal'
    };
    return names[type] || type;
  }
  
  // Calculate board layout positions
  $: boardSpaces = $gameStore.board;
  $: totalSpaces = boardSpaces.length;
  
  // Split spaces into sides for rectangular layout
  $: topSpaces = boardSpaces.slice(0, Math.ceil(totalSpaces / 4));
  $: rightSpaces = boardSpaces.slice(Math.ceil(totalSpaces / 4), Math.ceil(totalSpaces / 2));
  $: bottomSpaces = boardSpaces.slice(Math.ceil(totalSpaces / 2), Math.ceil(totalSpaces * 3 / 4));
  $: leftSpaces = boardSpaces.slice(Math.ceil(totalSpaces * 3 / 4));
  
  // Get players on a specific space
  function getPlayersOnSpace(spaceIndex: number) {
    return $gameStore.players.filter(p => p.position === spaceIndex);
  }
</script>

<div class="board-container" bind:this={boardContainer}>
  <div class="board-frame">
    <!-- Top row -->
    <div class="board-row top-row">
      {#each topSpaces as space, i}
        {@const spaceIndex = i}
        {@const config = getSpaceConfig(space.type)}
        {@const playersHere = getPlayersOnSpace(spaceIndex)}
        <Tooltip text={getSpaceTooltip(space)}>
          <div 
            class="board-space"
            class:hovered={hoveredSpace === spaceIndex}
            class:active={spaceIndex === $currentPlayer?.position}
            on:click={() => handleSpaceClick(spaceIndex)}
            on:mouseenter={() => handleSpaceHover(spaceIndex)}
            on:mouseleave={() => handleSpaceHover(null)}
            role="button"
            tabindex="0"
          >
            <div class="space-inner" style="background: {config.gradient};">
              <span class="space-icon">{config.icon}</span>
              <span class="space-name">{getSpaceName(space.type)}</span>
            </div>
            {#if playersHere.length > 0}
              <div class="players-on-space">
                {#each playersHere as player}
                  <div 
                    class="mini-token"
                    style="background-color: {getPlayerColor(player.color)};"
                    title={player.name}
                  >
                    {player.id}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </Tooltip>
      {/each}
    </div>
    
    <!-- Middle section with left spaces, center, and right spaces -->
    <div class="board-middle">
      <!-- Left column -->
      <div class="board-column left-column">
        {#each leftSpaces.slice().reverse() as space, i}
          {@const spaceIndex = totalSpaces - 1 - i}
          {@const config = getSpaceConfig(space.type)}
          {@const playersHere = getPlayersOnSpace(spaceIndex)}
          <Tooltip text={getSpaceTooltip(space)}>
            <div 
              class="board-space vertical"
              class:hovered={hoveredSpace === spaceIndex}
              class:active={spaceIndex === $currentPlayer?.position}
              on:click={() => handleSpaceClick(spaceIndex)}
              on:mouseenter={() => handleSpaceHover(spaceIndex)}
              on:mouseleave={() => handleSpaceHover(null)}
              role="button"
              tabindex="0"
            >
              <div class="space-inner" style="background: {config.gradient};">
                <span class="space-icon">{config.icon}</span>
                <span class="space-name">{getSpaceName(space.type)}</span>
              </div>
              {#if playersHere.length > 0}
                <div class="players-on-space">
                  {#each playersHere as player}
                    <div 
                      class="mini-token"
                      style="background-color: {getPlayerColor(player.color)};"
                      title={player.name}
                    >
                      {player.id}
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          </Tooltip>
        {/each}
      </div>
      
      <!-- Center area -->
      <div class="board-center">
        <div class="center-content">
          <h2 class="game-title">CASHFLOW</h2>
          <p class="game-subtitle">Escape the Rat Race</p>
          
          <div class="center-info">
            <div class="info-item">
              <span class="info-label">Turn</span>
              <span class="info-value">{$gameStore.turn}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phase</span>
              <span class="info-value phase">{$gameStore.phase === 'ratRace' ? 'Rat Race' : 'Fast Track'}</span>
            </div>
          </div>
          
          <div class="legend">
            <h4>Space Types</h4>
            <div class="legend-items">
              {#each Object.entries(spaceConfig) as [type, config]}
                <div class="legend-item">
                  <span class="legend-icon">{config.icon}</span>
                  <span class="legend-name">{getSpaceName(type)}</span>
                </div>
              {/each}
            </div>
          </div>
          
          <!-- Current player indicator -->
          {#if $currentPlayer}
            <div class="current-player">
              <div class="player-avatar" style="background-color: {getPlayerColor($currentPlayer?.color ?? 'blue')};">
                {$currentPlayer?.id ?? '?'}
              </div>
              <div class="player-details">
                <span class="player-name">{$currentPlayer?.name ?? 'Player'}</span>
                <span class="player-cash">${($currentPlayer?.cash ?? 0).toLocaleString()}</span>
              </div>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Right column -->
      <div class="board-column right-column">
        {#each rightSpaces as space, i}
          {@const spaceIndex = topSpaces.length + i}
          {@const config = getSpaceConfig(space.type)}
          {@const playersHere = getPlayersOnSpace(spaceIndex)}
          <Tooltip text={getSpaceTooltip(space)}>
            <div 
              class="board-space vertical"
              class:hovered={hoveredSpace === spaceIndex}
              class:active={spaceIndex === $currentPlayer?.position}
              on:click={() => handleSpaceClick(spaceIndex)}
              on:mouseenter={() => handleSpaceHover(spaceIndex)}
              on:mouseleave={() => handleSpaceHover(null)}
              role="button"
              tabindex="0"
            >
              <div class="space-inner" style="background: {config.gradient};">
                <span class="space-icon">{config.icon}</span>
                <span class="space-name">{getSpaceName(space.type)}</span>
              </div>
              {#if playersHere.length > 0}
                <div class="players-on-space">
                  {#each playersHere as player}
                    <div 
                      class="mini-token"
                      style="background-color: {getPlayerColor(player.color)};"
                      title={player.name}
                    >
                      {player.id}
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          </Tooltip>
        {/each}
      </div>
    </div>
    
    <!-- Bottom row -->
    <div class="board-row bottom-row">
      {#each bottomSpaces.slice().reverse() as space, i}
        {@const spaceIndex = totalSpaces - Math.ceil(totalSpaces / 4) - i}
        {@const config = getSpaceConfig(space.type)}
        {@const playersHere = getPlayersOnSpace(spaceIndex)}
        <Tooltip text={getSpaceTooltip(space)}>
          <div 
            class="board-space"
            class:hovered={hoveredSpace === spaceIndex}
            class:active={spaceIndex === $currentPlayer?.position}
            on:click={() => handleSpaceClick(spaceIndex)}
            on:mouseenter={() => handleSpaceHover(spaceIndex)}
            on:mouseleave={() => handleSpaceHover(null)}
            role="button"
            tabindex="0"
          >
            <div class="space-inner" style="background: {config.gradient};">
              <span class="space-icon">{config.icon}</span>
              <span class="space-name">{getSpaceName(space.type)}</span>
            </div>
            {#if playersHere.length > 0}
              <div class="players-on-space">
                {#each playersHere as player}
                  <div 
                    class="mini-token"
                    style="background-color: {getPlayerColor(player.color)};"
                    title={player.name}
                  >
                    {player.id}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </Tooltip>
      {/each}
    </div>
  </div>
  
  <!-- Player tokens (main display) -->
  <div class="player-tokens">
    {#each $gameStore.players as player}
      {@const config = getSpaceConfig($gameStore.board[player.position]?.type || 'opportunity')}
      <div 
        class="player-token"
        class:current={player.id === $currentPlayer?.id}
        style="--player-color: {getPlayerColor(player.color)};"
      >
        <div class="token-avatar" style="background-color: {getPlayerColor(player.color)};">
          {player.id}
        </div>
        <div class="token-info">
          <span class="token-name">{player.name}</span>
          <span class="token-position">
            {config.icon} {getSpaceName($gameStore.board[player.position]?.type || 'opportunity')}
          </span>
        </div>
        {#if player.isDownsized}
          <Badge variant="error" size="small">DS</Badge>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .board-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 1rem;
    gap: 1rem;
  }
  
  .board-frame {
    display: flex;
    flex-direction: column;
    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    border-radius: 16px;
    padding: 8px;
    box-shadow: 
      0 10px 40px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.1);
  }
  
  .board-row {
    display: flex;
    justify-content: center;
    gap: 4px;
  }
  
  .board-middle {
    display: flex;
    gap: 4px;
  }
  
  .board-column {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .board-space {
    position: relative;
    width: 90px;
    height: 60px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .board-space.vertical {
    width: 70px;
    height: 50px;
  }
  
  .board-space:hover {
    transform: scale(1.05);
    z-index: 10;
  }
  
  .board-space.active {
    box-shadow: 0 0 0 3px #FFD700, 0 0 20px rgba(255, 215, 0, 0.5);
    transform: scale(1.08);
    z-index: 20;
  }
  
  .board-space.hovered {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }
  
  .space-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .space-icon {
    font-size: 1.2rem;
    line-height: 1;
  }
  
  .space-name {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }
  
  .board-space.vertical .space-icon {
    font-size: 1rem;
  }
  
  .board-space.vertical .space-name {
    font-size: 0.55rem;
  }
  
  .players-on-space {
    position: absolute;
    bottom: 2px;
    right: 2px;
    display: flex;
    gap: 2px;
  }
  
  .mini-token {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    font-weight: bold;
    color: white;
    border: 1px solid white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  .board-center {
    flex: 1;
    min-width: 280px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 100%);
    border-radius: 12px;
    margin: 4px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .center-content {
    text-align: center;
    padding: 1.5rem;
    color: white;
  }
  
  .game-title {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B6B 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.25rem 0;
    text-shadow: none;
    letter-spacing: 2px;
  }
  
  .game-subtitle {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 1rem 0;
    font-style: italic;
  }
  
  .center-info {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .info-label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .info-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #FFD700;
  }
  
  .info-value.phase {
    font-size: 1rem;
    color: #4CAF50;
  }
  
  .legend {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .legend h4 {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .legend-items {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.25rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .legend-icon {
    font-size: 0.9rem;
  }
  
  .current-player {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .player-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: 1.2rem;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .player-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .player-name {
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .player-cash {
    color: #4CAF50;
    font-size: 0.85rem;
  }
  
  .player-tokens {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    max-width: 100%;
  }
  
  .player-token {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease;
  }
  
  .player-token.current {
    background: rgba(255, 215, 0, 0.2);
    border-color: #FFD700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
  
  .token-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: 0.8rem;
    border: 2px solid white;
  }
  
  .token-info {
    display: flex;
    flex-direction: column;
  }
  
  .token-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
  }
  
  .token-position {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.6);
  }
  
  @media (max-width: 900px) {
    .board-space {
      width: 70px;
      height: 50px;
    }
    
    .board-space.vertical {
      width: 55px;
      height: 45px;
    }
    
    .space-icon {
      font-size: 1rem;
    }
    
    .space-name {
      font-size: 0.55rem;
    }
    
    .board-center {
      min-width: 200px;
      min-height: 250px;
    }
    
    .game-title {
      font-size: 1.5rem;
    }
    
    .legend-items {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 600px) {
    .board-space {
      width: 50px;
      height: 40px;
    }
    
    .board-space.vertical {
      width: 40px;
      height: 35px;
    }
    
    .space-icon {
      font-size: 0.8rem;
    }
    
    .space-name {
      font-size: 0.45rem;
    }
    
    .board-center {
      min-width: 150px;
      min-height: 200px;
    }
    
    .game-title {
      font-size: 1.2rem;
    }
    
    .legend {
      display: none;
    }
    
    .center-info {
      gap: 1rem;
    }
    
    .info-value {
      font-size: 1.2rem;
    }
  }
</style>