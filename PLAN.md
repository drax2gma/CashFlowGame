# CashFlowJs Modernization Plan

## Overview
This plan outlines the migration of CashFlowJs from a vanilla JavaScript/jQuery application to a modern SvelteKit-based application with full i18n support and responsive mobile-first design.

## Current State Analysis

### Technology Stack (Current)
- **Framework**: Vanilla JavaScript with jQuery
- **Styling**: CSS files with media queries for mobile
- **Structure**: Single-page application with inline HTML
- **Game Logic**: JavaScript modules (APP, board, cards, display, options, fasttrack)

### Key Components Identified
1. **Game State Management**: `APP` object with players, turn tracking
2. **Board System**: 24-square board with different space types
3. **Card Systems**: Small deal, big deal, career, and opportunity cards
4. **Player Management**: Up to 8 players with customizable settings
5. **Game Modes**: Rat Race, Fast Track, and rule customizations
6. **UI Components**: Home screen, setup screen, game board, finance boxes, card displays

---

## Objective 1: i18n Translation Engine

### Implementation Steps

#### 1.1 Setup i18n Infrastructure
- [ ] Choose i18n library (recommended: `svelte-i18n` or `linguist`)
- [ ] Create directory structure: `src/lib/i18n/`
- [ ] Set up translation configuration in SvelteKit
- [ ] Create default language file (`en.json`)

#### 1.2 Extract All Text Content
- [ ] Create translation keys for:
  - UI labels (buttons, form fields, headings)
  - Game messages and notifications
  - Card descriptions and rules
  - Job titles and descriptions
  - Space types on board
  - Game mode options
  - Help and instructions

#### 1.3 Implement Translation System
- [ ] Create reusable translation components
- [ ] Add language selector UI
- [ ] Implement runtime language switching
- [ ] Add fallback language handling

#### 1.4 Prepare for Translations
- [ ] Document translation key structure
- [ ] Create template for translators
- [ ] Set up translation management workflow

---

## Objective 2: Modern Responsive UI (Mobile-First)

### Design System

#### 2.1 Design Principles
- Mobile-first approach
- Touch-friendly interfaces (minimum 44px touch targets)
- Responsive grid layout
- Accessible color contrast (WCAG AA minimum)
- Progressive enhancement

#### 2.2 Color Palette (Updated)
- Primary: `#1976D2` (Material Blue)
- Secondary: `#424242` (Dark Grey)
- Success: `#4CAF50` (Green)
- Warning: `#FFC107` (Amber)
- Error: `#F44336` (Red)
- Background: `#FAFAFA` (Light Grey)
- Surface: `#FFFFFF` (White)

#### 2.3 Typography
- Font Family: `Inter` or `Roboto` (system fonts fallback)
- Headings: H1-H6 with clear hierarchy
- Body: 16px minimum, readable line height (1.5)
- Monospace: For financial figures

### Layout Structure

#### 2.4 Breakpoints
```css
/* Mobile First */
xs: 0px   (phone portrait)
sm: 360px (phone landscape)
md: 480px (large phone/small tablet)
lg: 768px (tablet portrait)
xl: 1024px (tablet landscape)
2xl: 1280px (desktop)
```

#### 2.5 Key Screens Redesign

**Home Screen**
- Full-screen hero with game title
- Animated background
- Large, accessible buttons
- Version info and settings icon

**Game Selection**
- Card-based layout
- Quick join and create game options
- Recent games history

**Setup Screen**
- Collapsible player sections
- Responsive form layout
- Real-time preview of player settings
- Mobile-friendly dropdowns and checkboxes

**Game Board**
- Scrollable board (horizontal on mobile)
- Zoom/pan capability for small screens
- Collapsible player panels
- Bottom navigation for actions

**Player Finance Panel**
- Sticky/floating panel on mobile
- Expandable sections
- Visual cash flow indicators

**Card Display**
- Modal overlay for cards
- Swipe gestures for mobile
- Card details with expandable sections

### Component Redesign

#### 2.6 UI Components to Create
- [ ] Button (primary, secondary, danger, icon)
- [ ] Card (game board spaces, player info)
- [ ] Modal/Dialog (cards, confirmations)
- [ ] Select/Dropdown (mobile-friendly)
- [ ] Checkbox/Radio (custom styled)
- [ ] Input fields (with floating labels)
- [ ] Tabs/Navigation
- [ ] Toast notifications
- [ ] Loading states
- [ ] Empty states

#### 2.7 Responsive Patterns
- Mobile: Bottom navigation, swipe gestures
- Tablet: Split views, side panels
- Desktop: Full feature layout with sidebar

---

## Objective 3: 3D Card Effects System

### Overview
Implement immersive 3D card handling effects to enhance the gaming experience. Cards should feel tactile and premium, with smooth animations and realistic physics.

### Technology Stack
- **CSS 3D Transforms**: `transform-style: preserve-3d`, `perspective`, `rotateX/Y/Z`
- **Web Animations API**: For smooth, performant animations
- **Svelte Transitions**: Built-in transition system for enter/leave animations
- **Optional**: Three.js for advanced 3D effects (if needed)

### Card Design Specifications

#### 3.1 Card Structure
```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │  ← Card edge (3D depth)
│  │                       │  │
│  │    Card Front         │  │  ← Main content area
│  │    (visible face)     │  │
│  │                       │  │
│  │                       │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

#### 3.2 Card Dimensions
- **Desktop**: 280px × 400px (standard playing card ratio)
- **Tablet**: 220px × 315px
- **Mobile**: 180px × 260px
- **Card Depth**: 4-8px (3D effect)

#### 3.3 Card Types & Visual Design

| Card Type   | Primary Color      | Icon | Border Style       |
| ----------- | ------------------ | ---- | ------------------ |
| Small Deal  | `#4CAF50` (Green)  | 💰    | Solid, rounded     |
| Big Deal    | `#2196F3` (Blue)   | 🏢    | Solid, rounded     |
| Opportunity | `#FF9800` (Orange) | 🎯    | Dashed             |
| Doodad      | `#E91E63` (Pink)   | 🛍️    | Solid              |
| Charity     | `#9C27B0` (Purple) | ❤️    | Double             |
| Paycheck    | `#FFC107` (Amber)  | 💵    | Solid, gold accent |
| Downsized   | `#F44336` (Red)    | ⚠️    | Solid, warning     |

### 3D Effects Implementation

#### 3.4 Card Flip Animation
```css
/* Card flip with 3D perspective */
.card-container {
  perspective: 1000px;
}

.card {
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
}

.card-back {
  transform: rotateY(180deg);
}
```

#### 3.5 Hover Effects
- **Lift**: Card rises 10px on hover with shadow enhancement
- **Tilt**: Subtle 3D tilt following mouse position (parallax)
- **Glow**: Soft glow effect matching card type color
- **Scale**: 1.05x scale for emphasis

```css
.card:hover {
  transform: translateY(-10px) rotateX(5deg);
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.3),
    0 0 30px var(--card-glow-color);
}
```

#### 3.6 Card Deal Animation
1. **Deck to Hand**: Card slides from deck pile to player's hand
2. **Flip Reveal**: Card flips to reveal front face
3. **Bounce Settle**: Subtle bounce effect when card settles

#### 3.7 Card Stack Effects
- **Fan Display**: Cards fan out in arc when viewing hand
- **Stack Preview**: Peek at card edges in stack
- **Drag to Reorder**: Touch/drag to rearrange cards

### Interactive Behaviors

#### 3.8 Touch Interactions (Mobile)
- **Tap**: Flip card
- **Long Press**: Show card details in modal
- **Swipe Left/Right**: Navigate between cards in hand
- **Pinch**: Zoom card for details

#### 3.9 Desktop Interactions
- **Click**: Flip card
- **Double Click**: Play/use card
- **Right Click**: Context menu (details, discard)
- **Drag**: Move card between zones

### Card Modal/Overlay

#### 3.10 Full Card View
- Centered modal with 3D card
- Background blur effect
- Animated entrance (scale + fade)
- Detailed information panel
- Action buttons (Buy, Sell, Pass, etc.)

### Performance Considerations
- Use `will-change: transform` for animated cards
- Hardware acceleration with `transform: translateZ(0)`
- Limit number of 3D cards visible simultaneously
- Use CSS containment for card containers

---

## Objective 4: Audio System (MIDI & Sound Effects)

### Overview
Implement a comprehensive audio system for background music (MIDI) and sound effects to create an immersive gaming experience.

### Technology Stack
- **MIDI Playback**: `@tonejs/piano` or `soundfont-player` for MIDI synthesis
- **Web Audio API**: Native browser audio for sound effects
- **Howler.js**: Cross-browser audio library (fallback)
- **Audio Sprites**: For efficient sound effect loading

### Audio Architecture

#### 4.1 Directory Structure
```
static/
├── audio/
│   ├── midi/
│   │   ├── theme-main.mid
│   │   ├── theme-fasttrack.mid
│   │   └── theme-victory.mid
│   ├── sfx/
│   │   ├── card-flip.mp3
│   │   ├── card-deal.mp3
│   │   ├── dice-roll.mp3
│   │   ├── cash-register.mp3
│   │   ├── success.mp3
│   │   ├── error.mp3
│   │   └── notification.mp3
│   └── soundfonts/
│       └── instrument_*.json
```

#### 4.2 Audio Manager Module
```typescript
// src/lib/audio/AudioManager.ts
interface AudioManager {
  // MIDI Control
  playMidi(track: string, options?: MidiOptions): void;
  stopMidi(): void;
  pauseMidi(): void;
  setMidiVolume(volume: number): void;
  
  // Sound Effects
  playSfx(sound: SoundEffect): void;
  setSfxVolume(volume: number): void;
  
  // Master Control
  muteAll(): void;
  unmuteAll(): void;
  setMasterVolume(volume: number): void;
}
```

### MIDI Soundtrack System

#### 4.3 Background Music Tracks

| Track             | Trigger              | Mood                  | Tempo   |
| ----------------- | -------------------- | --------------------- | ------- |
| `theme-main`      | Game start, Rat Race | Upbeat, motivational  | 120 BPM |
| `theme-suspense`  | Big decision pending | Tense, anticipatory   | 90 BPM  |
| `theme-fasttrack` | Enter Fast Track     | Triumphant, energetic | 140 BPM |
| `theme-victory`   | Win game             | Celebratory, grand    | 160 BPM |
| `theme-menu`      | Main menu            | Calm, inviting        | 80 BPM  |

#### 4.4 MIDI Implementation
```typescript
// Using Tone.js for MIDI synthesis
import * as Tone from 'tone';

class MidiPlayer {
  private synth: Tone.PolySynth;
  private currentSequence: Tone.Sequence | null;
  
  async loadMidi(url: string): Promise<void> {
    // Load and parse MIDI file
  }
  
  play(): void {
    Tone.Transport.start();
  }
  
  pause(): void {
    Tone.Transport.pause();
  }
  
  setVolume(db: number): void {
    this.synth.volume.value = db;
  }
}
```

#### 4.5 Adaptive Music System
- **Layered Tracks**: Multiple instrument layers that fade in/out based on game state
- **Intensity Scaling**: Music intensity increases with game progression
- **Seamless Transitions**: Crossfade between tracks without jarring cuts

### Sound Effects Library

#### 4.6 Game Sound Effects

| Category  | Sound        | Trigger                 | File               |
| --------- | ------------ | ----------------------- | ------------------ |
| **Cards** | Flip         | Card flip animation     | `card-flip.mp3`    |
|           | Deal         | Card dealt to player    | `card-deal.mp3`    |
|           | Shuffle      | Deck shuffled           | `card-shuffle.mp3` |
|           | Place        | Card placed on table    | `card-place.mp3`   |
| **Dice**  | Roll         | Dice rolling            | `dice-roll.mp3`    |
|           | Land         | Dice stops              | `dice-land.mp3`    |
| **Money** | Receive      | Player receives money   | `cash-receive.mp3` |
|           | Spend        | Player spends money     | `cash-spend.mp3`   |
|           | Payday       | Paycheck collected      | `payday.mp3`       |
| **Game**  | Turn Start   | New player's turn       | `turn-start.mp3`   |
|           | Success      | Successful action       | `success.mp3`      |
|           | Error        | Invalid action          | `error.mp3`        |
|           | Notification | Alert/message           | `notification.mp3` |
|           | Victory      | Player wins             | `victory.mp3`      |
| **UI**    | Click        | Button click            | `click.mp3`        |
|           | Hover        | Button hover (optional) | `hover.mp3`        |
|           | Modal Open   | Modal appears           | `modal-open.mp3`   |
|           | Modal Close  | Modal dismissed         | `modal-close.mp3`  |

#### 4.7 Sound Effect Implementation
```typescript
// Using Web Audio API directly
class SoundEffectPlayer {
  private audioContext: AudioContext;
  private soundBuffers: Map<string, AudioBuffer>;
  
  async loadSound(name: string, url: string): Promise<void> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.soundBuffers.set(name, audioBuffer);
  }
  
  play(name: string, volume: number = 1.0): void {
    const buffer = this.soundBuffers.get(name);
    if (!buffer) return;
    
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start(0);
  }
}
```

### Audio Settings UI

#### 4.8 Settings Panel
```
┌─────────────────────────────────┐
│  🔊 Audio Settings              │
├─────────────────────────────────┤
│                                 │
│  🎵 Master Volume               │
│  ├───────────●────────────┤ 75% │
│                                 │
│  🎶 Music Volume                │
│  ├────────●───────────────┤ 60% │
│                                 │
│  🔔 Sound Effects               │
│  ├─────────────●──────────┤ 80% │
│                                 │
│  ☑ Enable Background Music      │
│  ☑ Enable Sound Effects         │
│  ☐ Enable UI Sounds             │
│                                 │
│  [Test Music] [Test SFX]        │
│                                 │
└─────────────────────────────────┘
```

#### 4.9 Audio Store (Svelte)
```typescript
// src/lib/stores/audioStore.ts
interface AudioSettings {
  masterVolume: number;    // 0-1
  musicVolume: number;     // 0-1
  sfxVolume: number;       // 0-1
  musicEnabled: boolean;
  sfxEnabled: boolean;
  uiSoundsEnabled: boolean;
}

const defaultSettings: AudioSettings = {
  masterVolume: 0.75,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  musicEnabled: true,
  sfxEnabled: true,
  uiSoundsEnabled: false
};

export const audioSettings = writable<AudioSettings>(defaultSettings);
```

### Performance & Accessibility

#### 4.10 Performance Optimizations
- Lazy load audio files on demand
- Preload critical sounds on game start
- Use audio sprites for small sound effects
- Compress audio files (MP3 128kbps for SFX, 192kbps for music)

#### 4.11 Accessibility Considerations
- Visual alternatives for all audio cues
- User control over all audio settings
- Respect `prefers-reduced-motion` for audio-triggered animations
- Screen reader announcements for important audio events

---

## Objective 5: SvelteKit Migration

### Architecture

#### 3.1 Project Structure
```
src/
├── lib/              # Reusable components
│   ├── components/   # UI components
│   ├── i18n/         # Translation files
│   ├── stores/       # Svelte stores for state
│   └── utils/        # Helper functions
├── routes/           # SvelteKit pages
│   ├── +page.svelte  # Home
│   ├── +layout.svelte
│   └── game/         # Game routes
│       ├── +page.svelte
│       └── [id]/     # Game instance
├── app.html          # HTML template
└── app.css           # Global styles
```

#### 3.2 State Management
- Use Svelte stores for reactive state
- Create stores for:
  - `gameStore` - Game state and logic
  - `playerStore` - Player data
  - `uiStore` - UI state (modals, notifications)
  - `settingsStore` - User preferences

#### 3.3 Game Logic Migration
- Move `APP` object to Svelte store
- Refactor modules:
  - `board.js` → `src/lib/game/board.js`
  - `cards.js` → `src/lib/game/cards.js`
  - `display.js` → `src/lib/game/display.js`
  - `options.js` → `src/lib/game/options.js`
  - `fasttrack.js` → `src/lib/game/fasttrack.js`

### Implementation Phases

#### Phase 1: Scaffolding (Week 1)
- [ ] Initialize SvelteKit project
- [ ] Configure TypeScript
- [ ] Set up ESLint/Prettier
- [ ] Configure Tailwind CSS or CSS framework
- [ ] Set up basic routing

#### Phase 2: Core Architecture (Week 2)
- [ ] Create Svelte stores for game state
- [ ] Migrate game logic modules
- [ ] Create base UI components
- [ ] Set up i18n infrastructure

#### Phase 3: UI Redesign (Week 3-4)
- [ ] Design system implementation
- [ ] Mobile-first component library
- [ ] Responsive layout implementation
- [ ] Animation and transitions
- [ ] **3D Card effects implementation**
- [ ] Card flip, hover, and deal animations

#### Phase 4: Audio System (Week 4-5)
- [ ] Set up Web Audio API infrastructure
- [ ] Implement MIDI player for background music
- [ ] Create sound effect library
- [ ] Build audio settings UI
- [ ] Integrate audio with game events

#### Phase 5: Game Flow (Week 5-6)
- [ ] Home screen implementation
- [ ] Game setup flow
- [ ] Board rendering
- [ ] Player interaction flows

#### Phase 6: Advanced Features (Week 7)
- [ ] Fast Track mode
- [ ] Game options/customization
- [ ] Card systems
- [ ] Multiplayer support (if applicable)

#### Phase 7: Polish (Week 8)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Documentation

---

## Task Dependencies

### Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 1: SCAFFOLDING                              │
│  ┌──────────────────┐                                                       │
│  │ Initialize       │                                                       │
│  │ SvelteKit        │                                                       │
│  │ Project          │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │ Configure        │───▶│ Set up ESLint/   │───▶│ Configure        │      │
│  │ TypeScript       │    │ Prettier         │    │ Tailwind CSS     │      │
│  └──────────────────┘    └──────────────────┘    └────────┬─────────┘      │
│                                                           │                │
│                                                           ▼                │
│                                                  ┌──────────────────┐      │
│                                                  │ Set up basic     │      │
│                                                  │ routing          │      │
│                                                  └────────┬─────────┘      │
└───────────────────────────────────────────────────────────┼────────────────┘
                                                            │
┌───────────────────────────────────────────────────────────┼────────────────┐
│                      PHASE 2: CORE ARCHITECTURE            │                │
│                                                           ▼                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Create Svelte stores                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ gameStore    │  │ playerStore  │  │ uiStore      │               │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │   │
│  │         │                 │                 │                        │   │
│  │         └─────────────────┼─────────────────┘                        │   │
│  │                           ▼                                          │   │
│  │                  ┌──────────────────┐                                │   │
│  │                  │ settingsStore    │                                │   │
│  │                  └────────┬─────────┘                                │   │
│  └───────────────────────────┼───────────────────────────────────────────┘   │
│                              │                                               │
│           ┌──────────────────┼──────────────────┐                           │
│           ▼                  ▼                  ▼                           │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐            │
│  │ Migrate game     │ │ Create base UI   │ │ Set up i18n      │            │
│  │ logic modules    │ │ components       │ │ infrastructure   │            │
│  └────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘            │
│           │                    │                    │                       │
│           │                    │                    │                       │
└───────────┼────────────────────┼────────────────────┼───────────────────────┘
            │                    │                    │
            │      ┌─────────────┴─────────────┐      │
            │      │                           │      │
┌───────────┼──────┼───────────────────────────┼──────┼───────────────────────┐
│           │      │   PHASE 3: UI REDESIGN    │      │                       │
│           │      │                           │      │                       │
│           │      ▼                           ▼      │                       │
│           │  ┌──────────────────┐  ┌──────────────────┐                    │
│           │  │ Design system    │  │ Translation      │                    │
│           │  │ implementation   │  │ components       │                    │
│           │  └────────┬─────────┘  └────────┬─────────┘                    │
│           │           │                     │                               │
│           │           ▼                     │                               │
│           │  ┌──────────────────┐          │                               │
│           │  │ Mobile-first     │          │                               │
│           │  │ component library│◀─────────┘                               │
│           │  └────────┬─────────┘                                          │
│           │           │                                                    │
│           │           ▼                                                    │
│           │  ┌──────────────────┐                                          │
│           │  │ Responsive       │                                          │
│           │  │ layout           │                                          │
│           │  └────────┬─────────┘                                          │
│           │           │                                                    │
│           │           ▼                                                    │
│           │  ┌──────────────────┐    ┌──────────────────┐                 │
│           │  │ Animation &      │───▶│ 3D Card effects  │                 │
│           │  │ transitions      │    │ implementation   │                 │
│           │  └──────────────────┘    └────────┬─────────┘                 │
│           │                                    │                           │
└───────────┼────────────────────────────────────┼───────────────────────────┘
            │                                    │
┌───────────┼────────────────────────────────────┼───────────────────────────┐
│           │      PHASE 4: AUDIO SYSTEM         │                           │
│           │                                    │                           │
│           │           ┌────────────────────────┘                           │
│           │           │                                                    │
│           │           ▼                                                    │
│           │  ┌──────────────────┐                                          │
│           │  │ Web Audio API    │                                          │
│           │  │ infrastructure   │                                          │
│           │  └────────┬─────────┘                                          │
│           │           │                                                    │
│           │     ┌─────┴─────┐                                              │
│           │     ▼           ▼                                              │
│           │  ┌──────────┐ ┌──────────────┐                                 │
│           │  │ MIDI     │ │ Sound effect │                                 │
│           │  │ player   │ │ library      │                                 │
│           │  └────┬─────┘ └──────┬───────┘                                 │
│           │       │              │                                          │
│           │       └──────┬───────┘                                          │
│           │              ▼                                                  │
│           │     ┌──────────────────┐                                        │
│           │     │ Audio settings   │                                        │
│           │     │ UI               │◀──── settingsStore (from Phase 2)      │
│           │     └────────┬─────────┘                                        │
│           │              │                                                  │
│           │              ▼                                                  │
│           │     ┌──────────────────┐                                        │
│           │     │ Integrate audio  │                                        │
│           │     │ with game events │◀──── gameStore (from Phase 2)         │
│           │     └──────────────────┘                                        │
│           │                                                                │
└───────────┼────────────────────────────────────────────────────────────────┘
            │
┌───────────┼────────────────────────────────────────────────────────────────┐
│           │        PHASE 5: GAME FLOW                                      │
│           │                                                                │
│           ▼                                                                │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                    Home screen implementation                       │   │
│  │  Requires: routing (P1), UI components (P2), i18n (P2)             │   │
│  └────────────────────────────────┬───────────────────────────────────┘   │
│                                   │                                        │
│                                   ▼                                        │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                    Game setup flow                                  │   │
│  │  Requires: Home screen, forms components, playerStore, i18n        │   │
│  └────────────────────────────────┬───────────────────────────────────┘   │
│                                   │                                        │
│                                   ▼                                        │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                    Board rendering                                  │   │
│  │  Requires: Game setup, gameStore, 3D cards (P3), responsive layout │   │
│  └────────────────────────────────┬───────────────────────────────────┘   │
│                                   │                                        │
│                                   ▼                                        │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                    Player interaction flows                         │   │
│  │  Requires: Board, audio (P4), animations, game logic modules       │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                        PHASE 6: ADVANCED FEATURES                          │
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │ Fast Track mode  │  │ Game options/    │  │ Card systems     │         │
│  │                  │  │ customization    │  │                  │         │
│  │ Requires:        │  │ Requires:        │  │ Requires:        │         │
│  │ - Board (P5)     │  │ - Setup (P5)     │  │ - 3D cards (P3)  │         │
│  │ - gameStore      │  │ - options.js     │  │ - cards.js       │         │
│  │ - fasttrack.js   │  │ - uiStore        │  │ - audio (P4)     │         │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘         │
│           │                     │                     │                   │
│           └─────────────────────┼─────────────────────┘                   │
│                                 │                                         │
│                                 ▼                                         │
│                       ┌──────────────────┐                                │
│                       │ Multiplayer      │                                │
│                       │ support          │                                │
│                       │ (if applicable)  │                                │
│                       │ Requires: ALL    │                                │
│                       │ above            │                                │
│                       └──────────────────┘                                │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 7: POLISH                                  │
│                                                                            │
│  All tasks in this phase depend on ALL previous phases being complete.     │
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │ Performance      │  │ Accessibility    │  │ Cross-browser    │         │
│  │ optimization     │  │ audit            │  │ testing          │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐                               │
│  │ Mobile testing   │  │ Documentation    │                               │
│  └──────────────────┘  └──────────────────┘                               │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Dependency Matrix

| Task                         | Depends On                      | Blocks                 |
| ---------------------------- | ------------------------------- | ---------------------- |
| **Phase 1**                  |                                 |                        |
| Initialize SvelteKit         | -                               | All Phase 2+           |
| Configure TypeScript         | Initialize SvelteKit            | All Phase 2+           |
| Set up ESLint/Prettier       | TypeScript                      | All Phase 2+           |
| Configure Tailwind CSS       | ESLint/Prettier                 | UI components          |
| Set up basic routing         | Tailwind CSS                    | All screens            |
| **Phase 2**                  |                                 |                        |
| Create Svelte stores         | Phase 1 complete                | All game logic         |
| Migrate game logic           | Svelte stores                   | Phase 5+               |
| Create base UI components    | Tailwind CSS, stores            | Phase 3+               |
| Set up i18n infrastructure   | Phase 1 complete                | Translation components |
| **Phase 3**                  |                                 |                        |
| Design system                | Base UI components              | All UI work            |
| Mobile-first components      | Design system                   | All screens            |
| Responsive layout            | Mobile-first components         | All screens            |
| Animation/transitions        | Responsive layout               | 3D cards               |
| 3D Card effects              | Animation/transitions           | Card systems, Board    |
| **Phase 4**                  |                                 |                        |
| Web Audio API infrastructure | Phase 1 complete                | All audio              |
| MIDI player                  | Web Audio API                   | Audio integration      |
| Sound effect library         | Web Audio API                   | Audio integration      |
| Audio settings UI            | settingsStore, UI components    | Audio integration      |
| Integrate audio with events  | MIDI, SFX, gameStore            | Phase 5+               |
| **Phase 5**                  |                                 |                        |
| Home screen                  | Routing, UI components, i18n    | Setup flow             |
| Game setup flow              | Home screen, forms, playerStore | Board                  |
| Board rendering              | Setup, gameStore, 3D cards      | Player interactions    |
| Player interactions          | Board, audio, game logic        | Phase 6+               |
| **Phase 6**                  |                                 |                        |
| Fast Track mode              | Board, gameStore, fasttrack.js  | Multiplayer            |
| Game options                 | Setup, options.js, uiStore      | Multiplayer            |
| Card systems                 | 3D cards, cards.js, audio       | Multiplayer            |
| Multiplayer support          | ALL Phase 1-6                   | Phase 7                |
| **Phase 7**                  |                                 |                        |
| All polish tasks             | ALL previous phases             | -                      |

### Critical Path

```
Initialize SvelteKit
    → Configure TypeScript
    → Configure Tailwind CSS
    → Set up routing
    → Create Svelte stores
    → Create base UI components
    → Design system
    → Mobile-first components
    → Responsive layout
    → Animation/transitions
    → 3D Card effects
    → Board rendering
    → Player interactions
    → Advanced features
    → Polish
```

**Critical Path Duration**: ~8 weeks (minimum time to complete)

### Parallel Work Opportunities

| Can Run In Parallel                                      | Shared Dependency   |
| -------------------------------------------------------- | ------------------- |
| i18n infrastructure + Game logic migration               | Phase 1 complete    |
| MIDI player + Sound effect library                       | Web Audio API setup |
| Fast Track mode + Game options + Card systems            | Phase 5 complete    |
| Performance optimization + Accessibility audit + Testing | Phase 6 complete    |

### Risk Dependencies

| Risk                     | Affects Tasks                    | Mitigation Priority           |
| ------------------------ | -------------------------------- | ----------------------------- |
| 3D performance on mobile | 3D Card effects, Board rendering | Test early (Phase 3)          |
| Audio browser support    | All audio tasks                  | Test early (Phase 4)          |
| Game logic complexity    | All Phase 5-6 tasks              | Thorough unit tests (Phase 2) |

---

## Technical Decisions

### Framework Choice: SvelteKit
- **Benefits**:
  - No virtual DOM (faster)
  - Built-in routing
  - SSR/SSG capabilities
  - TypeScript support
  - Excellent for SPAs

### Styling Approach
- **Option A**: Tailwind CSS (utility-first, rapid development)
- **Option B**: CSS Modules (scoped styling)
- **Recommendation**: Tailwind CSS with custom design system

### State Management
- Svelte stores (built-in reactivity)
- Local storage for persistence
- Session storage for temporary data

### Deployment
- Vercel (recommended for SvelteKit)
- Netlify
- GitHub Pages

---

## Migration Strategy

### Phased Approach
1. **Phase 1**: Create new SvelteKit app alongside existing app
2. **Phase 2**: Migrate one screen at a time
3. **Phase 3**: Keep both apps running, redirect traffic gradually
4. **Phase 4**: Deprecate old app

### Backward Compatibility
- Keep existing API endpoints if needed
- Maintain same game logic (no breaking changes)
- Data migration strategy for saved games

---

## Risks & Mitigation

| Risk                      | Impact | Mitigation                                 |
| ------------------------- | ------ | ------------------------------------------ |
| Learning curve for Svelte | Medium | Documentation, examples, gradual migration |
| Game logic complexity     | High   | Thorough testing, unit tests               |
| Mobile UX challenges      | Medium | User testing, iterative design             |
| Translation complexity    | Low    | Well-structured i18n system                |
| 3D performance on mobile  | Medium | CSS hardware acceleration, fallbacks       |
| Audio browser support     | Low    | Web Audio API polyfills, format fallbacks  |
| MIDI file licensing       | Low    | Use royalty-free or create original tracks |

---

## Success Criteria

- [ ] All original functionality preserved
- [ ] Mobile-first responsive design
- [ ] Full i18n support with English translation
- [ ] **3D card effects with smooth animations**
- [ ] **Audio system with MIDI music and sound effects**
- [ ] Performance metrics improved (LCP < 2.5s, FID < 100ms)
- [ ] Accessibility score > 90 (Lighthouse)
- [ ] Code maintainability improved (modular, tested)

---

## Timeline Estimate

- **Week 1-2**: Scaffolding + i18n setup
- **Week 3-4**: UI redesign + component library + 3D card effects
- **Week 4-5**: Audio system implementation
- **Week 5-6**: Game logic migration + core features
- **Week 7**: Advanced features
- **Week 8**: Testing + polish
- **Total**: ~8 weeks for MVP

---

## Next Steps

1. ✅ Create this plan document
2. Set up SvelteKit project
3. Implement i18n infrastructure
4. Design and implement UI components
5. **Implement 3D card effects system**
6. **Set up audio system with MIDI support**
7. Begin game logic migration
