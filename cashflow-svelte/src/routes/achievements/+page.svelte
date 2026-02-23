<script lang="ts">
  import Achievement from '$lib/components/Achievement.svelte';
  import Button from '$lib/components/Button.svelte';
  import Translate from '$lib/components/Translate.svelte';
  
  // Sample achievements data
  const achievements = [
    {
      id: 'first-game',
      title: 'First Game',
      description: 'Play your first game of CashFlow',
      icon: '🎮',
      unlocked: true,
      progress: 100
    },
    {
      id: 'big-investor',
      title: 'Big Investor',
      description: 'Own 5 real estate properties',
      icon: '🏢',
      unlocked: false,
      progress: 60,
      showProgress: true
    },
    {
      id: 'millionaire',
      title: 'Millionaire',
      description: 'Reach a net worth of $1,000,000',
      icon: '💰',
      unlocked: false,
      progress: 25,
      showProgress: true
    },
    {
      id: 'fast-track',
      title: 'Fast Track Rider',
      description: 'Enter the Fast Track',
      icon: '🚀',
      unlocked: false,
      progress: 0
    },
    {
      id: 'stock-broker',
      title: 'Stock Broker',
      description: 'Own 10 different stocks',
      icon: '📈',
      unlocked: false,
      progress: 40,
      showProgress: true
    },
    {
      id: 'debt-free',
      title: 'Debt Free',
      description: 'Pay off all liabilities',
      icon: '✅',
      unlocked: false,
      progress: 0
    }
  ];
  
  // Filter unlocked and locked achievements
  $: unlockedAchievements = achievements.filter(a => a.unlocked);
  $: lockedAchievements = achievements.filter(a => !a.unlocked);
</script>

<div class="achievements-page">
  <header class="header">
    <h1>Achievements</h1>
    <p>Earn achievements by playing the game and reaching milestones</p>
  </header>

  <main class="main-content">
    <div class="achievements-section">
      <h2>Unlocked Achievements ({unlockedAchievements.length})</h2>
      <div class="achievements-grid">
        {#each unlockedAchievements as achievement}
          <Achievement
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            unlocked={achievement.unlocked}
            progress={achievement.progress}
            showProgress={achievement.showProgress}
          />
        {/each}
      </div>
    </div>

    <div class="achievements-section">
      <h2>Locked Achievements ({lockedAchievements.length})</h2>
      <div class="achievements-grid">
        {#each lockedAchievements as achievement}
          <Achievement
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            unlocked={achievement.unlocked}
            progress={achievement.progress}
            showProgress={achievement.showProgress}
          />
        {/each}
      </div>
    </div>

    <div class="achievements-footer">
      <Button on:click={() => console.log('Refresh achievements')}>
        Refresh Achievements
      </Button>
    </div>
  </main>
</div>

<style>
  .achievements-page {
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

  .achievements-section {
    margin-bottom: var(--spacing-xl);
  }

  .achievements-section h2 {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--primary);
    border-bottom: 1px solid var(--outline);
    padding-bottom: var(--spacing-sm);
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-md);
  }

  .achievements-footer {
    text-align: center;
    padding: var(--spacing-lg) 0;
  }

  @media (max-width: 768px) {
    .main-content {
      padding: var(--spacing-md);
    }

    .achievements-grid {
      grid-template-columns: 1fr;
    }
  }
</style>