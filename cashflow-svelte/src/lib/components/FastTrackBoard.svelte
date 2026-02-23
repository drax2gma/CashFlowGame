<script lang="ts">
  import type { Player } from '$lib/stores/gameStore';
  import { getPlayerColor } from '$lib/stores/gameStore';
  import type { DreamConfig } from '$lib/data/dreams';

  export let players: Player[] = [];
  export let currentPlayerId: number | null = null;
  export let onSpaceClick: (spaceIndex: number) => void = () => {};

  // Fast Track board spaces
  const fastTrackSpaces = [
    { type: 'payday', name: 'Payday', color: '#4CAF50', multiplier: 1 },
    { type: 'opportunity', name: 'Opportunity', color: '#2196F3', multiplier: 2 },
    { type: 'dream', name: 'Dream', color: '#9C27B0', multiplier: 1 },
    { type: 'payday', name: 'Payday', color: '#4CAF50', multiplier: 1 },
    { type: 'market', name: 'Market', color: '#FF9800', multiplier: 3 },
    { type: 'opportunity', name: 'Opportunity', color: '#2196F3', multiplier: 2 },
    { type: 'payday', name: 'Payday', color: '#4CAF50', multiplier: 1 },
    { type: 'deal', name: 'Big Deal', color: '#F44336', multiplier: 5 },
    { type: 'dream', name: 'Dream', color: '#9C27B0', multiplier: 1 },
    { type: 'payday', name: 'Payday', color: '#4CAF50', multiplier: 1 },
    { type: 'market', name: 'Market', color: '#FF9800', multiplier: 3 },
    { type: 'opportunity', name: 'Opportunity', color: '#2196F3', multiplier: 2 }
  ];

  // Calculate player position on the board
  function getPlayerPosition(player: Player): { x: number; y: number } {
    // Simplified positioning for demonstration
    const angle = (player.position / fastTrackSpaces.length) * 2 * Math.PI;
    const radius = 150;
    const centerX = 200;
    const centerY = 200;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  }
</script>

<div class="fast-track-board">
  <h2>🏁 Fast Track Board</h2>
  
  <div class="board-container">
    <svg width="400" height="400" viewBox="0 0 400 400">
      <!-- Board circle -->
      <circle 
        cx="200" 
        cy="200" 
        r="180" 
        fill="#f5f5f5" 
        stroke="#333" 
        stroke-width="2"
      />
      
      <!-- Board spaces -->
      {#each fastTrackSpaces as space, i}
        {@const angle = (i / fastTrackSpaces.length) * 2 * Math.PI}
        {@const x = 200 + 160 * Math.cos(angle)}
        {@const y = 200 + 160 * Math.sin(angle)}
        
        <g 
          on:click={() => onSpaceClick(i)}
          on:keydown={(e) => e.key === 'Enter' && onSpaceClick(i)}
          role="button"
          tabindex="0"
        >
          <circle 
            cx={x} 
            cy={y} 
            r="20" 
            fill={space.color}
            stroke="#fff"
            stroke-width="2"
            class="space"
          />
          <text 
            x={x} 
            y={y + 5} 
            text-anchor="middle" 
            font-size="12" 
            fill="white"
            font-weight="bold"
          >
            {#if space.type === 'payday'}
              💰
            {:else if space.type === 'opportunity'}
              📈
            {:else if space.type === 'dream'}
              🌟
            {:else if space.type === 'market'}
              📊
            {:else if space.type === 'deal'}
              💼
            {/if}
          </text>
        </g>
      {/each}
      
      <!-- Player tokens -->
      {#each players as player}
        {@const position = getPlayerPosition(player)}
        <g>
          <circle 
            cx={position.x} 
            cy={position.y} 
            r="15" 
            fill={getPlayerColor(player.color)}
            stroke={currentPlayerId === player.id ? "#fff" : "none"}
            stroke-width="3"
          />
          <text 
            x={position.x} 
            y={position.y + 5} 
            text-anchor="middle" 
            font-size="12" 
            fill="white"
            font-weight="bold"
          >
            {player.id}
          </text>
        </g>
      {/each}
    </svg>
  </div>
  
  <div class="legend">
    <h3>Space Types</h3>
    <div class="legend-items">
      <div class="legend-item">
        <div class="legend-color" style="background-color: #4CAF50;"></div>
        <span>Payday - Collect income</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #2196F3;"></div>
        <span>Opportunity - Draw opportunity cards</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #9C27B0;"></div>
        <span>Dream - Work toward your dream</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #FF9800;"></div>
        <span>Market - Market fluctuations</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #F44336;"></div>
        <span>Big Deal - Major investment opportunities</span>
      </div>
    </div>
  </div>
</div>

<style>
  .fast-track-board {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .fast-track-board h2 {
    text-align: center;
    color: var(--on-surface);
    margin-top: 0;
  }
  
  .board-container {
    display: flex;
    justify-content: center;
    margin: 1.5rem 0;
  }
  
  .space {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .space:hover {
    transform: scale(1.2);
  }
  
  .legend {
    background: var(--background);
    border-radius: 8px;
    padding: 1rem;
  }
  
  .legend h3 {
    margin-top: 0;
    color: var(--on-surface);
  }
  
  .legend-items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .legend-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  
  @media (max-width: 768px) {
    .legend-items {
      grid-template-columns: 1fr;
    }
  }
</style>