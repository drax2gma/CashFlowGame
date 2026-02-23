<script lang="ts">
  import Translate from './Translate.svelte';
</script>

<footer class="footer">
  <div class="footer-content">
    <div class="footer-info">
      <p>&copy; 2026 cashflow.gmz.hu. <Translate key="app.description" /></p>
      <p class="version">Version 1.5</p>
    </div>
    <div class="footer-links">
      <button class="link-btn" on:click={() => console.log('Help clicked')}><Translate key="navigation.help" /></button>
      <button class="link-btn" on:click={() => console.log('About clicked')}>About</button>
      <button class="link-btn" on:click={() => console.log('Contact clicked')}>Contact</button>
    </div>
  </div>
</footer>

<style>
  .footer {
    background-color: var(--secondary);
    color: var(--on-secondary);
    padding: var(--spacing-md) var(--spacing-lg);
    margin-top: auto;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-info {
    display: flex;
    flex-direction: column;
  }
  
  .version {
    font-size: var(--font-size-small);
    opacity: 0.8;
    margin: 0;
  }
  
  .footer-links {
    display: flex;
    gap: var(--spacing-md);
  }
  
  .footer-links .link-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    color: var(--on-secondary);
    text-decoration: none;
  }
  
  .footer-links .link-btn:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      gap: var(--spacing-sm);
      text-align: center;
    }
    
    .footer-links {
      justify-content: center;
    }
  }
</style>