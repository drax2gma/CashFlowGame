<script lang="ts">
  import { onMount } from 'svelte';
  
  // Card properties
  export let type: 'small-deal' | 'big-deal' | 'opportunity' | 'doodad' | 'charity' | 'paycheck' | 'downsized' = 'small-deal';
  export let title: string = '';
  export let description: string = '';
  export let amount: number | string = 0;
  export let flipped: boolean = false;
  export let width: number = 280;
  export let height: number = 400;
  
  // Card type configurations
  const cardTypes = {
    'small-deal': {
      color: '#4CAF50',
      icon: '💰',
      border: 'solid'
    },
    'big-deal': {
      color: '#2196F3',
      icon: '🏢',
      border: 'solid'
    },
    'opportunity': {
      color: '#FF9800',
      icon: '🎯',
      border: 'dashed'
    },
    'doodad': {
      color: '#E91E63',
      icon: '🛍️',
      border: 'solid'
    },
    'charity': {
      color: '#9C27B0',
      icon: '❤️',
      border: 'double'
    },
    'paycheck': {
      color: '#FFC107',
      icon: '💵',
      border: 'solid'
    },
    'downsized': {
      color: '#F44336',
      icon: '⚠️',
      border: 'solid'
    }
  };
  
  // Get card configuration
  $: cardConfig = cardTypes[type];
  
  // Handle card flip
  function toggleFlip() {
    flipped = !flipped;
  }
  
  // Handle hover effects
  let isHovered = false;
  
  function handleMouseEnter() {
    isHovered = true;
  }
  
  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<div 
  class="card-container"
  role="button"
  tabindex="0"
  on:click={toggleFlip}
  on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(); } }}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <div class={`card ${flipped ? 'flipped' : ''} ${isHovered ? 'hovered' : ''}`} style={`width: ${width}px; height: ${height}px; --card-color-alpha: ${cardConfig.color}40;`}>
    <div class="card-face card-front" style={`border-color: ${cardConfig.color};`}>
      <div class="card-header">
        <span class="card-icon">{cardConfig.icon}</span>
        <span class="card-type">{type.replace('-', ' ')}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">{title}</h3>
        <p class="card-description">{description}</p>
        {#if amount}
          <div class="card-amount">Amount: ${amount}</div>
        {/if}
      </div>
      <div class="card-footer">
        <small>Click to flip</small>
      </div>
    </div>
    <div class="card-face card-back" style={`background-color: ${cardConfig.color};`}>
      <div class="card-back-content">
        <div class="card-back-icon">{cardConfig.icon}</div>
        <div class="card-back-text">CARD BACK</div>
      </div>
    </div>
  </div>
</div>

<style>
  .card-container {
    display: inline-block;
    perspective: 1000px;
    margin: var(--spacing-md);
  }

  .card {
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .card.flipped {
    transform: rotateY(180deg);
  }

  .card.hovered {
    transform: translateY(-10px) rotateX(5deg);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 30px var(--card-color-alpha);
  }

  .card.hovered.flipped {
    transform: translateY(-10px) rotateY(180deg) rotateX(5deg);
  }

  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-md);
    overflow: hidden;
  }

  .card-front {
    background: var(--surface);
    border: 2px solid;
    border-color: #ccc;
  }

  .card-back {
    background: #2196F3;
    transform: rotateY(180deg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid #eee;
  }

  .card-icon {
    font-size: 1.5rem;
  }

  .card-type {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .card-title {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: 1.2rem;
    color: var(--on-surface);
  }

  .card-description {
    flex: 1;
    margin: 0 0 var(--spacing-md) 0;
    font-size: 0.9rem;
    color: var(--on-surface);
  }

  .card-amount {
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--success);
    text-align: center;
    padding: var(--spacing-sm);
    background: rgba(76, 175, 80, 0.1);
    border-radius: 4px;
  }

  .card-footer {
    text-align: center;
    font-size: 0.7rem;
    color: #999;
    margin-top: auto;
  }

  .card-back-content {
    text-align: center;
  }

  .card-back-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
  }

  .card-back-text {
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card-container {
      margin: var(--spacing-sm);
    }
    
    .card-front, .card-back {
      padding: var(--spacing-sm);
    }
  }

  @media (max-width: 480px) {
    .card-container {
      width: 180px;
      height: 260px;
    }
  }
</style>