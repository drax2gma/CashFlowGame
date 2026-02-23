<script lang="ts">
  import type { Player } from '$lib/stores/gameStore';
  import Translate from '$lib/components/Translate.svelte';

  export let player: Player;
  export let type: 'income' | 'balance' = 'income';

  // Calculate financial metrics
  $: totalAssets = player.assets.reduce((sum, asset) => sum + asset.value, 0);
  $: totalLiabilities = player.liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  $: passiveIncome = player.assets.reduce((sum, asset) => sum + (asset.income || 0), 0);
  $: netWorth = player.cash + totalAssets - totalLiabilities;
  $: cashFlow = player.income - player.expenses;
</script>

<div class="financial-statement">
  {#if type === 'income'}
    <h3><Translate key="finance.incomeStatement" /></h3>
    <div class="statement-section">
      <div class="statement-row">
        <span><Translate key="finance.salary" /></span>
        <span class="amount">${player.salary.toLocaleString()}</span>
      </div>
      <div class="statement-row">
        <span><Translate key="finance.passiveIncome" /></span>
        <span class="amount">${passiveIncome.toLocaleString()}</span>
      </div>
      <div class="statement-row divider">
        <span><Translate key="finance.totalIncome" /></span>
        <span class="amount">${(player.salary + passiveIncome).toLocaleString()}</span>
      </div>
      <div class="statement-row">
        <span><Translate key="finance.taxes" /></span>
        <span class="amount">-${player.expenses.toLocaleString()}</span>
      </div>
      <div class="statement-row divider">
        <span><Translate key="finance.cashFlow" /></span>
        <span class="amount" class:positive={cashFlow >= 0} class:negative={cashFlow < 0}>${cashFlow.toLocaleString()}</span>
      </div>
    </div>
  {:else}
    <h3><Translate key="finance.balanceSheet" /></h3>
    <div class="statement-section">
      <div class="statement-row header">
        <span><Translate key="finance.assets" /></span>
      </div>
      {#each player.assets as asset}
        <div class="statement-row asset-row">
          <span>{asset.name}</span>
          <span class="amount">${asset.value.toLocaleString()}</span>
        </div>
      {/each}
      <div class="statement-row divider">
        <span><Translate key="finance.totalAssets" /></span>
        <span class="amount">${totalAssets.toLocaleString()}</span>
      </div>
      
      <div class="statement-row header">
        <span><Translate key="finance.liabilities" /></span>
      </div>
      {#each player.liabilities as liability}
        <div class="statement-row liability-row">
          <span>{liability.name}</span>
          <span class="amount">-${liability.amount.toLocaleString()}</span>
        </div>
      {/each}
      <div class="statement-row divider">
        <span><Translate key="finance.totalLiabilities" /></span>
        <span class="amount">-${totalLiabilities.toLocaleString()}</span>
      </div>
      
      <div class="statement-row">
        <span><Translate key="finance.cash" /></span>
        <span class="amount">${player.cash.toLocaleString()}</span>
      </div>
      
      <div class="statement-row net-worth">
        <span><Translate key="finance.netWorth" /></span>
        <span class="amount" class:positive={netWorth >= 0} class:negative={netWorth < 0}>${netWorth.toLocaleString()}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .financial-statement {
    background: var(--surface);
    border-radius: 8px;
    padding: var(--spacing-lg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: var(--font-family);
  }

  .financial-statement h3 {
    margin-top: 0;
    border-bottom: 1px solid var(--outline);
    padding-bottom: var(--spacing-sm);
    color: var(--on-surface);
  }

  .statement-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .statement-row {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-xs) 0;
  }

  .statement-row.header {
    font-weight: bold;
    color: var(--on-surface);
    margin-top: var(--spacing-sm);
  }

  .statement-row.divider {
    border-bottom: 1px solid var(--outline);
    font-weight: bold;
  }

  .statement-row.asset-row {
    padding-left: var(--spacing-md);
  }

  .statement-row.liability-row {
    padding-left: var(--spacing-md);
  }

  .amount {
    font-weight: 600;
    color: var(--on-surface);
  }

  .amount.positive {
    color: var(--success);
  }

  .amount.negative {
    color: var(--error);
  }

  .net-worth {
    font-weight: bold;
    font-size: var(--font-size-large);
    margin-top: var(--spacing-sm);
    padding-top: var(--spacing-sm);
    border-top: 2px solid var(--outline);
  }
</style>