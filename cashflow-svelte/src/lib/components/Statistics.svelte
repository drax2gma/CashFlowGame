<script lang="ts">
  export let stats = [];
  export let title = 'Statistics';
</script>

<div class="statistics">
  <h3>{title}</h3>
  
  <div class="stats-grid">
    {#each stats as stat}
      <div class="stat-item">
        <div class="stat-value">{stat.value}</div>
        <div class="stat-label">{stat.label}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .statistics {
    background-color: var(--surface);
    border-radius: 8px;
    padding: var(--spacing-lg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .statistics h3 {
    margin-top: 0;
    border-bottom: 1px solid var(--outline);
    padding-bottom: var(--spacing-sm);
    color: var(--primary);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
  }
  
  .stat-label {
    font-size: var(--font-size-small);
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
    
    .stat-value {
      font-size: 1.5rem;
    }
  }
</style>