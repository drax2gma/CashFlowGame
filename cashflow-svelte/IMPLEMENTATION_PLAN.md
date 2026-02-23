# CashFlow Game - Missing Features Implementation Plan

## Overview
This document outlines the implementation plan for missing features in the CashFlow SvelteKit application, organized by priority and dependency.

---

## Phase 1: Core Game Flow (Critical)

### 1.1 Connect Setup to Game Store
**Priority**: P0 (Blocking)  
**Estimated Time**: 2-3 hours  
**Dependencies**: None

#### Tasks:
- [ ] Update `setup/+page.svelte` to use `gameActions.initializeGame()`
- [ ] Add proper player initialization with job salaries and expenses
- [ ] Implement navigation to game board after setup
- [ ] Add validation for player names and selections
- [ ] Store game configuration in gameStore

#### Files to Modify:
- `src/routes/setup/+page.svelte`
- `src/lib/stores/gameStore.ts`

#### Implementation Details:
```typescript
// Job configurations with salaries and expenses
const jobConfigs = {
  'Airline Pilot': { salary: 9500, expenses: 3500 },
  'Business Manager': { salary: 4600, expenses: 2500 },
  'Doctor (MD)': { salary: 13200, expenses: 6000 },
  // ... etc
};
```

---

### 1.2 Bankruptcy Detection System
**Priority**: P0 (Critical)  
**Estimated Time**: 4-5 hours  
**Dependencies**: 1.1

#### Tasks:
- [ ] Add bankruptcy check after each financial transaction
- [ ] Implement `checkBankruptcy()` in gameStore
- [ ] Create bankruptcy modal component
- [ ] Add asset liquidation UI (sell at 50% value)
- [ ] Handle player elimination in multiplayer
- [ ] Show game over screen when all players bankrupt

#### Files to Create:
- `src/lib/components/BankruptcyModal.svelte`
- `src/lib/components/GameOverModal.svelte`

#### Files to Modify:
- `src/lib/stores/gameStore.ts`
- `src/routes/game/+page.svelte`

#### Game Store Additions:
```typescript
interface Player {
  // ... existing fields
  isBankrupt: boolean;
  debt: boolean;
  loanApproval: boolean;
}

// Add to gameActions
checkBankruptcy: (playerId: number) => BankruptcyStatus;
liquidateAsset: (playerId: number, assetId: string) => void;
eliminatePlayer: (playerId: number) => void;
```

---

### 1.3 Win Conditions & Fast Track
**Priority**: P0 (Critical)  
**Estimated Time**: 6-8 hours  
**Dependencies**: 1.1, 1.2

#### Tasks:
- [ ] Calculate passive income vs total expenses
- [ ] Detect fast track eligibility
- [ ] Create fast track transition modal
- [ ] Implement fast track board (outer track)
- [ ] Add dream selection and achievement
- [ ] Implement win condition (achieve dream)
- [ ] Create victory screen

#### Files to Create:
- `src/lib/components/FastTrackModal.svelte`
- `src/lib/components/VictoryModal.svelte`
- `src/lib/components/DreamSelectionModal.svelte`

#### Files to Modify:
- `src/lib/stores/gameStore.ts`
- `src/routes/game/+page.svelte`

#### Game Store Additions:
```typescript
interface Player {
  // ... existing fields
  passiveIncome: number;
  totalExpenses: number;
  fastTrack: boolean;
  dream: Dream | null;
}

interface Dream {
  id: string;
  name: string;
  cost: number;
  description: string;
}

// Add to gameActions
checkFastTrackEligibility: (playerId: number) => boolean;
enterFastTrack: (playerId: number) => void;
checkWinCondition: (playerId: number) => boolean;
```

---

### 1.4 Game Persistence (Save/Load)
**Priority**: P1 (High)  
**Estimated Time**: 3-4 hours  
**Dependencies**: 1.1, 1.2, 1.3

#### Tasks:
- [ ] Implement localStorage save functionality
- [ ] Create save game modal with slots
- [ ] Add load game functionality
- [ ] Auto-save after each turn
- [ ] Add save/load buttons to game UI
- [ ] Handle save versioning for future updates

#### Files to Create:
- `src/lib/utils/gamePersistence.ts`
- `src/lib/components/SaveGameModal.svelte`
- `src/lib/components/LoadGameModal.svelte`

#### Implementation:
```typescript
// gamePersistence.ts
export const saveGame = (slot: number, gameState: GameState) => {
  const save = {
    version: '1.0.0',
    timestamp: Date.now(),
    gameState
  };
  localStorage.setItem(`cashflow_save_${slot}`, JSON.stringify(save));
};

export const loadGame = (slot: number): GameState | null => {
  const save = localStorage.getItem(`cashflow_save_${slot}`);
  return save ? JSON.parse(save).gameState : null;
};

export const getSaveSlots = (): SaveSlot[] => {
  // Return list of saved games with metadata
};
```

---

## Phase 2: Enhanced Gameplay (Important)

### 2.1 Dream Phase Implementation
**Priority**: P1 (High)  
**Estimated Time**: 4-5 hours  
**Dependencies**: 1.1

#### Tasks:
- [ ] Create dream selection UI
- [ ] Add dream cards with perks
- [ ] Implement dream tracking
- [ ] Show dream progress on dashboard
- [ ] Add dream achievement bonus

#### Files to Create:
- `src/lib/data/dreams.ts`
- `src/lib/components/DreamCard.svelte`

#### Dreams Data:
```typescript
export const dreams = [
  {
    id: 'world-travel',
    name: 'World Traveler',
    cost: 500000,
    perk: '10% discount on doodads',
    description: 'Travel the world in style'
  },
  // ... more dreams
];
```

---

### 2.2 Charity Mechanics
**Priority**: P2 (Medium)  
**Estimated Time**: 2-3 hours  
**Dependencies**: 1.1

#### Tasks:
- [ ] Add charity donation option
- [ ] Implement 3 dice rolls for 3 turns
- [ ] Track charity turns remaining
- [ ] Add charity UI indicator

#### Game Store Additions:
```typescript
interface Player {
  // ... existing fields
  charityTurns: number;
}
```

---

### 2.3 Child Events
**Priority**: P2 (Medium)  
**Estimated Time**: 2-3 hours  
**Dependencies**: 1.1

#### Tasks:
- [ ] Create child event cards
- [ ] Add child expense tracking
- [ ] Update financial statement
- [ ] Add child per player limit

#### Game Store Additions:
```typescript
interface Player {
  // ... existing fields
  children: number;
  childExpenses: number;
}
```

---

### 2.4 Downsize Mechanics
**Priority**: P2 (Medium)  
**Estimated Time**: 2-3 hours  
**Dependencies**: 1.1

#### Tasks:
- [ ] Implement downsize landing action
- [ ] Add 2 turn skip mechanic
- [ ] Track downsized turns
- [ ] Show downsized indicator
- [ ] Auto-skip turns for downsized players

#### Game Store Additions:
```typescript
interface Player {
  // ... existing fields
  isDownsized: boolean;
  downsizedTurns: number;
}
```

---

## Phase 3: Statistics & Social (Enhancement)

### 3.1 Game Statistics Persistence
**Priority**: P3 (Low)  
**Estimated Time**: 4-5 hours  
**Dependencies**: 1.4

#### Tasks:
- [ ] Create statistics database schema
- [ ] Track game history
- [ ] Calculate player statistics
- [ ] Add statistics dashboard
- [ ] Show win/loss ratios
- [ ] Track average game duration

#### Files to Create:
- `src/lib/server/db/schema.ts`
- `src/lib/server/db/statistics.ts`
- `src/routes/api/stats/+server.ts`

---

### 3.2 Leaderboard System
**Priority**: P3 (Low)  
**Estimated Time**: 6-8 hours  
**Dependencies**: 3.1

#### Tasks:
- [ ] Design leaderboard database schema
- [ ] Create leaderboard API endpoints
- [ ] Build leaderboard UI
- [ ] Add filters (daily, weekly, all-time)
- [ ] Implement ranking algorithm
- [ ] Add player profiles

#### Files to Create:
- `src/routes/leaderboard/+page.svelte`
- `src/lib/components/LeaderboardTable.svelte`
- `src/lib/server/db/leaderboard.ts`

---

### 3.3 Achievement System Enhancement
**Priority**: P3 (Low)  
**Estimated Time**: 3-4 hours  
**Dependencies**: 3.1

#### Tasks:
- [ ] Connect achievements to game events
- [ ] Implement achievement unlocking
- [ ] Add achievement notifications
- [ ] Persist achievements to storage
- [ ] Show achievement progress

#### Files to Modify:
- `src/routes/achievements/+page.svelte`
- `src/lib/stores/gameStore.ts`

---

## Phase 4: Polish & UX (Nice to Have)

### 4.1 Game End Statistics
**Priority**: P4 (Low)  
**Estimated Time**: 2-3 hours  
**Dependencies**: 1.3

#### Tasks:
- [ ] Create end game summary screen
- [ ] Show game statistics
- [ ] Display player rankings
- [ ] Add share functionality
- [ ] Show play again option

---

### 4.2 Tutorial System
**Priority**: P4 (Low)  
**Estimated Time**: 4-5 hours  
**Dependencies**: None

#### Tasks:
- [ ] Create tutorial overlay
- [ ] Add step-by-step guidance
- [ ] Highlight UI elements
- [ ] Track tutorial completion

---

### 4.3 Sound Effects & Music
**Priority**: P4 (Low)  
**Estimated Time**: 2-3 hours  
**Dependencies**: None

#### Tasks:
- [ ] Add sound effects for actions
- [ ] Implement background music
- [ ] Add volume controls
- [ ] Create audio manager

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

## Testing Strategy

### Unit Tests
- Game store actions
- Bankruptcy calculations
- Win condition checks
- Save/load functionality

### Integration Tests
- Full game flow
- Multiplayer scenarios
- Edge cases (bankruptcy, fast track)

### E2E Tests
- Complete game from setup to victory
- Save and resume game
- Multiplayer game

---

## Risk Mitigation

### Technical Risks
1. **State Management Complexity**
   - Mitigation: Use derived stores for computed values
   - Add comprehensive logging

2. **Performance with Multiple Players**
   - Mitigation: Optimize re-renders
   - Use efficient data structures

3. **Save Game Compatibility**
   - Mitigation: Version saves
   - Add migration system

### UX Risks
1. **Complexity Overload**
   - Mitigation: Progressive disclosure
   - Tutorial system

2. **Mobile Responsiveness**
   - Mitigation: Test on multiple devices
   - Adaptive layouts

---

## Success Metrics

### Phase 1 Success
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

### Phase 4 Success
- [ ] Tutorial completion > 80%
- [ ] User satisfaction > 4.0/5.0
- [ ] Game completion rate > 60%