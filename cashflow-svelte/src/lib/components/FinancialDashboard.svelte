<script lang="ts">
  import type { Player } from '$lib/stores/gameStore';
  import Translate from '$lib/components/Translate.svelte';
  
  export let player: Player;
  export let compact: boolean = false;
  
  // Calculate financial metrics with safe defaults
  $: totalAssets = player.assets?.reduce((sum, asset) => sum + (asset.value || 0), 0) || 0;
  $: totalLiabilities = player.liabilities?.reduce((sum, liability) => sum + (liability.amount || 0), 0) || 0;
  $: passiveIncome = player.assets?.reduce((sum, asset) => sum + (asset.income || 0), 0) || 0;
  $: playerCash = player.cash ?? 0;
  $: netWorth = playerCash + totalAssets - totalLiabilities;
  $: totalIncome = (player.salary ?? 0) + passiveIncome;
  $: totalExpenses = player.expenses ?? 0;
  $: cashFlow = totalIncome - totalExpenses;
  
  // Rat race escape progress (passive income > expenses)
  $: escapeProgress = totalExpenses > 0 ? Math.min(100, (passiveIncome / totalExpenses) * 100) : 0;
  $: canEscape = passiveIncome >= totalExpenses;
  
  // Format currency with null safety
  function formatMoney(amount: number | undefined | null): string {
    const safeAmount = amount ?? 0;
    return '$' + safeAmount.toLocaleString();
  }
  
  // Get asset icon
  function getAssetIcon(type: string): string {
    const icons: Record<string, string> = {
      realEstate: '🏠',
      stock: '📈',
      business: '🏢',
      personal: '🚗',
      default: '📦'
    };
    return icons[type] || icons.default;
  }
  
  // Get liability icon
  function getLiabilityIcon(type: string): string {
    const icons: Record<string, string> = {
      mortgage: '🏦',
      loan: '💳',
      credit: '💳',
      default: '📋'
    };
    return icons[type] || icons.default;
  }
</script>

<div class="financial-dashboard" class:compact>
  <!-- Header with player info -->
  <div class="dashboard-header">
    <div class="header-title">
      <span class="icon">📊</span>
      <h3>Financial Statement</h3>
    </div>
    <div class="cash-display">
      <span class="cash-label">Cash</span>
      <span class="cash-amount" class:negative={playerCash < 0}>
        {formatMoney(playerCash)}
      </span>
    </div>
  </div>
  
  <!-- Escape Progress Bar -->
  <div class="escape-progress">
    <div class="progress-header">
      <span class="progress-label">🎯 Rat Race Escape Progress</span>
      <span class="progress-value">{escapeProgress.toFixed(0)}%</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        style="width: {escapeProgress}%"
        class:complete={canEscape}
      ></div>
    </div>
    <div class="progress-info">
      <span>Passive Income: {formatMoney(passiveIncome)}/mo</span>
      <span>Target: {formatMoney(totalExpenses)}/mo</span>
    </div>
    {#if canEscape}
      <div class="escape-ready">
        ✨ Ready to escape the Rat Race! ✨
      </div>
    {/if}
  </div>
  
  {#if !compact}
    <!-- Income Statement -->
    <div class="statement-section">
      <div class="section-header income-header">
        <span class="icon">💰</span>
        <span>Income Statement</span>
      </div>
      <div class="statement-grid">
        <div class="statement-row">
          <span class="label">💼 Salary</span>
          <span class="amount positive">+{formatMoney(player.salary || 0)}</span>
        </div>
        <div class="statement-row">
          <span class="label">📈 Passive Income</span>
          <span class="amount positive">+{formatMoney(passiveIncome)}</span>
        </div>
        <div class="statement-row total-row">
          <span class="label">Total Income</span>
          <span class="amount positive">+{formatMoney(totalIncome)}</span>
        </div>
        <div class="statement-row">
          <span class="label">💸 Expenses</span>
          <span class="amount negative">-{formatMoney(totalExpenses)}</span>
        </div>
        <div class="statement-row cashflow-row">
          <span class="label">💵 Monthly Cash Flow</span>
          <span class="amount" class:positive={cashFlow >= 0} class:negative={cashFlow < 0}>
            {cashFlow >= 0 ? '+' : ''}{formatMoney(cashFlow)}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Balance Sheet -->
    <div class="statement-section">
      <div class="section-header balance-header">
        <span class="icon">📋</span>
        <span>Balance Sheet</span>
      </div>
      
      <!-- Assets -->
      <div class="balance-section">
        <div class="balance-header assets-header">
          <span><Translate key="assets.yourAssets" /></span>
          <span class="total">{formatMoney(totalAssets)}</span>
        </div>
        <div class="items-list">
          {#if player.assets && player.assets.length > 0}
            {#each player.assets as asset}
              <div class="item-row asset-row">
                <span class="item-icon">{getAssetIcon(asset.type)}</span>
                <span class="item-name">{asset.name}</span>
                <span class="item-value">{formatMoney(asset.value)}</span>
                {#if asset.income && asset.income > 0}
                  <span class="item-income">+{formatMoney(asset.income)}/mo</span>
                {/if}
              </div>
            {/each}
          {:else}
            <div class="empty-state"><Translate key="assets.noAssets" /></div>
          {/if}
        </div>
      </div>
      
      <!-- Liabilities -->
      <div class="balance-section">
        <div class="balance-header liabilities-header">
          <span><Translate key="liabilities.yourLiabilities" /></span>
          <span class="total">{formatMoney(totalLiabilities)}</span>
        </div>
        <div class="items-list">
          {#if player.liabilities && player.liabilities.length > 0}
            {#each player.liabilities as liability}
              <div class="item-row liability-row">
                <span class="item-icon">{getLiabilityIcon(liability.type)}</span>
                <span class="item-name">{liability.name}</span>
                <span class="item-value negative">{formatMoney(liability.amount)}</span>
                {#if liability.payment && liability.payment > 0}
                  <span class="item-payment">-{formatMoney(liability.payment)}/mo</span>
                {/if}
              </div>
            {/each}
          {:else}
            <div class="empty-state"><Translate key="liabilities.noLiabilities" /></div>
          {/if}
        </div>
      </div>
      
      <!-- Net Worth -->
      <div class="net-worth-section">
        <div class="net-worth-row">
          <span class="label">💎 Net Worth</span>
          <span class="amount" class:positive={netWorth >= 0} class:negative={netWorth < 0}>
            {formatMoney(netWorth)}
          </span>
        </div>
      </div>
    </div>
  {:else}
    <!-- Compact view -->
    <div class="compact-stats">
      <div class="stat-item">
        <span class="stat-icon">💰</span>
        <span class="stat-label">Income</span>
        <span class="stat-value positive">+{formatMoney(totalIncome)}</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">💸</span>
        <span class="stat-label">Expenses</span>
        <span class="stat-value negative">-{formatMoney(totalExpenses)}</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">💵</span>
        <span class="stat-label">Cash Flow</span>
        <span class="stat-value" class:positive={cashFlow >= 0} class:negative={cashFlow < 0}>
          {cashFlow >= 0 ? '+' : ''}{formatMoney(cashFlow)}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">💎</span>
        <span class="stat-label">Net Worth</span>
        <span class="stat-value" class:positive={netWorth >= 0} class:negative={netWorth < 0}>
          {formatMoney(netWorth)}
        </span>
      </div>
    </div>
    
    <!-- Quick asset/liability counts -->
    <div class="quick-counts">
      <div class="count-item assets">
        <span class="count-icon">📦</span>
        <span class="count-value">{player.assets?.length || 0}</span>
        <span class="count-label">Assets</span>
      </div>
      <div class="count-item liabilities">
        <span class="count-icon">📋</span>
        <span class="count-value">{player.liabilities?.length || 0}</span>
        <span class="count-label">Liabilities</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .financial-dashboard {
    background: linear-gradient(145deg, #1e1e2e 0%, #2a2a3e 100%);
    border-radius: 12px;
    padding: 1rem;
    color: white;
    font-family: 'Segoe UI', system-ui, sans-serif;
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .header-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .header-title .icon {
    font-size: 1.5rem;
  }
  
  .header-title h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }
  
  .cash-display {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .cash-label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .cash-amount {
    font-size: 1.4rem;
    font-weight: 700;
    color: #4CAF50;
  }
  
  .cash-amount.negative {
    color: #F44336;
  }
  
  /* Escape Progress */
  .escape-progress {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .progress-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .progress-value {
    font-size: 0.9rem;
    font-weight: 700;
    color: #FFD700;
  }
  
  .progress-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
    border-radius: 4px;
    transition: width 0.5s ease;
  }
  
  .progress-fill.complete {
    background: linear-gradient(90deg, #FFD700 0%, #FFA000 100%);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 0.5rem;
  }
  
  .escape-ready {
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: #FFD700;
    margin-top: 0.5rem;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  /* Statement Sections */
  .statement-section {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .income-header {
    color: #4CAF50;
  }
  
  .balance-header {
    color: #2196F3;
  }
  
  .statement-grid {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  
  .statement-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0;
  }
  
  .statement-row .label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .statement-row .amount {
    font-size: 0.85rem;
    font-weight: 600;
  }
  
  .amount.positive {
    color: #4CAF50;
  }
  
  .amount.negative {
    color: #F44336;
  }
  
  .total-row {
    border-top: 1px dashed rgba(255, 255, 255, 0.2);
    padding-top: 0.5rem;
    margin-top: 0.25rem;
  }
  
  .cashflow-row {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.5rem;
    border-radius: 4px;
    margin-top: 0.25rem;
  }
  
  .cashflow-row .label {
    font-weight: 600;
  }
  
  .cashflow-row .amount {
    font-size: 1rem;
  }
  
  /* Balance Section */
  .balance-section {
    margin-bottom: 0.75rem;
  }
  
  .balance-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0;
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .assets-header {
    color: #4CAF50;
  }
  
  .liabilities-header {
    color: #F44336;
  }
  
  .balance-header .total {
    font-weight: 700;
  }
  
  .items-list {
    max-height: 150px;
    overflow-y: auto;
  }
  
  .item-row {
    display: grid;
    grid-template-columns: 24px 1fr auto auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.3rem 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
  }
  
  .item-icon {
    font-size: 1rem;
  }
  
  .item-name {
    color: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .item-value {
    font-weight: 600;
    color: #4CAF50;
  }
  
  .item-value.negative {
    color: #F44336;
  }
  
  .item-income {
    font-size: 0.7rem;
    color: #4CAF50;
  }
  
  .item-payment {
    font-size: 0.7rem;
    color: #F44336;
  }
  
  .empty-state {
    text-align: center;
    padding: 0.5rem;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
  }
  
  /* Net Worth */
  .net-worth-section {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%);
    border-radius: 6px;
    padding: 0.75rem;
    border: 1px solid rgba(255, 215, 0, 0.2);
  }
  
  .net-worth-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .net-worth-row .label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #FFD700;
  }
  
  .net-worth-row .amount {
    font-size: 1.2rem;
    font-weight: 700;
  }
  
  /* Compact View */
  .compact-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
  }
  
  .stat-icon {
    font-size: 1.2rem;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
  }
  
  .stat-value {
    font-size: 0.9rem;
    font-weight: 700;
  }
  
  .quick-counts {
    display: flex;
    gap: 0.5rem;
  }
  
  .count-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    border-radius: 6px;
  }
  
  .count-item.assets {
    background: rgba(76, 175, 80, 0.2);
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
  
  .count-item.liabilities {
    background: rgba(244, 67, 54, 0.2);
    border: 1px solid rgba(244, 67, 54, 0.3);
  }
  
  .count-icon {
    font-size: 1rem;
  }
  
  .count-value {
    font-size: 1.2rem;
    font-weight: 700;
  }
  
  .count-label {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.6);
  }
  
  /* Compact mode adjustments */
  .financial-dashboard.compact {
    padding: 0.75rem;
  }
  
  .financial-dashboard.compact .dashboard-header {
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
  }
  
  .financial-dashboard.compact .header-title h3 {
    font-size: 0.95rem;
  }
  
  .financial-dashboard.compact .cash-amount {
    font-size: 1.2rem;
  }
</style>