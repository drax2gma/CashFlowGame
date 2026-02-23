<script lang="ts">
  import GraphicsGenerator from '$lib/components/GraphicsGenerator.svelte';
</script>

<div class="graphics-page">
  <header class="header">
    <h1>Graphics Generator</h1>
    <p>Generate game graphics using ComfyUI AI</p>
  </header>

  <main class="main-content">
    <GraphicsGenerator />
  </main>
</div>

<style>
  .graphics-page {
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
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  @media (max-width: 768px) {
    .main-content {
      padding: var(--spacing-md);
    }
  }
</style>