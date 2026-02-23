<script lang="ts">
  import { gameActions, gameStore } from '$lib/stores/gameStore';
  import type { Player, Asset, Liability } from '$lib/stores/gameStore';
  import { notify } from '$lib/stores/notificationStore';
  import Button from '$lib/components/Button.svelte';
  import Translate from '$lib/components/Translate.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { audioManager } from '$lib/audio/AudioManager';

  export let player: Player;
  export let show: boolean = false;

  let showBuyModal = false;
  let showSellModal = false;
  let selectedAsset: Asset | null = null;
  let selectedLiability: Liability | null = null;

  // Predefined assets that players can buy
  const availableAssets = [
    { id: 'stock-1', name: 'XYZ Stock', type: 'stock' as const, value: 1000, income: 100 },
    { id: 'stock-2', name: 'ABC Stock', type: 'stock' as const, value: 2000, income: 200 },
    { id: 'real-estate-1', name: '2BR Condo', type: 'realEstate' as const, value: 50000, income: 500 },
    { id: 'real-estate-2', name: '4 Plex', type: 'realEstate' as const, value: 100000, income: 1000 },
    { id: 'business-1', name: 'Laundromat', type: 'business' as const, value: 50000, income: 500 },
    { id: 'business-2', name: 'Pizza Franchise', type: 'business' as const, value: 75000, income: 750 }
  ];

  // Predefined liabilities that players can take
  const availableLiabilities = [
    { id: 'loan-1', name: 'Bank Loan', type: 'loan' as const, amount: 5000, payment: 500 },
    { id: 'loan-2', name: 'Car Loan', type: 'loan' as const, amount: 10000, payment: 200 },
    { id: 'credit-1', name: 'Credit Card', type: 'credit' as const, amount: 2000, payment: 100 }
  ];

  function openBuyModal() {
    showBuyModal = true;
  }

  function closeBuyModal() {
    showBuyModal = false;
    selectedAsset = null;
  }

  function openSellModal(asset: Asset) {
    selectedAsset = asset;
    showSellModal = true;
  }

  function closeSellModal() {
    showSellModal = false;
    selectedAsset = null;
  }

  function buyAsset(asset: Asset) {
    if (player.cash >= asset.value) {
      gameActions.addAsset(player.id, asset);
      audioManager.playSfx('success');
      notify.success(`Bought ${asset.name} for $${asset.value.toLocaleString()}!`, 4000);
      closeBuyModal();
    } else {
      audioManager.playSfx('error');
      notify.error(`Not enough cash! You need $${asset.value.toLocaleString()}`, 3000);
    }
  }

  function sellAsset(asset: Asset) {
    // Remove asset and add cash
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
      if (playerIndex !== -1) {
        const player = updatedPlayers[playerIndex];
        updatedPlayers[playerIndex] = {
          ...player,
          assets: player.assets.filter(a => a.id !== asset.id),
          cash: player.cash + asset.value
        };
      }
      return { ...state, players: updatedPlayers };
    });
    
    audioManager.playSfx('cash-receive');
    notify.success(`Sold ${asset.name} for $${asset.value.toLocaleString()}!`, 4000);
    closeSellModal();
  }

  function takeLiability(liability: Liability) {
    if (player.loanApproval) {
      gameActions.addLiability(player.id, liability);
      audioManager.playSfx('success');
      notify.success(`Took ${liability.name} for $${liability.amount.toLocaleString()}!`, 4000);
    } else {
      audioManager.playSfx('error');
      notify.error('You are not eligible for loans!', 3000);
    }
  }

  function payOffLiability(liability: Liability) {
    if (player.cash >= liability.amount) {
      // Remove liability and deduct cash
      gameStore.update(state => {
        const updatedPlayers = [...state.players];
        const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
        if (playerIndex !== -1) {
          const player = updatedPlayers[playerIndex];
          updatedPlayers[playerIndex] = {
            ...player,
            liabilities: player.liabilities.filter(l => l.id !== liability.id),
            cash: player.cash - liability.amount
          };
        }
        return { ...state, players: updatedPlayers };
      });
      
      audioManager.playSfx('cash-spend');
      notify.success(`Paid off ${liability.name} for $${liability.amount.toLocaleString()}!`, 4000);
    } else {
      audioManager.playSfx('error');
      notify.error(`Not enough cash to pay off ${liability.name}!`, 3000);
    }
  }
</script>

<div class="asset-liability-manager" class:visible={show}>
  <h3><Translate key="assets.manage" /></h3>
  
  <div class="section">
    <div class="section-header">
      <h4><Translate key="assets.yourAssets" /></h4>
      <Button on:click={openBuyModal} size="small">
        <Translate key="assets.buy" />
      </Button>
    </div>
    
    {#if player.assets.length > 0}
      <div class="assets-grid">
        {#each player.assets as asset}
          <div class="asset-card">
            <div class="asset-header">
              <span class="asset-name">{asset.name}</span>
              <span class="asset-type">{asset.type}</span>
            </div>
            <div class="asset-details">
              <div class="detail-row">
                <span><Translate key="assets.value" />:</span>
                <span>${asset.value.toLocaleString()}</span>
              </div>
              {#if asset.income}
                <div class="detail-row">
                  <span><Translate key="assets.income" />:</span>
                  <span class="positive">+${asset.income.toLocaleString()}/mo</span>
                </div>
              {/if}
            </div>
            <div class="asset-actions">
              <Button 
                on:click={() => openSellModal(asset)} 
                variant="secondary" 
                size="small"
              >
                <Translate key="assets.sell" />
              </Button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="empty-message"><Translate key="assets.noAssets" /></p>
    {/if}
  </div>
  
  <div class="section">
    <div class="section-header">
      <h4><Translate key="liabilities.yourLiabilities" /></h4>
    </div>
    
    {#if player.liabilities.length > 0}
      <div class="liabilities-grid">
        {#each player.liabilities as liability}
          <div class="liability-card">
            <div class="liability-header">
              <span class="liability-name">{liability.name}</span>
              <span class="liability-type">{liability.type}</span>
            </div>
            <div class="liability-details">
              <div class="detail-row">
                <span><Translate key="liabilities.amount" />:</span>
                <span>${liability.amount.toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span><Translate key="liabilities.payment" />:</span>
                <span>-${liability.payment.toLocaleString()}/mo</span>
              </div>
            </div>
            <div class="liability-actions">
              <Button 
                on:click={() => payOffLiability(liability)} 
                variant="success" 
                size="small"
              >
                <Translate key="liabilities.payOff" />
              </Button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="empty-message"><Translate key="liabilities.noLiabilities" /></p>
    {/if}
  </div>
</div>

<!-- Buy Asset Modal -->
<Modal 
  open={showBuyModal} 
  on:close={closeBuyModal}
  title="Buy Asset"
>
  <div class="buy-modal-content">
    <h4><Translate key="assets.availableAssets" /></h4>
    <div class="assets-grid">
      {#each availableAssets as asset}
        <div class="asset-card">
          <div class="asset-header">
            <span class="asset-name">{asset.name}</span>
            <span class="asset-type">{asset.type}</span>
          </div>
          <div class="asset-details">
            <div class="detail-row">
              <span><Translate key="assets.value" />:</span>
              <span>${asset.value.toLocaleString()}</span>
            </div>
            {#if asset.income}
              <div class="detail-row">
                <span><Translate key="assets.income" />:</span>
                <span class="positive">+${asset.income.toLocaleString()}/mo</span>
              </div>
            {/if}
          </div>
          <div class="asset-actions">
            <Button 
              on:click={() => buyAsset(asset)} 
              disabled={player.cash < asset.value}
            >
              <Translate key="assets.buy" /> (${asset.value.toLocaleString()})
            </Button>
          </div>
        </div>
      {/each}
    </div>
    
    <h4><Translate key="liabilities.takeLiability" /></h4>
    <div class="liabilities-grid">
      {#each availableLiabilities as liability}
        <div class="liability-card">
          <div class="liability-header">
            <span class="liability-name">{liability.name}</span>
            <span class="liability-type">{liability.type}</span>
          </div>
          <div class="liability-details">
            <div class="detail-row">
              <span><Translate key="liabilities.amount" />:</span>
              <span>${liability.amount.toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span><Translate key="liabilities.payment" />:</span>
              <span>-${liability.payment.toLocaleString()}/mo</span>
            </div>
          </div>
          <div class="liability-actions">
            <Button 
              on:click={() => takeLiability(liability)} 
              disabled={!player.loanApproval}
            >
              <Translate key="liabilities.take" />
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</Modal>

<!-- Sell Asset Modal -->
<Modal 
  open={showSellModal && !!selectedAsset} 
  on:close={closeSellModal}
  title="Sell Asset"
>
  {#if selectedAsset}
    <div class="sell-modal-content">
      <p><Translate key="assets.confirmSell" values={{ name: selectedAsset.name }} /></p>
      <p><Translate key="assets.sellValue" values={{ value: selectedAsset.value.toLocaleString() }} /></p>
      <div class="modal-actions">
        <Button on:click={() => sellAsset(selectedAsset!)} variant="success">
          <Translate key="assets.sell" />
        </Button>
        <Button on:click={closeSellModal} variant="secondary">
          <Translate key="general.cancel" />
        </Button>
      </div>
    </div>
  {/if}
</Modal>

<style>
  .asset-liability-manager {
    background: var(--surface);
    border-radius: 8px;
    padding: var(--spacing-lg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: var(--font-family);
    display: none;
  }

  .asset-liability-manager.visible {
    display: block;
  }

  .asset-liability-manager h3 {
    margin-top: 0;
    border-bottom: 1px solid var(--outline);
    padding-bottom: var(--spacing-sm);
    color: var(--on-surface);
  }

  .section {
    margin-bottom: var(--spacing-xl);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }

  .section-header h4 {
    margin: 0;
    color: var(--on-surface);
  }

  .assets-grid,
  .liabilities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-md);
  }

  .asset-card,
  .liability-card {
    background: var(--background);
    border-radius: 8px;
    padding: var(--spacing-md);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .asset-header,
  .liability-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
  }

  .asset-name,
  .liability-name {
    font-weight: bold;
    color: var(--on-surface);
  }

  .asset-type,
  .liability-type {
    font-size: var(--font-size-small);
    color: var(--primary);
    background: var(--primary-container);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .asset-details,
  .liability-details {
    margin-bottom: var(--spacing-sm);
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-small);
    margin-bottom: var(--spacing-xs);
  }

  .detail-row .positive {
    color: var(--success);
  }

  .asset-actions,
  .liability-actions {
    display: flex;
    justify-content: flex-end;
  }

  .empty-message {
    text-align: center;
    color: var(--outline);
    font-style: italic;
    padding: var(--spacing-lg);
  }

  .buy-modal-content,
  .sell-modal-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .buy-modal-content h4 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--on-surface);
  }

  .modal-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
  }

  @media (max-width: 768px) {
    .assets-grid,
    .liabilities-grid {
      grid-template-columns: 1fr;
    }
  }
</style>