/**
 * ComfyUI Graphics Generation Utility
 * 
 * This utility generates graphics elements for the CashFlow game using ComfyUI.
 * Server: http://p510:8188/
 * Workflow: image_z_image_turbo.json
 */

interface ComfyUINode {
  inputs: Record<string, any>;
  class_type: string;
  _meta?: {
    title: string;
  };
}

interface ComfyUIWorkflow {
  [key: string]: ComfyUINode;
}

interface GenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
  steps?: number;
  cfg?: number;
  batch_size?: number;
}

interface GenerationResult {
  images: string[];
  seed: number;
  prompt: string;
}

const COMFYUI_URL = 'http://p510:8188';

// Default workflow from image_z_image_turbo.json
const DEFAULT_WORKFLOW: ComfyUIWorkflow = {
  "9": {
    "inputs": {
      "filename_prefix": "cashflow-card",
      "images": ["57:8", 0]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  },
  "57:30": {
    "inputs": {
      "clip_name": "qwen_3_4b.safetensors",
      "type": "lumina2",
      "device": "default"
    },
    "class_type": "CLIPLoader",
    "_meta": {
      "title": "Load CLIP"
    }
  },
  "57:29": {
    "inputs": {
      "vae_name": "ae.safetensors"
    },
    "class_type": "VAELoader",
    "_meta": {
      "title": "Load VAE"
    }
  },
  "57:33": {
    "inputs": {
      "conditioning": ["57:27", 0]
    },
    "class_type": "ConditioningZeroOut",
    "_meta": {
      "title": "ConditioningZeroOut"
    }
  },
  "57:8": {
    "inputs": {
      "samples": ["57:3", 0],
      "vae": ["57:29", 0]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "57:28": {
    "inputs": {
      "unet_name": "z_image_turbo_bf16.safetensors",
      "weight_dtype": "default"
    },
    "class_type": "UNETLoader",
    "_meta": {
      "title": "Load Diffusion Model"
    }
  },
  "57:27": {
    "inputs": {
      "text": "",
      "clip": ["57:30", 0]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "57:13": {
    "inputs": {
      "width": 1024,
      "height": 1024,
      "batch_size": 1
    },
    "class_type": "EmptySD3LatentImage",
    "_meta": {
      "title": "EmptySD3LatentImage"
    }
  },
  "57:3": {
    "inputs": {
      "seed": 0,
      "steps": 4,
      "cfg": 1,
      "sampler_name": "res_multistep",
      "scheduler": "simple",
      "denoise": 1,
      "model": ["57:11", 0],
      "positive": ["57:27", 0],
      "negative": ["57:33", 0],
      "latent_image": ["57:13", 0]
    },
    "class_type": "KSampler",
    "_meta": {
      "title": "KSampler"
    }
  },
  "57:11": {
    "inputs": {
      "shift": 3,
      "model": ["57:28", 0]
    },
    "class_type": "ModelSamplingAuraFlow",
    "_meta": {
      "title": "ModelSamplingAuraFlow"
    }
  }
};

/**
 * Generate a random seed
 */
function generateSeed(): number {
  return Math.floor(Math.random() * 1000000000000000);
}

/**
 * Create a workflow with custom options
 */
function createWorkflow(options: GenerationOptions): ComfyUIWorkflow {
  const workflow = JSON.parse(JSON.stringify(DEFAULT_WORKFLOW));
  
  // Set prompt
  workflow["57:27"].inputs.text = options.prompt;
  
  // Set dimensions
  if (options.width) {
    workflow["57:13"].inputs.width = options.width;
  }
  if (options.height) {
    workflow["57:13"].inputs.height = options.height;
  }
  
  // Set seed
  workflow["57:3"].inputs.seed = options.seed ?? generateSeed();
  
  // Set steps
  if (options.steps) {
    workflow["57:3"].inputs.steps = options.steps;
  }
  
  // Set CFG
  if (options.cfg) {
    workflow["57:3"].inputs.cfg = options.cfg;
  }
  
  // Set batch size
  if (options.batch_size) {
    workflow["57:13"].inputs.batch_size = options.batch_size;
  }
  
  return workflow;
}

/**
 * Queue a prompt on the ComfyUI server
 */
async function queuePrompt(workflow: ComfyUIWorkflow): Promise<string> {
  const response = await fetch(`${COMFYUI_URL}/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: workflow }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to queue prompt: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.prompt_id;
}

/**
 * Get the status of a generation task
 */
async function getHistory(promptId: string): Promise<any> {
  const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get history: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Wait for generation to complete
 */
async function waitForCompletion(promptId: string, timeout: number = 60000): Promise<any> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const history = await getHistory(promptId);
    
    if (history[promptId] && history[promptId].outputs) {
      return history[promptId];
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  throw new Error('Generation timed out');
}

/**
 * Get image from ComfyUI server
 */
async function getImage(filename: string, subfolder?: string, folderType?: string): Promise<Blob> {
  let url = `${COMFYUI_URL}/view?filename=${encodeURIComponent(filename)}`;
  
  if (subfolder) {
    url += `&subfolder=${encodeURIComponent(subfolder)}`;
  }
  if (folderType) {
    url += `&type=${encodeURIComponent(folderType)}`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to get image: ${response.statusText}`);
  }
  
  return response.blob();
}

/**
 * Convert blob to base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate an image using ComfyUI
 */
export async function generateImage(options: GenerationOptions): Promise<GenerationResult> {
  try {
    // Create workflow
    const workflow = createWorkflow(options);
    const seed = workflow["57:3"].inputs.seed;
    
    // Queue prompt
    const promptId = await queuePrompt(workflow);
    
    // Wait for completion
    const result = await waitForCompletion(promptId);
    
    // Get images
    const images: string[] = [];
    
    for (const nodeId of Object.keys(result.outputs)) {
      const output = result.outputs[nodeId];
      
      if (output.images) {
        for (const image of output.images) {
          const blob = await getImage(image.filename, image.subfolder, image.type);
          const base64 = await blobToBase64(blob);
          images.push(base64);
        }
      }
    }
    
    return {
      images,
      seed,
      prompt: options.prompt
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

/**
 * Generate a card image for the game
 */
export async function generateCardImage(
  cardType: 'small-deal' | 'big-deal' | 'doodad' | 'opportunity' | 'charity' | 'paycheck' | 'downsize',
  description: string
): Promise<GenerationResult> {
  const prompts: Record<string, string> = {
    'small-deal': `Financial opportunity card, small investment deal, ${description}, professional business illustration, clean design, modern style`,
    'big-deal': `Major investment opportunity card, large real estate or business deal, ${description}, professional illustration, corporate style`,
    'doodad': `Luxury expense card, consumer spending, ${description}, colorful illustration, playful style`,
    'opportunity': `Business opportunity card, chance for profit, ${description}, dynamic illustration, inspiring style`,
    'charity': `Charitable giving card, philanthropy, ${description}, warm illustration, heartwarming style`,
    'paycheck': `Payday card, income received, ${description}, money illustration, celebratory style`,
    'downsize': `Job loss card, financial setback, ${description}, dramatic illustration, serious style`
  };
  
  return generateImage({
    prompt: prompts[cardType] || description,
    width: 512,
    height: 768,
    steps: 4,
    cfg: 1
  });
}

/**
 * Generate a player avatar
 */
export async function generatePlayerAvatar(
  profession: string,
  style: 'professional' | 'casual' | 'creative' = 'professional'
): Promise<GenerationResult> {
  const stylePrompts = {
    professional: 'professional business portrait, corporate style, clean background',
    casual: 'friendly casual portrait, approachable style, soft lighting',
    creative: 'artistic portrait, creative style, dynamic composition'
  };
  
  return generateImage({
    prompt: `${profession} portrait, ${stylePrompts[style]}, high quality, detailed`,
    width: 512,
    height: 512,
    steps: 4,
    cfg: 1
  });
}

/**
 * Generate a board space icon
 */
export async function generateBoardSpaceIcon(
  spaceType: 'opportunity' | 'liability' | 'charity' | 'paycheck' | 'offer' | 'downsize' | 'child',
  color: string
): Promise<GenerationResult> {
  const descriptions: Record<string, string> = {
    opportunity: 'green opportunity icon, growth symbol, upward arrow',
    liability: 'red liability icon, expense symbol, downward arrow',
    charity: 'gold charity icon, heart symbol, giving hand',
    paycheck: 'yellow paycheck icon, money symbol, dollar sign',
    offer: 'blue offer icon, handshake symbol, deal sign',
    downsize: 'teal downsize icon, briefcase symbol, job loss',
    child: 'pink child icon, baby symbol, family addition'
  };
  
  return generateImage({
    prompt: `${descriptions[spaceType]}, ${color} color scheme, simple icon design, minimalist style, game board element`,
    width: 256,
    height: 256,
    steps: 4,
    cfg: 1
  });
}

/**
 * Generate a dream card image
 */
export async function generateDreamImage(
  dreamName: string,
  description: string
): Promise<GenerationResult> {
  return generateImage({
    prompt: `Dream achievement card, ${dreamName}, ${description}, inspirational illustration, aspirational style, golden accents, premium design`,
    width: 512,
    height: 768,
    steps: 4,
    cfg: 1
  });
}

/**
 * Generate a background for game UI
 */
export async function generateBackground(
  theme: 'board' | 'card' | 'menu' | 'victory' | 'defeat'
): Promise<GenerationResult> {
  const prompts: Record<string, string> = {
    board: 'game board background, financial district, city skyline, professional, subtle pattern',
    card: 'card background, elegant texture, subtle gradient, premium feel',
    menu: 'menu background, abstract financial theme, modern design, clean lines',
    victory: 'victory celebration background, golden confetti, triumphant, success theme',
    defeat: 'defeat background, somber mood, muted colors, learning opportunity theme'
  };
  
  return generateImage({
    prompt: prompts[theme],
    width: 1920,
    height: 1080,
    steps: 4,
    cfg: 1
  });
}

/**
 * Check if ComfyUI server is available
 */
export async function checkComfyUIConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${COMFYUI_URL}/system_stats`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('ComfyUI server not available:', error);
    return false;
  }
}

/**
 * Batch generate multiple images
 */
export async function batchGenerateImages(
  requests: GenerationOptions[],
  concurrency: number = 2
): Promise<GenerationResult[]> {
  const results: GenerationResult[] = [];
  
  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(request => generateImage(request))
    );
    results.push(...batchResults);
  }
  
  return results;
}

export type { GenerationOptions, GenerationResult };