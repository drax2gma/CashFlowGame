<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Button from './Button.svelte';
  import Translate from './Translate.svelte';
  import Tooltip from './Tooltip.svelte';
  
  // Navigation items with tooltip translation keys
  const navItems = [
    { path: '/', label: 'navigation.home', icon: '🏠', tooltip: 'tooltips.navigation.home' },
    { path: '/dashboard', label: 'navigation.game', icon: '🎲', tooltip: 'tooltips.navigation.game' },
    { path: '/achievements', label: 'Achievements', icon: '🏆', tooltip: 'tooltips.navigation.achievements' },
    { path: '/settings', label: 'navigation.settings', icon: '🔧', tooltip: 'tooltips.navigation.settings' }
  ];
  
  // Check if a path is active
  function isActive(path: string): boolean {
    return $page.url.pathname === path;
  }
  
  // Navigate to a path (removed since we will use standard a tags)
</script>

<nav class="navigation" aria-label="Main navigation">
  <ul class="nav-list">
    {#each navItems as item}
      <li class="nav-item">
        <Tooltip text={item.tooltip} position="bottom">
          <a
            href={item.path}
            class="nav-link {isActive(item.path) ? 'active' : ''}"
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            <span class="nav-icon">{item.icon}</span>
            <span class="nav-label"><Translate key={item.label} /></span>
          </a>
        </Tooltip>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .navigation {
    background-color: var(--surface);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: var(--spacing-sm) 0;
  }
  
  .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    justify-content: center;
    gap: var(--spacing-sm);
  }
  
  .nav-item {
    display: flex;
  }
  
  .nav-icon {
    font-size: 1.2rem;
  }
  
  .nav-label {
    margin-left: var(--spacing-sm);
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: 4px;
    text-decoration: none;
    color: var(--on-surface);
    transition: background-color 0.2s;
  }
  
  .nav-link:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .nav-link.active {
    background-color: var(--primary);
    color: var(--on-primary);
  }

  @media (max-width: 768px) {
    .nav-list {
      gap: 0;
    }
    
    .nav-item {
      flex: 1;
    }

    .nav-link {
      width: 100%;
      justify-content: center;
    }
    
    .nav-label {
      display: none;
    }
  }
</style>