<script lang="ts">
  import { locale } from '$lib/i18n';
  import { getPreferredLocale } from '$lib/i18n';
  import '$lib/i18n';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import './layout.css';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import NotificationContainer from '$lib/components/NotificationContainer.svelte';
  import { audioManager } from '$lib/audio/AudioManager';

  function handleGlobalClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Play UI click sound for buttons, links, and other interactive elements
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('a') ||
      target.getAttribute('role') === 'button' ||
      target.closest('[role="button"]')
    ) {
      audioManager.playUiClick();
    }
  }

  onMount(() => {
    // Set the initial locale based on user preferences
    $locale = getPreferredLocale();
    
    // Add global click handler for UI sounds (browser only)
    if (browser) {
      window.addEventListener('click', handleGlobalClick, true);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('click', handleGlobalClick, true);
    }
  });
</script>

<Navigation />

<slot />

<Footer />

<NotificationContainer />

<style>
  :global(:root) {
    /* Color Palette */
    --primary: #1976D2;
    --secondary: #424242;
    --success: #4CAF50;
    --warning: #FFC107;
    --error: #F44336;
    --background: #FAFAFA;
    --surface: #FFFFFF;
    --on-primary: #FFFFFF;
    --on-secondary: #FFFFFF;
    --on-success: #FFFFFF;
    --on-warning: #000000;
    --on-error: #FFFFFF;
    --on-background: #000000;
    --on-surface: #000000;
    --outline: #CCCCCC;
    
    /* Typography */
    --font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    --font-size-small: 0.875rem;
    --font-size-medium: 1rem;
    --font-size-large: 1.25rem;
    --font-size-xl: 1.5rem;
    --font-size-xxl: 2rem;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-xxl: 3rem;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: var(--font-family);
    background-color: var(--background);
    color: var(--on-background);
    line-height: 1.5;
  }

  :global(h1, h2, h3, h4, h5, h6) {
    margin-top: 0;
    margin-bottom: var(--spacing-md);
  }

  :global(p) {
    margin-top: 0;
    margin-bottom: var(--spacing-md);
  }

  :global(button) {
    font-family: inherit;
  }

  /* Responsive breakpoints */
  @media (max-width: 360px) {
    :global(html) {
      font-size: 14px;
    }
  }

  @media (min-width: 361px) and (max-width: 480px) {
    :global(html) {
      font-size: 15px;
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    :global(html) {
      font-size: 16px;
    }
  }

  @media (min-width: 769px) {
    :global(html) {
      font-size: 16px;
    }
  }
</style>

