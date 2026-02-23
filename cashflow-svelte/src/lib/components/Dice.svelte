<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  export let value: number = 1;
  export let rolling: boolean = false;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();

  let displayValue = 1;
  let rollCount = 0;
  let rollInterval: number;

  function roll() {
    if (disabled || rolling) return;
    
    dispatch('roll');
  }

  $: if (rolling && !rollInterval) {
    // Start rolling animation
    rollCount = 0;
    rollInterval = setInterval(() => {
      displayValue = Math.floor(Math.random() * 6) + 1;
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        rollInterval = undefined;
        displayValue = value;
      }
    }, 100);
  }

  $: if (!rolling && rollInterval) {
    clearInterval(rollInterval);
    rollInterval = undefined;
    displayValue = value;
  }

  $: if (!rolling) {
    displayValue = value;
  }

  // Dice face patterns (dot positions)
  const dicePatterns = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
  };
</script>

<div class="dice-container">
  <button 
    class="dice" 
    class:rolling 
    class:disabled 
    on:click={roll}
    disabled={disabled}
  >
    <svg viewBox="0 0 100 100" class="dice-face">
      <rect 
        x="5" 
        y="5" 
        width="90" 
        height="90" 
        rx="10" 
        ry="10" 
        class="dice-background"
      />
      
      {#each dicePatterns[displayValue] as [x, y]}
        <circle cx={x} cy={y} r="10" class="dice-dot" />
      {/each}
    </svg>
    
    {#if rolling}
      <div class="rolling-indicator">Rolling...</div>
    {/if}
  </button>
  
  {#if value > 0 && !rolling}
    <div class="dice-result">You rolled: {value}</div>
  {/if}
</div>

<style>
  .dice-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }

  .dice {
    width: 120px;
    height: 120px;
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease;
    position: relative;
  }

  .dice:hover:not(.disabled) {
    transform: scale(1.1);
  }

  .dice:active:not(.disabled) {
    transform: scale(0.95);
  }

  .dice.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .dice.rolling {
    animation: shake 0.5s ease-in-out infinite;
  }

  @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-15deg); }
    75% { transform: rotate(15deg); }
  }

  .dice-face {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }

  .dice-background {
    fill: white;
    stroke: #333;
    stroke-width: 2;
  }

  .dice.rolling .dice-background {
    fill: #f5f5f5;
  }

  .dice-dot {
    fill: #333;
    transition: opacity 0.1s ease;
  }

  .rolling-indicator {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: var(--font-size-small);
    color: var(--primary);
    font-weight: 600;
    white-space: nowrap;
  }

  .dice-result {
    font-size: var(--font-size-large);
    font-weight: bold;
    color: var(--on-surface);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--surface);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 600px) {
    .dice {
      width: 100px;
      height: 100px;
    }
  }
</style>