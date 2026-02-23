# CashFlow Game - Workflow & Implementation Summary

## Current Workflow Status

### ✅ Implemented Features

#### 1. Players Setup (`/setup`)
- Player count selection (1-8 players)
- Player name input
- Job/profession selection (13 options)
- Color selection (8 colors)
- Insurance checkbox
- **Status**: UI complete, needs connection to game store

#### 2. Game Board (`/game`)
- 24-space circular board
- Dice rolling mechanics
- Player movement
- Card drawing system
- Buy/sell/pass actions
- Financial tracking (cash, assets, liabilities)
- **Status**: Core mechanics working, missing advanced features

#### 3. Dashboard (`/dashboard`)
- Game status display
- Player overview
- Statistics tracking
- Recent activity (placeholder)
- **Status**: Basic functionality complete

#### 4. Achievements (`/achievements`)
- Achievement display
- Progress tracking
- **Status**: Static, needs persistence

#### 5. Graphics Generator (`/graphics`) 🆕
- AI-powered graphics generation
- Multiple generation types (cards, avatars, backgrounds)
- ComfyUI integration
- **Status**: Fully functional

---

## Missing Features Implementation Plan

### Phase 1: Core Game Flow (Critical)

#### 1.1 Setup to Game Connection
**Priority**: P0 | **Time**: 2-3 hours

**Current Gap**: Setup page doesn't initialize game store

**Implementation**:
```typescript
// setup/+page.svelte
function startGame() {
  const players = /* collect player data */;
  gameActions.initializeGame(players);
  goto('/game');
}
```

**Files to Modify**:
- `src/routes/setup/+page.svelte`
- `src/lib/stores/gameStore.ts`

---

#### 1.2 Bankruptcy Detection
**Priority**: P0 | **Time**: 4-5 hours

**Current Gap**: No bankruptcy detection or handling

**Implementation**:
```typescript
// gameStore.ts
checkBankruptcy: (playerId: number) => {
  const player = state.players[playerId];
  if (player.cash < 0 && player.payday < 0) {
    // Show bankruptcy modal
    // Allow asset liquidation at 50%
    // Handle player elimination
  }
}
```

**Files to Create**:
- `src/lib/components/BankruptcyModal.svelte`
- `src/lib/components/GameOverModal.svelte`

---

#### 1.3 Win Conditions & Fast Track
**Priority**: P0 | **Time**: 6-8 hours

**Current Gap**: No fast track mode or win detection

**Implementation**:
```typescript
// gameStore.ts
checkFastTrackEligibility: (playerId: number) => {
  const player = state.players[playerId];
  return player.passiveIncome >= player.totalExpenses;
}

enterFastTrack: (playerId: number) => {
  // Transition to fast track board
  // Update game phase
  // Show fast track intro
}
```

**Files to Create**:
- `src/lib/components/FastTrackModal.svelte`
- `src/lib/components/VictoryModal.svelte`
- `src/lib/components/DreamSelectionModal.svelte`

---

#### 1.4 Game Persistence
**Priority**: P1 | **Time**: 3-4 hours

**Current Gap**: No save/load functionality

**Implementation**:
```typescript
// utils/gamePersistence.ts
export const saveGame = (slot: number, state: GameState) => {
  localStorage.setItem(`cashflow_save_${slot}`, JSON.stringify({
    version: '1.0.0',
    timestamp: Date.now(),
    state
  }));
}
```

**Files to Create**:
- `src/lib/utils/gamePersistence.ts`
- `src/lib/components/SaveGameModal.svelte`
- `src/lib/components/LoadGameModal.svelte`

---

### Phase 2: Enhanced Gameplay

#### 2.1 Dream Phase
**Priority**: P1 | **Time**: 4-5 hours

**Implementation**: Add dream selection at game start with perks

#### 2.2 Charity Mechanics
**Priority**: P2 | **Time**: 2-3 hours

**Implementation**: 3 dice rolls for 3 turns after charity donation

#### 2.3 Child Events
**Priority**: P2 | **Time**: 2-3 hours

**Implementation**: Child expense tracking and events

#### 2.4 Downsize Mechanics
**Priority**: P2 | **Time**: 2-3 hours

**Implementation**: 2 turn skip when landing on downsize

---

### Phase 3: Statistics & Social

#### 3.1 Game Statistics Persistence
**Priority**: P3 | **Time**: 4-5 hours

**Implementation**: Database-backed statistics tracking

#### 3.2 Leaderboard System
**Priority**: P3 | **Time**: 6-8 hours

**Implementation**: Global and friend leaderboards

#### 3.3 Achievement System Enhancement
**Priority**: P3 | **Time**: 3-4 hours

**Implementation**: Persistent achievements with unlocking

---

## ComfyUI Graphics Generator

### Features
✅ **Implemented**:
- Custom image generation
- Card image generation (7 types)
- Player avatar generation (12 professions, 3 styles)
- Board space icon generation (7 types)
- Dream card generation
- Background generation (5 themes)
- Batch generation with concurrency control
- Connection status checking
- Image download functionality
- Generation history

### Usage
```typescript
// Generate a card
import { generateCardImage } from '$lib/utils/comfyUI';
const result = await generateCardImage('small-deal', 'Buy rental property');

// Generate an avatar
import { generatePlayerAvatar } from '$lib/utils/comfyUI';
const avatar = await generatePlayerAvatar('Engineer', 'professional');
```

### Web Interface
Navigate to `/graphics` to use the graphical interface.

### Configuration
- **Server**: `http://p510:8188/`
- **Workflow**: `image_z_image_turbo.json`
- **Models**: z_image_turbo_bf16, qwen_3_4b, ae.safetensors

---

## Implementation Timeline

### Week 1: Core Flow
- Day 1-2: Setup connection (1.1)
- Day 3-4: Bankruptcy system (1.2)
- Day 5-7: Win conditions & Fast Track (1.3)

### Week 2: Persistence & Dreams
- Day 1-2: Save/Load system (1.4)
- Day 3-5: Dream phase (2.1)

### Week 3: Gameplay Mechanics
- Day 1-2: Charity (2.2)
- Day 3-4: Child events (2.3)
- Day 5-6: Downsize (2.4)

### Week 4: Statistics & Polish
- Day 1-3: Statistics persistence (3.1)
- Day 4-5: Leaderboards (3.2)
- Day 6-7: Achievements (3.3)

---

## File Structure

### New Files Created
```
cashflow-svelte/
├── IMPLEMENTATION_PLAN.md          # Detailed implementation plan
├── src/
│   ├── lib/
│   │   ├── utils/
│   │   │   ├── comfyUI.ts          # ComfyUI integration
│   │   │   └── COMFYUI_README.md   # ComfyUI documentation
│   │   └── components/
│   │       └── GraphicsGenerator.svelte  # Graphics generator UI
│   └── routes/
│       └── graphics/
│           └── +page.svelte        # Graphics generator page
```

### Files to Create (Future)
```
cashflow-svelte/
├── src/
│   ├── lib/
│   │   ├── utils/
│   │   │   └── gamePersistence.ts  # Save/load functionality
│   │   ├── components/
│   │   │   ├── BankruptcyModal.svelte
│   │   │   ├── GameOverModal.svelte
│   │   │   ├── FastTrackModal.svelte
│   │   │   ├── VictoryModal.svelte
│   │   │   ├── DreamSelectionModal.svelte
│   │   │   ├── SaveGameModal.svelte
│   │   │   └── LoadGameModal.svelte
│   │   └── data/
│   │       └── dreams.ts           # Dream configurations
│   └── routes/
│       └── leaderboard/
│           └── +page.svelte        # Leaderboard page
```

---

## Testing Strategy

### Unit Tests
- Game store actions
- Bankruptcy calculations
- Win condition checks
- Save/load functionality
- ComfyUI integration

### Integration Tests
- Full game flow
- Multiplayer scenarios
- Edge cases

### E2E Tests
- Complete game from setup to victory
- Save and resume game
- Graphics generation

---

## Success Metrics

### Phase 1 Success ✅
- [ ] Players can complete full game
- [ ] Bankruptcy properly detected
- [ ] Fast track entry works
- [ ] Games can be saved/loaded

### Phase 2 Success
- [ ] All game mechanics functional
- [ ] Dream phase integrated
- [ ] Special events working

### Phase 3 Success
- [ ] Statistics tracked
- [ ] Leaderboards populated
- [ ] Achievements unlocking

---

## Next Steps

1. **Immediate**: Connect setup page to game store
2. **This Week**: Implement bankruptcy detection
3. **Next Week**: Add fast track mode
4. **This Month**: Complete all core features

---

## Resources

- **Implementation Plan**: `IMPLEMENTATION_PLAN.md`
- **ComfyUI Documentation**: `src/lib/utils/COMFYUI_README.md`
- **Original Game**: `js/index.js` (reference implementation)
- **Game Store**: `src/lib/stores/gameStore.ts`
- **Card Data**: `src/lib/game/cardData.ts`