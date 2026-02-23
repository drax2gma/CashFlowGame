<script lang="ts">
  import { 
    generateImage, 
    generateCardImage, 
    generatePlayerAvatar, 
    generateBoardSpaceIcon,
    generateDreamImage,
    generateBackground,
    checkComfyUIConnection,
    type GenerationResult 
  } from '$lib/utils/comfyUI';
  import { onMount } from 'svelte';
  import Button from './Button.svelte';

  // State
  let isConnected = false;
  let isGenerating = false;
  let error: string | null = null;
  let result: GenerationResult | null = null;
  let generatedImages: Array<{ prompt: string; image: string; timestamp: Date }> = [];

  // Form inputs
  let generationType: 'custom' | 'card' | 'avatar' | 'board-space' | 'dream' | 'background' = 'custom';
  let customPrompt = '';
  let cardType: 'small-deal' | 'big-deal' | 'doodad' | 'opportunity' | 'charity' | 'paycheck' | 'downsize' = 'small-deal';
  let cardDescription = '';
  let profession = 'Engineer';
  let avatarStyle: 'professional' | 'casual' | 'creative' = 'professional';
  let spaceType: 'opportunity' | 'liability' | 'charity' | 'paycheck' | 'offer' | 'downsize' | 'child' = 'opportunity';
  let spaceColor = '#21940f';
  let dreamName = '';
  let dreamDescription = '';
  let backgroundTheme: 'board' | 'card' | 'menu' | 'victory' | 'defeat' = 'board';
  let width = 512;
  let height = 512;
  let steps = 4;
  let seed: number | null = null;

  // Check connection on mount
  onMount(async () => {
    isConnected = await checkComfyUIConnection();
    if (!isConnected) {
      error = 'Unable to connect to ComfyUI server at http://p510:8188';
    }
  });

  // Handle generation
  async function handleGenerate() {
    if (!isConnected) {
      error = 'Not connected to ComfyUI server';
      return;
    }

    isGenerating = true;
    error = null;
    result = null;

    try {
      switch (generationType) {
        case 'custom':
          if (!customPrompt.trim()) {
            throw new Error('Please enter a prompt');
          }
          result = await generateImage({
            prompt: customPrompt,
            width,
            height,
            steps,
            seed: seed ?? undefined
          });
          break;

        case 'card':
          if (!cardDescription.trim()) {
            throw new Error('Please enter a card description');
          }
          result = await generateCardImage(cardType, cardDescription);
          break;

        case 'avatar':
          result = await generatePlayerAvatar(profession, avatarStyle);
          break;

        case 'board-space':
          result = await generateBoardSpaceIcon(spaceType, spaceColor);
          break;

        case 'dream':
          if (!dreamName.trim() || !dreamDescription.trim()) {
            throw new Error('Please enter dream name and description');
          }
          result = await generateDreamImage(dreamName, dreamDescription);
          break;

        case 'background':
          result = await generateBackground(backgroundTheme);
          break;
      }

      if (result && result.images.length > 0) {
        generatedImages = [
          { prompt: result.prompt, image: result.images[0], timestamp: new Date() },
          ...generatedImages
        ];
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Generation failed';
    } finally {
      isGenerating = false;
    }
  }

  // Download image
  function downloadImage(imageData: string, filename: string) {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename;
    link.click();
  }

  // Clear history
  function clearHistory() {
    generatedImages = [];
  }
</script>

<div class="graphics-generator">
  <header class="header">
    <h2>Graphics Generator</h2>
    <div class="connection-status">
      {#if isConnected}
        <span class="status connected">✓ Connected to ComfyUI</span>
      {:else}
        <span class="status disconnected">✗ Not Connected</span>
      {/if}
    </div>
  </header>

  <div class="generator-content">
    <div class="controls-section">
      <div class="form-group">
        <label for="generation-type">Generation Type</label>
        <select id="generation-type" bind:value={generationType}>
          <option value="custom">Custom Prompt</option>
          <option value="card">Card Image</option>
          <option value="avatar">Player Avatar</option>
          <option value="board-space">Board Space Icon</option>
          <option value="dream">Dream Card</option>
          <option value="background">Background</option>
        </select>
      </div>

      {#if generationType === 'custom'}
        <div class="form-group">
          <label for="custom-prompt">Prompt</label>
          <textarea 
            id="custom-prompt" 
            bind:value={customPrompt}
            placeholder="Enter your image generation prompt..."
            rows="3"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="width">Width</label>
            <input type="number" id="width" bind:value={width} min="256" max="2048" step="64" />
          </div>

          <div class="form-group">
            <label for="height">Height</label>
            <input type="number" id="height" bind:value={height} min="256" max="2048" step="64" />
          </div>

          <div class="form-group">
            <label for="steps">Steps</label>
            <input type="number" id="steps" bind:value={steps} min="1" max="8" />
          </div>

          <div class="form-group">
            <label for="seed">Seed (optional)</label>
            <input type="number" id="seed" bind:value={seed} placeholder="Random" />
          </div>
        </div>
      {/if}

      {#if generationType === 'card'}
        <div class="form-group">
          <label for="card-type">Card Type</label>
          <select id="card-type" bind:value={cardType}>
            <option value="small-deal">Small Deal</option>
            <option value="big-deal">Big Deal</option>
            <option value="doodad">Doodad</option>
            <option value="opportunity">Opportunity</option>
            <option value="charity">Charity</option>
            <option value="paycheck">Paycheck</option>
            <option value="downsize">Downsize</option>
          </select>
        </div>

        <div class="form-group">
          <label for="card-description">Card Description</label>
          <input 
            type="text" 
            id="card-description" 
            bind:value={cardDescription}
            placeholder="e.g., Buy a rental property for $50,000"
          />
        </div>
      {/if}

      {#if generationType === 'avatar'}
        <div class="form-group">
          <label for="profession">Profession</label>
          <select id="profession" bind:value={profession}>
            <option value="Airline Pilot">Airline Pilot</option>
            <option value="Business Manager">Business Manager</option>
            <option value="Doctor">Doctor</option>
            <option value="Engineer">Engineer</option>
            <option value="Janitor">Janitor</option>
            <option value="Lawyer">Lawyer</option>
            <option value="Mechanic">Mechanic</option>
            <option value="Nurse">Nurse</option>
            <option value="Police Officer">Police Officer</option>
            <option value="Secretary">Secretary</option>
            <option value="Teacher">Teacher</option>
            <option value="Truck Driver">Truck Driver</option>
          </select>
        </div>

        <div class="form-group">
          <label for="avatar-style">Style</label>
          <select id="avatar-style" bind:value={avatarStyle}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="creative">Creative</option>
          </select>
        </div>
      {/if}

      {#if generationType === 'board-space'}
        <div class="form-group">
          <label for="space-type">Space Type</label>
          <select id="space-type" bind:value={spaceType}>
            <option value="opportunity">Opportunity</option>
            <option value="liability">Liability</option>
            <option value="charity">Charity</option>
            <option value="paycheck">Paycheck</option>
            <option value="offer">Offer</option>
            <option value="downsize">Downsize</option>
            <option value="child">Child</option>
          </select>
        </div>

        <div class="form-group">
          <label for="space-color">Color</label>
          <input type="color" id="space-color" bind:value={spaceColor} />
        </div>
      {/if}

      {#if generationType === 'dream'}
        <div class="form-group">
          <label for="dream-name">Dream Name</label>
          <input 
            type="text" 
            id="dream-name" 
            bind:value={dreamName}
            placeholder="e.g., World Traveler"
          />
        </div>

        <div class="form-group">
          <label for="dream-description">Dream Description</label>
          <textarea 
            id="dream-description" 
            bind:value={dreamDescription}
            placeholder="Describe the dream..."
            rows="2"
          />
        </div>
      {/if}

      {#if generationType === 'background'}
        <div class="form-group">
          <label for="background-theme">Theme</label>
          <select id="background-theme" bind:value={backgroundTheme}>
            <option value="board">Game Board</option>
            <option value="card">Card Background</option>
            <option value="menu">Menu Background</option>
            <option value="victory">Victory Screen</option>
            <option value="defeat">Defeat Screen</option>
          </select>
        </div>
      {/if}

      {#if error}
        <div class="error-message">
          {error}
        </div>
      {/if}

      <div class="button-group">
        <Button 
          on:click={handleGenerate}
          disabled={!isConnected || isGenerating}
          variant="primary"
        >
          {#if isGenerating}
            Generating...
          {:else}
            Generate Image
          {/if}
        </Button>
      </div>
    </div>

    <div class="preview-section">
      <h3>Current Result</h3>
      {#if result && result.images.length > 0}
        <div class="result-container">
          <img src={result.images[0]} alt="Generated image" class="result-image" />
          <div class="result-info">
            <p><strong>Seed:</strong> {result.seed}</p>
            <p><strong>Prompt:</strong> {result.prompt}</p>
            <Button 
              on:click={() => downloadImage(result.images[0], `cashflow-${result.seed}.png`)}
              size="small"
            >
              Download
            </Button>
          </div>
        </div>
      {:else if isGenerating}
        <div class="loading">
          <div class="spinner"></div>
          <p>Generating image...</p>
        </div>
      {:else}
        <div class="placeholder">
          <p>No image generated yet</p>
        </div>
      {/if}
    </div>

    <div class="history-section">
      <div class="history-header">
        <h3>Generation History ({generatedImages.length})</h3>
        {#if generatedImages.length > 0}
          <Button on:click={clearHistory} size="small" variant="secondary">
            Clear
          </Button>
        {/if}
      </div>

      {#if generatedImages.length > 0}
        <div class="history-grid">
          {#each generatedImages as item, index}
            <div class="history-item">
              <img src={item.image} alt="Generated {index}" />
              <div class="history-info">
                <span class="timestamp">{item.timestamp.toLocaleTimeString()}</span>
                <Button 
                  on:click={() => downloadImage(item.image, `cashflow-${item.timestamp.getTime()}.png`)}
                  size="small"
                >
                  ⬇
                </Button>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="empty-history">No images in history</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .graphics-generator {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--outline);
  }

  .header h2 {
    margin: 0;
    color: var(--primary);
  }

  .connection-status .status {
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 4px;
    font-size: var(--font-size-small);
    font-weight: 600;
  }

  .status.connected {
    background-color: #4CAF50;
    color: white;
  }

  .status.disconnected {
    background-color: #F44336;
    color: white;
  }

  .generator-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: var(--spacing-lg);
  }

  .controls-section {
    grid-column: 1;
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .form-group label {
    font-weight: 600;
    color: var(--on-surface);
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: var(--spacing-sm);
    border: 1px solid var(--outline);
    border-radius: 4px;
    font-size: var(--font-size-base);
    background-color: var(--background);
    color: var(--on-background);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 60px;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-sm);
  }

  .error-message {
    padding: var(--spacing-sm);
    background-color: #FFEBEE;
    border: 1px solid #F44336;
    border-radius: 4px;
    color: #C62828;
  }

  .button-group {
    display: flex;
    gap: var(--spacing-sm);
  }

  .preview-section {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .preview-section h3 {
    margin: 0;
    color: var(--primary);
  }

  .result-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .result-image {
    width: 100%;
    max-width: 512px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .result-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    background-color: var(--background);
    border-radius: 4px;
  }

  .result-info p {
    margin: 0;
    font-size: var(--font-size-small);
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    background-color: var(--background);
    border-radius: 8px;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--outline);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    background-color: var(--background);
    border-radius: 8px;
    border: 2px dashed var(--outline);
    color: var(--on-surface);
    opacity: 0.6;
  }

  .history-section {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .history-header h3 {
    margin: 0;
    color: var(--primary);
  }

  .history-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--spacing-sm);
    max-height: 300px;
    overflow-y: auto;
    padding: var(--spacing-xs);
  }

  .history-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .history-item img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 4px;
  }

  .history-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-small);
  }

  .timestamp {
    color: var(--on-surface);
    opacity: 0.7;
  }

  .empty-history {
    text-align: center;
    color: var(--on-surface);
    opacity: 0.6;
    padding: var(--spacing-md);
  }

  @media (max-width: 768px) {
    .generator-content {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }

    .controls-section {
      grid-column: 1;
      grid-row: auto;
    }

    .preview-section,
    .history-section {
      grid-column: 1;
      grid-row: auto;
    }

    .form-row {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>