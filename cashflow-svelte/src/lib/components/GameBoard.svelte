<script lang="ts">
  import { gameStore, currentPlayer, getPlayerColor } from '../stores/gameStore';
  import { onMount, tick } from 'svelte';
  import Translate from './Translate.svelte';
  import Tooltip from './Tooltip.svelte';
  import Badge from './Badge.svelte';
  
  // Board properties
  let boardRadius = 250;
  let cellSize = 60;
  let boardContainer: HTMLElement;
  
  // Get board dimensions
  $: boardSize = boardRadius * 2 + cellSize;
  
  // Handle window resize
  function handleResize() {
    if (boardContainer) {
      const containerWidth = boardContainer.clientWidth;
      const containerHeight = boardContainer.clientHeight;
      const minDimension = Math.min(containerWidth, containerHeight);
      
      boardRadius = Math.max(150, minDimension / 2 - cellSize);
    }
  }
  
  onMount(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  
  // Calculate position of each board space
  function calculatePosition(index: number, totalSpaces: number): { x: number; y: number } {
    const angle = (index / totalSpaces) * 2 * Math.PI - Math.PI / 2;
    const x = boardRadius * Math.cos(angle);
    const y = boardRadius * Math.sin(angle);
    
    return { x, y };
  }
  
  // Handle space click
  function handleSpaceClick(index: number) {
    console.log(`Clicked on space ${index}`);
    // In a real implementation, this would trigger game actions
  }
  
  // Get tooltip text for a space
  function getSpaceTooltip(space: any): string {
    switch (space.type) {
      case 'opportunity':
        return 'Opportunity - Draw an opportunity card';
      case 'liability':
        return 'Liability - Draw a liability card';
      case 'charity':
        return 'Charity - Donate to charity';
      case 'offer':
        return 'Offer - Receive a special offer';
      case 'payday':
        return 'Payday - Collect your salary';
      case 'downsize':
        return 'Downsize - Lose your job temporarily';
      case 'child':
        return 'Child - Welcome a new family member';
      case 'dream':
        return 'Dream - Work toward your dream';
      default:
        return space.type;
    }
  }
</script>

<div class="board-container" bind:this={boardContainer}>
  <div class="board" style={`width: ${boardSize}px; height: ${boardSize}px;`}>
    {#each $gameStore.board as space, i}
      {@const position = calculatePosition(i, $gameStore.board.length)}
        <Tooltip text={getSpaceTooltip(space)}>
          <div 
            class="board-space"
            class:active={i === $currentPlayer?.position}
            style={`left: ${boardRadius + position.x}px; top: ${boardRadius + position.y}px;`}
            on:click={() => handleSpaceClick(i)}
            on:keydown={(e) => e.key === 'Enter' && handleSpaceClick(i)}
            role="button"
            tabindex="0"
          >
            <div 
              class="space-content" 
              style={`background-color: ${space.color};`}
            >
              <span class="space-type">{space.type.charAt(0)}</span>
            </div>
          </div>
        </Tooltip>
    {/each}
    
    <!-- Player tokens -->
    {#each $gameStore.players as player}
      {@const position = calculatePosition(player.position, $gameStore.board.length)}
        <div 
          class="player-token"
          style={`left: ${boardRadius + position.x}px; top: ${boardRadius + position.y}px;`}
        >
          <div 
            class="token-content"
            style={`background-color: ${getPlayerColor(player.color)};`}
          >
            {player.id}
          </div>
          {#if player.isDownsized}
            <div class="player-badge">
              <Badge variant="error" size="small">DS</Badge>
            </div>
          {/if}
        </div>
    {/each}
  </div>
</div>

<style>
  .board-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 500px;
    position: relative;
  }
  
  .board {
    position: relative;
    border-radius: 50%;
    background: #f0f0f0;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  
  .board-space {
    position: absolute;
    width: 60px;
    height: 60px;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .board-space:hover {
    transform: translate(-50%, -50%) scale(1.1);
    z-index: 10;
  }
  
  .board-space.active {
    transform: translate(-50%, -50%) scale(1.2);
    z-index: 20;
    box-shadow: 0 0 0 3px white, 0 0 0 6px var(--primary);
  }
  
  .space-content {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  .space-type {
    font-size: 1.5rem;
  }
  
  .player-token {
    position: absolute;
    width: 30px;
    height: 30px;
    transform: translate(-50%, -50%);
    z-index: 15;
  }
  
  .player-badge {
    position: absolute;
    top: -8px;
    right: -8px;
  }
  
  .token-content {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    border: 2px solid white;
  }
  
  @media (max-width: 768px) {
    .board-container {
      min-height: 400px;
    }
    
    .board-space {
      width: 50px;
      height: 50px;
    }
    
    .space-type {
      font-size: 1.2rem;
    }
    
    .player-token {
      width: 25px;
      height: 25px;
    }
  }
  
  @media (max-width: 480px) {
    .board-container {
      min-height: 300px;
    }
    
    .board-space {
      width: 40px;
      height: 40px;
    }
    
    .space-type {
      font-size: 1rem;
    }
    
    .player-token {
      width: 20px;
      height: 20px;
      font-size: 0.7rem;
    }
  }
</style>