# ComfyUI Graphics Generator

This utility provides AI-powered graphics generation for the CashFlow game using ComfyUI.

## Setup

### Prerequisites
- ComfyUI server running at `http://p510:8188/`
- Required models installed:
  - `z_image_turbo_bf16.safetensors` (Diffusion model)
  - `qwen_3_4b.safetensors` (CLIP model)
  - `ae.safetensors` (VAE model)

### Configuration
The default ComfyUI URL is configured in `comfyUI.ts`:
```typescript
const COMFYUI_URL = 'http://p510:8188';
```

## Usage

### Web Interface
Navigate to `/graphics` in the application to use the graphical interface.

### Programmatic Usage

#### Generate Custom Image
```typescript
import { generateImage } from '$lib/utils/comfyUI';

const result = await generateImage({
  prompt: 'A professional business card design',
  width: 512,
  height: 768,
  steps: 4,
  cfg: 1
});

console.log(result.images[0]); // Base64 encoded image
console.log(result.seed); // Seed used for generation
```

#### Generate Card Image
```typescript
import { generateCardImage } from '$lib/utils/comfyUI';

const result = await generateCardImage(
  'small-deal',
  'Buy a rental property for $50,000'
);
```

#### Generate Player Avatar
```typescript
import { generatePlayerAvatar } from '$lib/utils/comfyUI';

const result = await generatePlayerAvatar('Engineer', 'professional');
```

#### Generate Board Space Icon
```typescript
import { generateBoardSpaceIcon } from '$lib/utils/comfyUI';

const result = await generateBoardSpaceIcon('opportunity', '#21940f');
```

#### Generate Dream Card
```typescript
import { generateDreamImage } from '$lib/utils/comfyUI';

const result = await generateDreamImage(
  'World Traveler',
  'Travel the world in style'
);
```

#### Generate Background
```typescript
import { generateBackground } from '$lib/utils/comfyUI';

const result = await generateBackground('board');
```

#### Batch Generation
```typescript
import { batchGenerateImages } from '$lib/utils/comfyUI';

const requests = [
  { prompt: 'Card 1', width: 512, height: 768 },
  { prompt: 'Card 2', width: 512, height: 768 },
  { prompt: 'Card 3', width: 512, height: 768 }
];

const results = await batchGenerateImages(requests, 2); // 2 concurrent
```

#### Check Connection
```typescript
import { checkComfyUIConnection } from '$lib/utils/comfyUI';

const isConnected = await checkComfyUIConnection();
if (!isConnected) {
  console.error('ComfyUI server not available');
}
```

## API Reference

### `generateImage(options: GenerationOptions): Promise<GenerationResult>`

Generate a custom image with full control over parameters.

**Options:**
- `prompt` (string, required): Text prompt for generation
- `width` (number, optional): Image width (default: 1024)
- `height` (number, optional): Image height (default: 1024)
- `seed` (number, optional): Random seed (default: random)
- `steps` (number, optional): Number of steps (default: 4)
- `cfg` (number, optional): CFG scale (default: 1)
- `batch_size` (number, optional): Number of images (default: 1)

**Returns:**
- `images`: Array of base64 encoded images
- `seed`: Seed used for generation
- `prompt`: Prompt used

### `generateCardImage(cardType, description): Promise<GenerationResult>`

Generate a card image for the game.

**Card Types:**
- `small-deal`: Small investment opportunities
- `big-deal`: Major investment opportunities
- `doodad`: Luxury expenses
- `opportunity`: Business opportunities
- `charity`: Charitable giving
- `paycheck`: Income events
- `downsize`: Job loss events

### `generatePlayerAvatar(profession, style): Promise<GenerationResult>`

Generate a player avatar.

**Professions:**
Airline Pilot, Business Manager, Doctor, Engineer, Janitor, Lawyer, Mechanic, Nurse, Police Officer, Secretary, Teacher, Truck Driver

**Styles:**
- `professional`: Corporate business style
- `casual`: Friendly approachable style
- `creative`: Artistic dynamic style

### `generateBoardSpaceIcon(spaceType, color): Promise<GenerationResult>`

Generate an icon for a board space.

**Space Types:**
- `opportunity`: Green opportunity spaces
- `liability`: Red liability spaces
- `charity`: Gold charity spaces
- `paycheck`: Yellow paycheck spaces
- `offer`: Blue offer spaces
- `downsize`: Teal downsize spaces
- `child`: Pink child spaces

### `generateDreamImage(dreamName, description): Promise<GenerationResult>`

Generate a dream card image.

### `generateBackground(theme): Promise<GenerationResult>`

Generate a background image.

**Themes:**
- `board`: Game board background
- `card`: Card background
- `menu`: Menu background
- `victory`: Victory celebration
- `defeat`: Defeat screen

### `batchGenerateImages(requests, concurrency): Promise<GenerationResult[]>`

Generate multiple images with controlled concurrency.

### `checkComfyUIConnection(): Promise<boolean>`

Check if the ComfyUI server is available.

## Workflow

The utility uses the `image_z_image_turbo.json` workflow which is optimized for fast generation:
- **Model**: z_image_turbo_bf16
- **Steps**: 4 (fast generation)
- **Sampler**: res_multistep
- **Scheduler**: simple

## Performance

- **Generation Time**: ~2-5 seconds per image
- **Recommended Batch Size**: 2-4 concurrent requests
- **Image Sizes**: 
  - Cards: 512x768
  - Avatars: 512x512
  - Icons: 256x256
  - Backgrounds: 1920x1080

## Error Handling

All functions throw errors on failure. Wrap calls in try-catch:

```typescript
try {
  const result = await generateImage({ prompt: 'Test' });
  // Handle success
} catch (error) {
  console.error('Generation failed:', error);
  // Handle error
}
```

## Troubleshooting

### Connection Failed
- Verify ComfyUI is running at `http://p510:8188/`
- Check network connectivity
- Verify firewall settings

### Generation Failed
- Check ComfyUI logs for errors
- Verify all required models are installed
- Check available GPU memory

### Slow Generation
- Reduce image dimensions
- Reduce number of steps
- Check GPU utilization

## Future Enhancements

- [ ] Image-to-image generation
- [ ] Style transfer
- [ ] Custom model support
- [ ] Progress tracking
- [ ] WebSocket integration for real-time updates
- [ ] Image caching
- [ ] Batch optimization