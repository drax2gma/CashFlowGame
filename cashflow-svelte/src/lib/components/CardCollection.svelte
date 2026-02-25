<script lang="ts">
  import Card from './Card.svelte';
  import Translate from './Translate.svelte';
  import type { Asset, Liability } from '../stores/gameStore';
  
  // Props
  export let assets: Asset[] = [];
  export let liabilities: Liability[] = [];
  export let title = 'cards.yourCards';
  export let emptyMessage = 'cards.noCards';
  
  // Get card type for asset
  function getAssetCardType(type: string): string {
    switch (type) {
      case 'stock':
        return 'small-deal';
      case 'realEstate':
        return 'big-deal';
      case 'business':
        return 'opportunity';
      case 'coin':
        return 'doodad';
      case 'personal':
        return 'doodad';
      default:
        return 'small-deal';
    }
  }
  
  // Get asset description
  function getAssetDescription(asset: Asset): string {
    if (asset.income) {
      return `Monthly Income: $${asset.income.toLocaleString()}`;
    }
    return 'Asset';
  }
  
  // Get liability description
  function getLiabilityDescription(liability: Liability): string {
    return `Monthly Payment: $${liability.payment.toLocaleString()}`;
  }
</script>

<div class="card-collection">
  <h3><Translate key={title} /></h3>
  
  {#if assets.length === 0 && liabilities.length === 0}
    <p class="empty-message"><Translate key={emptyMessage} /></p>
  {:else}
    <div class="cards-grid">
      <!-- Display assets -->
      {#each assets as asset}
        <Card 
          type={getAssetCardType(asset.type)}
          title={asset.name}
          description={getAssetDescription(asset)}
          amount={asset.value}
        />
      {/each}
      
      <!-- Display liabilities -->
      {#each liabilities as liability}
        <Card 
          type="liability"
          title={liability.name}
          description={getLiabilityDescription(liability)}
          amount={-liability.amount}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .card-collection {
    background-color: var(--surface);
    border-radius: 8px;
    padding: var(--spacing-lg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .card-collection h3 {
    margin-top: 0;
    border-bottom: 1px solid var(--outline);
    padding-bottom: var(--spacing-sm);
    color: var(--primary);
  }
  
  .empty-message {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: var(--spacing-lg);
  }
  
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }
  
  @media (max-width: 768px) {
    .cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
  
  @media (max-width: 480px) {
    .cards-grid {
      grid-template-columns: 1fr;
    }
  }
</style>