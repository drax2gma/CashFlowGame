<script lang="ts">
  import { gameStore, currentPlayer, currentPlayerFinance, gameActions, type Card } from '$lib/stores/gameStore';
  import { notify } from '$lib/stores/notificationStore';
  import { onMount } from 'svelte';
  import GameBoard from '$lib/components/GameBoard.svelte';
  import FastTrackBoard from '$lib/components/FastTrackBoard.svelte';

  import CardCollection from '$lib/components/CardCollection.svelte';
  import Translate from '$lib/components/Translate.svelte';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Dice from '$lib/components/Dice.svelte';
  import FinancialDashboard from '$lib/components/FinancialDashboard.svelte';
  import AssetLiabilityManager from '$lib/components/AssetLiabilityManager.svelte';
  import CharityModal from '$lib/components/CharityModal.svelte';
  import DownsizeModal from '$lib/components/DownsizeModal.svelte';
  import ChildModal from '$lib/components/ChildModal.svelte';
  import DreamSelectionModal from '$lib/components/DreamSelectionModal.svelte';
  import { dreamConfigs } from '$lib/data/dreams';
  import { audioManager } from '$lib/audio/AudioManager';
  
  // Game state
  let diceValue = 0;
  let isRolling = false;
  let showCard = false;
  let showAssetsLiabilities = false;
  let showCharityModal = false;
  let showDownsizeModal = false;
  let showChildModal = false;
  let showDreamSelection = false;
  let currentCard: Card | null = null;
  
  // Roll dice function
  function rollDice() {
    if (isRolling) return;
    
    isRolling = true;
    
    // Play dice roll sound
    audioManager.playSfx('dice-roll');
    
    // Simulate dice rolling animation
    setTimeout(() => {
      // Generate random dice value between 1 and 6
      diceValue = Math.floor(Math.random() * 6) + 1;
      
      // Move player
      if ($gameStore.phase === 'fastTrack') {
        gameActions.moveFastTrackPlayer($currentPlayer.id, diceValue);
      } else {
        gameActions.movePlayer($currentPlayer.id, diceValue);
      }
      
      // Show notification
      notify.info(`You rolled a ${diceValue}!`, 3000);
      
      // Process space action
      processSpaceAction();
      
      isRolling = false;
    }, 1000);
  }
  
  function handleDiceRoll() {
    rollDice();
  }
  
  // Process action based on the space the player landed on
  function processSpaceAction() {
    if ($gameStore.phase === 'fastTrack') {
      // Process fast track space action
      processFastTrackSpaceAction();
      return;
    }
    
    const space = $gameStore.board[$currentPlayer.position];
    
    switch (space.type) {
      case 'payday':
        gameActions.processPayday($currentPlayer.id);
        audioManager.playSfx('cash-receive');
        notify.info('Payday! You received your salary.', 3000);
        break;
      case 'opportunity':
      case 'offer':
        // Draw a card
        drawCard();
        break;
      case 'liability':
        // Draw a liability card
        drawCard();
        break;
      case 'charity':
        // Process charity action
        gameActions.processCharity($currentPlayer.id);
        showCharityModal = true;
        audioManager.playSfx('success');
        break;
      case 'downsize':
        // Process downsize action
        gameActions.processDownsize($currentPlayer.id);
        showDownsizeModal = true;
        audioManager.playSfx('error');
        break;
      case 'child':
        // Process child action
        gameActions.processChild($currentPlayer.id);
        showChildModal = true;
        audioManager.playSfx('success');
        break;
      case 'dream':
        // Process dream action (for fast track)
        gameActions.processDream($currentPlayer.id);
        audioManager.playSfx('success');
        notify.info('You landed on a dream space!', 3000);
        break;
    }
  }
  
  // Process fast track space action
  function processFastTrackSpaceAction() {
    // For now, we'll use a simplified fast track board representation
    const fastTrackSpaces = [
      'payday', 'opportunity', 'dream', 'payday', 
      'market', 'opportunity', 'payday', 'deal', 
      'dream', 'payday', 'market', 'opportunity'
    ];
    
    const spaceIndex = $currentPlayer.position % fastTrackSpaces.length;
    const spaceType = fastTrackSpaces[spaceIndex];
    
    switch (spaceType) {
      case 'payday':
        gameActions.processFastTrackPayday($currentPlayer.id, 2); // 2x multiplier
        audioManager.playSfx('cash-receive');
        notify.info('Fast Track Payday! You received double your passive income.', 3000);
        break;
      case 'opportunity':
        // Draw a card
        drawCard();
        break;
      case 'dream':
        // Show dream selection
        showDreamSelection = true;
        audioManager.playSfx('success');
        notify.info('Dream space! Choose your dream.', 3000);
        break;
      case 'market':
        // Market fluctuation - could affect assets
        audioManager.playSfx('card-deal');
        notify.info('Market fluctuation! Your assets may have changed value.', 3000);
        break;
      case 'deal':
        // Big deal opportunity
        drawCard();
        break;
    }
  }
  
  // Draw a card
  function drawCard() {
    const card = gameActions.drawCard();
    if (card) {
      currentCard = card;
      showCard = true;
      
      // Play card deal sound
      audioManager.playSfx('card-deal');
      
      // Show notification
      notify.info(`You drew a ${card.type} card!`, 3000);
    }
  }
  
  // Close card modal
  function closeCard() {
    showCard = false;
    currentCard = null;
  }
  
  // Handle card action (buy/sell/pass)
  function handleCardAction(action: string) {
    if (!currentCard) return;
    
    switch (action) {
      case 'buy':
        // Process the purchase based on card type
        if (currentCard.type === 'small-deal' || currentCard.type === 'big-deal') {
          // Check if player has enough cash for down payment
          const downPayment = currentCard.downPayment || currentCard.cost || 0;
          
          if ($currentPlayer && $currentPlayer.cash >= downPayment) {
            // Create asset from card
            const asset = {
              id: `asset-${Date.now()}`,
              type: currentCard.landType?.includes('Br') ? 'realEstate' : 
                    currentCard.landType?.includes('plex') ? 'realEstate' :
                    currentCard.landType === 'business' ? 'business' :
                    currentCard.symbol ? 'stock' : 'personal',
              name: currentCard.title,
              value: currentCard.cost || 0,
              income: currentCard.cashFlow || 0,
              liability: currentCard.mortgage ? `mortgage-${Date.now()}` : undefined
            };
            
            // Add asset to player
            gameActions.addAsset($currentPlayer.id, asset);
            
            // Add mortgage as liability if exists
            if (currentCard.mortgage && currentCard.mortgage > 0) {
              const liability = {
                id: `liability-${Date.now()}`,
                type: 'mortgage' as const,
                name: `Mortgage: ${currentCard.title}`,
                amount: currentCard.mortgage,
                payment: Math.round(currentCard.mortgage * 0.005) // Approximate monthly payment
              };
              gameActions.addLiability($currentPlayer.id, liability);
            }
            
            // Update player income
            if (currentCard.cashFlow && currentCard.cashFlow > 0) {
              gameStore.update(state => {
                const updatedPlayers = [...state.players];
                const playerIndex = updatedPlayers.findIndex(p => p.id === $currentPlayer.id);
                if (playerIndex !== -1) {
                  updatedPlayers[playerIndex] = {
                    ...updatedPlayers[playerIndex],
                    income: updatedPlayers[playerIndex].income + currentCard.cashFlow!
                  };
                }
                return { ...state, players: updatedPlayers };
              });
            }
            
            audioManager.playSfx('success');
            notify.success(`You bought ${currentCard.title}! Cash flow: +$${currentCard.cashFlow || 0}/month`, 4000);
          } else {
            audioManager.playSfx('error');
            notify.error(`Not enough cash! You need $${downPayment.toLocaleString()}`, 3000);
            return; // Don't close the card
          }
        } else if (currentCard.type === 'doodad') {
          // Pay the doodad cost
          if ($currentPlayer) {
            const cost = currentCard.cost || 0;
            if ($currentPlayer.cash >= cost) {
              gameStore.update(state => {
                const updatedPlayers = [...state.players];
                const playerIndex = updatedPlayers.findIndex(p => p.id === $currentPlayer.id);
                if (playerIndex !== -1) {
                  updatedPlayers[playerIndex] = {
                    ...updatedPlayers[playerIndex],
                    cash: updatedPlayers[playerIndex].cash - cost
                  };
                }
                return { ...state, players: updatedPlayers };
              });
              audioManager.playSfx('cash-spend');
              notify.warning(`You spent $${cost.toLocaleString()} on ${currentCard.title}`, 3000);
            } else {
              audioManager.playSfx('error');
              notify.error(`Not enough cash to pay $${cost.toLocaleString()}!`, 3000);
              return;
            }
          }
        }
        break;
        
      case 'sell':
        // Handle selling assets (for offer cards)
        if (currentCard.type === 'offer' && $currentPlayer) {
          // Find matching assets to sell
          const matchingAssets = $currentPlayer.assets.filter(a => 
            a.type === currentCard.landType || 
            (currentCard.offerPerUnit && a.type === 'realEstate')
          );
          
          if (matchingAssets.length > 0) {
            // For simplicity, sell the first matching asset
            const assetToSell = matchingAssets[0];
            const salePrice = currentCard.offer || (currentCard.offerPerUnit || 0) * (assetToSell.value / 10000);
            
            // Remove asset and add cash
            gameStore.update(state => {
              const updatedPlayers = [...state.players];
              const playerIndex = updatedPlayers.findIndex(p => p.id === $currentPlayer.id);
              if (playerIndex !== -1) {
                const player = updatedPlayers[playerIndex];
                updatedPlayers[playerIndex] = {
                  ...player,
                  assets: player.assets.filter(a => a.id !== assetToSell.id),
                  cash: player.cash + salePrice
                };
              }
              return { ...state, players: updatedPlayers };
            });
            
            audioManager.playSfx('cash-receive');
            notify.success(`Sold ${assetToSell.name} for $${salePrice.toLocaleString()}!`, 3000);
          } else {
            notify.info(`You don't have any ${currentCard.landType} to sell.`, 3000);
            return;
          }
        }
        break;
        
      case 'pass':
        console.log(`Passing card: ${currentCard.title}`);
        audioManager.playSfx('card-flip');
        notify.info(`You passed on ${currentCard.title}.`, 3000);
        break;
    }
    
    closeCard();
  }
  
  // End current player's turn
  function endTurn() {
    gameActions.nextPlayer();
    diceValue = 0;
    
    // Play turn end sound
    audioManager.playSfx('turn-start');
  }
  
  // Initialize game with sample players if none exist
  onMount(() => {
    if ($gameStore.players.length === 0) {
      gameActions.initializeGame([
        { id: 1, name: 'Player 1', color: 'Blue', job: 'Engineer', insurance: true },
        { id: 2, name: 'Player 2', color: 'Red', job: 'Doctor', insurance: false }
      ]);
      
      // Show notification
      notify.success('Game initialized with sample players!', 5000);
    }
  });
</script>

<div class="game-page">
  <!-- Screen size warning for small screens/portrait mode -->
  <div class="screen-warning">
    <div class="warning-content">
      <div class="warning-icon">📱</div>
      <h2>Screen Too Small</h2>
      <p>This game is optimized for desktop and tablet screens in landscape orientation.</p>
      <p class="warning-hint">Please rotate your device or use a larger screen for the best experience.</p>
      <div class="warning-specs">
        <span>Minimum width: 768px</span>
        <span>•</span>
        <span>Landscape orientation required</span>
      </div>
    </div>
  </div>

  <header class="header">
    <h1><Translate key="navigation.game" /></h1>
    <div class="game-info">
      <span><Translate key="game.turn" values={{ number: $gameStore.turn }} /></span>
      <span><Translate key="game.currentPlayer" values={{ name: $currentPlayer?.name || '' }} /></span>
    </div>
  </header>

  <main class="main-content">
    <div class="game-area">
      {#if $gameStore.phase === 'fastTrack'}
        <FastTrackBoard 
          players={$gameStore.players} 
          currentPlayerId={$currentPlayer.id}
          on:spaceClick={(spaceIndex) => console.log('Clicked space:', spaceIndex)}
        />
      {:else}
        <GameBoard />
      {/if}
    </div>
    
    <div class="game-controls">
      <div class="dice-section">
        <Dice 
        value={diceValue}
        rolling={isRolling}
        disabled={diceValue > 0 || isRolling}
        on:roll={handleDiceRoll}
      />
      
      <!-- Financial Dashboard -->
      {#if $currentPlayer}
        <FinancialDashboard player={$currentPlayer} compact={true} />
      {/if}
      
      <div class="finance-actions">
        <Button on:click={() => showAssetsLiabilities = !showAssetsLiabilities} variant="secondary" size="small">
          <Translate key="assets.manage" />
        </Button>
      </div>
      
      <!-- Asset/Liability Manager -->
      {#if showAssetsLiabilities && $currentPlayer}
        <AssetLiabilityManager player={$currentPlayer} show={showAssetsLiabilities} />
      {/if}
      
      <!-- Player's card collection -->
      {#if $currentPlayer}
        <div class="card-collection-section">
          <CardCollection 
            assets={$currentPlayer.assets}
            liabilities={$currentPlayer.liabilities}
            title={"<Translate key=\"cards.yourCards\" />"}
            emptyMessage={"<Translate key=\"cards.noCards\" />"}
          />
        </div>
      {/if}
      
      <Button on:click={endTurn} fullWidth>
        <Translate key="game.endTurn" />
      </Button>
    </div>
  </main>
  
  <!-- Card Modal -->
  <Modal 
    open={showCard && !!currentCard} 
    on:close={closeCard}
    title={currentCard?.title || ''}
    size="small"
  >
    <div class="card-modal-content">
      {#if currentCard}
        <Card 
          type={currentCard.type}
          title={currentCard.title}
          description={currentCard.description}
          amount={currentCard.amount}
          flipped={true}
        />
        
        <!-- Show additional card details -->
        <div class="card-details">
          {#if currentCard.rule}
            <p class="rule">{currentCard.rule}</p>
          {/if}
          
          {#if currentCard.symbol}
            <p><strong>Symbol:</strong> {currentCard.symbol}</p>
          {/if}
          
          {#if currentCard.price}
            <p><strong>Price:</strong> ${currentCard.price.toLocaleString()}</p>
          {/if}
          
          {#if currentCard.range}
            <p><strong>Trading Range:</strong> {currentCard.range}</p>
          {/if}
          
          {#if currentCard.downPayment}
            <p><strong>Down Payment:</strong> ${currentCard.downPayment.toLocaleString()}</p>
          {/if}
          
          {#if currentCard.mortgage}
            <p><strong>Mortgage:</strong> ${currentCard.mortgage.toLocaleString()}</p>
          {/if}
          
          {#if currentCard.cashFlow}
            <p class="cash-flow"><strong>Cash Flow:</strong> +${currentCard.cashFlow.toLocaleString()}/month</p>
          {/if}
          
          {#if currentCard.ROI}
            <p><strong>ROI:</strong> {(currentCard.ROI * 100).toFixed(0)}%</p>
          {/if}
          
          {#if currentCard.units}
            <p><strong>Units:</strong> {currentCard.units}</p>
          {/if}
          
          {#if currentCard.offer}
            <p class="offer"><strong>Offer:</strong> ${currentCard.offer.toLocaleString()}</p>
          {/if}
          
          {#if currentCard.offerPerUnit}
            <p class="offer"><strong>Offer:</strong> ${currentCard.offerPerUnit.toLocaleString()} per unit</p>
          {/if}
        </div>
      {/if}
    </div>
    
    <svelte:fragment slot="footer">
      <div class="card-actions">
        {#if currentCard?.type === 'offer'}
          <!-- Offer cards can be sold or passed -->
          <Button variant="success" on:click={() => handleCardAction('sell')}>
            <Translate key="cards.sell" />
          </Button>
        {:else if currentCard?.cost || currentCard?.downPayment}
          <!-- Deal cards can be bought or passed -->
          <Button variant="success" on:click={() => handleCardAction('buy')}>
            <Translate key="cards.buy" /> (${(currentCard.downPayment || currentCard.cost || 0).toLocaleString()})
          </Button>
        {:else if currentCard?.type === 'doodad'}
          <!-- Doodad cards must be paid -->
          <Button variant="warning" on:click={() => handleCardAction('buy')}>
            <Translate key="cards.pay" /> (${(currentCard.cost || 0).toLocaleString()})
          </Button>
        {/if}
        
        <Button variant="secondary" on:click={() => handleCardAction('pass')}>
          <Translate key="cards.pass" />
        </Button>
      </div>
    </svelte:fragment>
  </Modal>
</div>

<CharityModal 
  show={showCharityModal} 
  player={$currentPlayer} 
  on:donate={() => {
    showCharityModal = false;
    notify.info('Thank you for your charitable donation!', 3000);
  }}
  on:close={() => showCharityModal = false}
/>

<DownsizeModal 
  show={showDownsizeModal} 
  player={$currentPlayer} 
  on:close={() => showDownsizeModal = false}
/>

<ChildModal 
  show={showChildModal} 
  player={$currentPlayer} 
  on:close={() => showChildModal = false}
/>

<DreamSelectionModal 
  show={showDreamSelection} 
  player={$currentPlayer} 
  on:select={(dream) => {
    console.log('Selected dream:', dream);
  }}
  on:purchase={(dream) => {
    gameActions.purchaseDream($currentPlayer.id, dream);
    showDreamSelection = false;
    notify.success(`You purchased your dream: ${dream.name}!`, 4000);
    // Check win condition
    const hasWon = gameActions.checkWinCondition($currentPlayer.id);
    if (hasWon) {
      notify.success('Congratulations! You won the game!', 5000);
    }
  }}
  on:close={() => showDreamSelection = false}
/>

<style>
  .game-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--background);
    color: var(--on-background);
    font-family: var(--font-family);
  }

  /* Screen warning - hidden by default, shown on small screens */
  .screen-warning {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    z-index: 9999;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: var(--spacing-lg);
  }

  .warning-content {
    max-width: 400px;
    padding: var(--spacing-xl);
  }

  .warning-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
    animation: shake 2s ease-in-out infinite;
  }

  .warning-content h2 {
    color: #fdd835;
    margin-bottom: var(--spacing-md);
    font-size: 1.5rem;
  }

  .warning-content p {
    color: #e0e0e0;
    margin-bottom: var(--spacing-sm);
    line-height: 1.6;
  }

  .warning-hint {
    color: #81c784;
    font-weight: 500;
  }

  .warning-specs {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
    font-size: 0.875rem;
    color: #9e9e9e;
  }

  @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
  }

  /* Show warning on small screens or portrait mode */
  @media (max-width: 767px), (orientation: portrait) and (max-width: 1023px) {
    .screen-warning {
      display: flex;
    }
    
    .header,
    .main-content {
      display: none;
    }
  }

  .header {
    background-color: var(--primary);
    color: var(--on-primary);
    padding: var(--spacing-lg);
    text-align: center;
  }

  .header h1 {
    margin: 0 0 var(--spacing-sm) 0;
  }

  .game-info {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-medium);
    opacity: 0.9;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-md);
    gap: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .game-area {
    flex: 1;
    min-height: 400px;
    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-md);
  }

  .game-controls {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    background-color: var(--surface);
    border-radius: 8px;
    padding: var(--spacing-lg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-height: 300px;
  }

  .dice-section {
    text-align: center;
  }

  .finance-actions {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
    justify-content: center;
  }

  .financial-statements {
    margin: var(--spacing-lg) 0;
  }

  @media (max-width: 768px) {
    .financial-statements {
      margin: var(--spacing-md) 0;
    }
  }

  .card-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    width: 100%;
  }

  .card-modal-content {
    display: flex;
    justify-content: center;
  }

  .card-collection-section {
    margin-top: var(--spacing-lg);
  }

  .card-details {
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--surface-variant);
    border-radius: 8px;
  }

  .card-details p {
    margin: var(--spacing-xs) 0;
    font-size: var(--font-size-small);
  }

  .card-details .rule {
    font-style: italic;
    color: var(--on-surface-variant);
    margin-bottom: var(--spacing-sm);
    padding: var(--spacing-sm);
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  .card-details .cash-flow {
    color: #4CAF50;
    font-weight: bold;
    font-size: var(--font-size-medium);
  }

  .card-details .offer {
    color: #2196F3;
    font-weight: bold;
    font-size: var(--font-size-medium);
  }
  
  /* Desktop and landscape tablet layout - enforced minimum */
  @media (min-width: 768px) and (orientation: landscape) {
    .main-content {
      flex-direction: row;
    }
    
    .game-area {
      flex: 3;
      min-height: 500px;
    }
    
    .game-controls {
      flex: 1;
      min-width: 300px;
      max-width: 400px;
    }
    
    .card-actions {
      flex-direction: row;
    }
  }

  /* Large desktop optimization */
  @media (min-width: 1200px) {
    .main-content {
      gap: var(--spacing-xl);
    }
    
    .game-area {
      min-height: 600px;
    }
    
    .game-controls {
      min-width: 350px;
    }
  }
</style>