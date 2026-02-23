<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Translate from '$lib/components/Translate.svelte';
  
  // Sample card data
  const sampleCards = [
    {
      type: 'small-deal',
      title: 'Stock Investment',
      description: 'Invest in a promising tech startup',
      amount: 5000
    },
    {
      type: 'big-deal',
      title: 'Real Estate',
      description: 'Purchase a rental property in downtown',
      amount: 150000
    },
    {
      type: 'opportunity',
      title: 'Business Deal',
      description: 'Partner in a new franchise opportunity',
      amount: 75000
    },
    {
      type: 'doodad',
      title: 'Luxury Car',
      description: 'Brand new sports car lease',
      amount: 35000
    },
    {
      type: 'charity',
      title: 'Charity Donation',
      description: 'Donate to local community foundation',
      amount: 10000
    },
    {
      type: 'paycheck',
      title: 'Monthly Salary',
      description: 'Regular monthly income payment',
      amount: 5000
    },
    {
      type: 'downsized',
      title: 'Job Loss',
      description: 'Unexpected layoff from employment',
      amount: -2000
    }
  ];
</script>

<div class="cards-demo">
  <header class="header">
    <h1>3D Card Effects Demo</h1>
    <p>Interactive cards with 3D flip and hover effects</p>
  </header>

  <main class="main-content">
    <div class="cards-grid">
      {#each sampleCards as cardData}
        <Card 
          type={cardData.type}
          title={cardData.title}
          description={cardData.description}
          amount={cardData.amount}
        />
      {/each}
    </div>
    
    <div class="instructions">
      <h2>How to interact with cards:</h2>
      <ul>
        <li><strong>Click</strong> on any card to flip it</li>
        <li><strong>Hover</strong> over cards to see lift and glow effects</li>
        <li>Each card type has a unique color and icon</li>
      </ul>
    </div>
  </main>
</div>

<style>
  .cards-demo {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--background);
    color: var(--on-background);
    font-family: var(--font-family);
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

  .header p {
    margin: 0;
    opacity: 0.9;
  }

  .main-content {
    flex: 1;
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .cards-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }

  .instructions {
    background-color: var(--surface);
    padding: var(--spacing-lg);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .instructions h2 {
    margin-top: 0;
  }

  .instructions ul {
    padding-left: var(--spacing-lg);
  }

  .instructions li {
    margin-bottom: var(--spacing-sm);
  }

  @media (max-width: 768px) {
    .cards-grid {
      gap: var(--spacing-md);
    }
    
    .main-content {
      padding: var(--spacing-md);
    }
  }

  @media (max-width: 480px) {
    .cards-grid {
      flex-direction: column;
      align-items: center;
    }
  }
</style>