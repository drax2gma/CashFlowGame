import { writable, derived } from 'svelte/store';
import { smallDealCards, bigDealCards, doodadCards, offerCards, type CardData } from '$lib/game/cardData';

// Define our types
export interface Player {
  id: number;
  name: string;
  color: string;
  job: string;
  insurance: boolean;
  cash: number;
  income: number;
  expenses: number;
  assets: Asset[];
  liabilities: Liability[];
  position: number;
  isDownsized: boolean;
  downsizedTurns: number;
  // Fast track fields
  passiveIncome: number;
  totalExpenses: number;
  fastTrack: boolean;
  dream: Dream | null;
  // Charity and special events
  charityTurns: number;
  children: number;
  childExpenses: number;
  // Bankruptcy fields
  isBankrupt: boolean;
  debt: boolean;
  loanApproval: boolean;
  // Job-specific fields
  salary: number;
  savings: number;
}

export interface Asset {
  id: string;
  type: 'stock' | 'realEstate' | 'business' | 'coin' | 'personal';
  name: string;
  value: number;
  income?: number;
  liability?: string; // For real estate that has a mortgage
}

export interface Liability {
  id: string;
  type: 'loan' | 'credit' | 'mortgage';
  name: string;
  amount: number;
  payment: number;
}

export interface Dream {
  id: string;
  name: string;
  cost: number;
  description: string;
  perk?: string;
}

export interface Card {
  id: string;
  type: 'small-deal' | 'big-deal' | 'opportunity' | 'doodad' | 'charity' | 'paycheck' | 'downsized' | 'offer';
  title: string;
  description: string;
  amount: number;
  cost?: number;
  income?: number;
  ROI?: number;
  // Extended properties from original cards
  symbol?: string;
  price?: number;
  range?: string;
  dividend?: boolean | number;
  downPayment?: number;
  mortgage?: number;
  cashFlow?: number;
  tag?: string;
  landType?: string;
  units?: number;
  propertyType?: string;
  loan?: number;
  payment?: number;
  child?: boolean;
  rule?: string;
  offer?: number;
  offerPerUnit?: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  turn: number;
  phase: 'setup' | 'ratRace' | 'fastTrack';
  board: BoardSpace[];
  deck: Card[];
  discardedCards: Card[];
  gameOver: boolean;
  winner: number | null;
  savedAt?: string; // ISO timestamp of when game was saved
}

export interface BoardSpace {
  type: 'opportunity' | 'liability' | 'charity' | 'offer' | 'payday' | 'downsize' | 'dream';
  name: string;
  color: string;
}

// Initial game state
const initialGameState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  turn: 1,
  phase: 'setup',
  board: [
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'liability', name: 'Liability', color: '#cc1f00' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'charity', name: 'Charity', color: 'gold' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'payday', name: 'Paycheck', color: '#e3ce00' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'offer', name: 'Offer', color: '#0082e3' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'liability', name: 'Liability', color: '#cc1f00' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'child', name: 'Child', color: '#00bd92' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'payday', name: 'Paycheck', color: '#e3ce00' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'offer', name: 'Offer', color: '#0082e3' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'liability', name: 'Liability', color: '#cc1f00' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'downsize', name: 'Downsize', color: 'teal' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'payday', name: 'Paycheck', color: '#e3ce00' },
    { type: 'opportunity', name: 'Opportunity', color: '#21940f' },
    { type: 'offer', name: 'Offer', color: '#0082e3' }
  ],
  deck: [],
  discardedCards: [],
  gameOver: false,
  winner: null
};

// Create the game store
export const gameStore = writable<GameState>(initialGameState);

// Derived stores for common calculations
export const currentPlayer = derived(gameStore, ($gameStore) => {
  return $gameStore.players[$gameStore.currentPlayerIndex];
});

export const currentPlayerFinance = derived(currentPlayer, ($currentPlayer) => {
  if (!$currentPlayer) return null;
  
  const totalAssets = $currentPlayer.assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = $currentPlayer.liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const cashFlow = $currentPlayer.income - $currentPlayer.expenses;
  
  return {
    cash: $currentPlayer.cash,
    totalAssets,
    totalLiabilities,
    cashFlow,
    netWorth: $currentPlayer.cash + totalAssets - totalLiabilities
  };
});

// Game actions
export const gameActions = {
  // Initialize game with players
  initializeGame: (players: Array<{
    name: string;
    color: string;
    job: string;
    insurance: boolean;
    salary: number;
    expenses: number;
    savings: number;
  }>) => {
    gameStore.update(state => {
      const initializedPlayers: Player[] = players.map((player, index) => ({
        id: index + 1,
        name: player.name,
        color: player.color,
        job: player.job,
        insurance: player.insurance,
        assets: [],
        liabilities: [],
        position: 0,
        isDownsized: false,
        downsizedTurns: 0,
        // Financial fields
        cash: player.savings, // Starting cash from job config
        income: player.salary,
        expenses: player.expenses,
        salary: player.salary,
        savings: player.savings,
        // Fast track fields
        passiveIncome: 0,
        totalExpenses: player.expenses,
        fastTrack: false,
        dream: null,
        // Charity and special events
        charityTurns: 0,
        children: 0,
        childExpenses: 0,
        // Bankruptcy fields
        isBankrupt: false,
        debt: false,
        loanApproval: true
      }));
      
      return {
        ...state,
        players: initializedPlayers,
        phase: 'ratRace',
        currentPlayerIndex: 0,
        turn: 1,
        gameOver: false,
        winner: null
      };
    });
  },
  
  // Move to next player
  nextPlayer: () => {
    gameStore.update(state => {
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const isNewTurn = nextIndex === 0;
      
      return {
        ...state,
        currentPlayerIndex: nextIndex,
        turn: isNewTurn ? state.turn + 1 : state.turn
      };
    });
  },
  
  // Move player on board
  movePlayer: (playerId: number, spaces: number) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        // Calculate new position (wrap around board)
        const currentPosition = updatedPlayers[playerIndex].position;
        const newPosition = (currentPosition + spaces) % state.board.length;
        
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          position: newPosition
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // Add asset to player
  addAsset: (playerId: number, asset: Asset) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          assets: [...updatedPlayers[playerIndex].assets, asset],
          cash: updatedPlayers[playerIndex].cash - (asset.value || 0)
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // Add liability to player
  addLiability: (playerId: number, liability: Liability) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          liabilities: [...updatedPlayers[playerIndex].liabilities, liability],
          cash: updatedPlayers[playerIndex].cash - (liability.amount || 0)
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // Process payday
  processPayday: (playerId: number) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        const player = updatedPlayers[playerIndex];
        const cashFlow = player.income - player.expenses;
        
        updatedPlayers[playerIndex] = {
          ...player,
          cash: player.cash + cashFlow
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // Draw card from deck
  drawCard: (): Card | null => {
    let drawnCard: Card | null = null;
    
    gameStore.update(state => {
      if (state.deck.length === 0) {
        // If deck is empty, shuffle discarded cards back in
        const newState = {
          ...state,
          deck: [...state.discardedCards],
          discardedCards: []
        };
        
        // Shuffle the deck
        newState.deck = newState.deck.sort(() => Math.random() - 0.5);
        
        return newState;
      }
      
      // Draw the first card from the deck
      const [firstCard, ...remainingDeck] = state.deck;
      drawnCard = firstCard || null;
      
      return {
        ...state,
        deck: remainingDeck,
        ...(drawnCard ? { discardedCards: [...state.discardedCards, drawnCard] } : {})
      };
    });
    
    return drawnCard;
  },
  
  // Check for bankruptcy
  checkBankruptcy: (playerId: number): boolean => {
    let isBankrupt = false;
    
    gameStore.update(state => {
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return state;
      
      const player = state.players[playerIndex];
      
      // Calculate total assets
      const totalAssets = player.assets.reduce((sum, asset) => sum + asset.value, 0);
      
      // Calculate total liabilities
      const totalLiabilities = player.liabilities.reduce((sum, liability) => sum + liability.amount, 0);
      
      // Calculate net worth
      const netWorth = player.cash + totalAssets - totalLiabilities;
      
      // Player is bankrupt if net worth is negative and they have no cash
      isBankrupt = netWorth < 0 && player.cash <= 0;
      
      if (isBankrupt) {
        const updatedPlayers = [...state.players];
        updatedPlayers[playerIndex] = {
          ...player,
          isBankrupt: true
        };
        
        // Check if all players are bankrupt
        const allBankrupt = updatedPlayers.every(p => p.isBankrupt);
        
        return {
          ...state,
          players: updatedPlayers,
          gameOver: allBankrupt,
          winner: allBankrupt ? null : state.winner
        };
      }
      
      return state;
    });
    
    return isBankrupt;
  },
  
  // Check for fast track eligibility
  checkFastTrackEligibility: (playerId: number): boolean => {
    let isEligible = false;
    
    gameStore.update(state => {
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return state;
      
      const player = state.players[playerIndex];
      
      // Calculate passive income from assets
      const passiveIncome = player.assets.reduce((sum, asset) => {
        return sum + (asset.income || 0);
      }, 0);
      
      // Player is eligible for fast track if passive income >= total expenses
      isEligible = passiveIncome >= player.totalExpenses;
      
      if (isEligible && !player.fastTrack) {
        const updatedPlayers = [...state.players];
        updatedPlayers[playerIndex] = {
          ...player,
          fastTrack: true,
          passiveIncome
        };
        
        return {
          ...state,
          players: updatedPlayers
        };
      }
      
      return state;
    });
    
    return isEligible;
  },
  
  // Check for win condition
  checkWinCondition: (playerId: number): boolean => {
    let hasWon = false;
    
    gameStore.update(state => {
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return state;
      
      const player = state.players[playerIndex];
      
      // Win condition: Player is on fast track and has purchased their dream
      if (player.fastTrack && player.dream) {
        hasWon = true;
        
        return {
          ...state,
          gameOver: true,
          winner: playerId
        };
      }
      
      return state;
    });
    
    return hasWon;
  },
  
  // Purchase dream (for fast track)
  purchaseDream: (playerId: number, dream: Dream) => {
    gameStore.update(state => {
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return state;
      
      const player = state.players[playerIndex];
      
      // Check if player can afford the dream
      if (player.cash >= dream.cost) {
        const updatedPlayers = [...state.players];
        updatedPlayers[playerIndex] = {
          ...player,
          cash: player.cash - dream.cost,
          dream: dream
        };
        
        return {
          ...state,
          players: updatedPlayers
        };
      }
      
      return state;
    });
  },
  
  // Process charity action
  processCharity: (playerId: number) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        const player = updatedPlayers[playerIndex];
        
        // Player gives away 10% of their income
        const charityAmount = Math.floor(player.income * 0.1);
        
        // If player has enough cash, donate to charity
        if (player.cash >= charityAmount) {
          updatedPlayers[playerIndex] = {
            ...player,
            cash: player.cash - charityAmount,
            charityTurns: 3 // Player gets 3 turns of charity benefits
          };
        }
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // Process downsize action
  processDownsize: (playerId: number) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        const player = updatedPlayers[playerIndex];
        
        // Player loses their job and income
        updatedPlayers[playerIndex] = {
          ...player,
          isDownsized: true,
          downsizedTurns: 0,
          income: 0,
          cash: player.cash - 1000 // Pay $1000 penalty
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // Process child action
  processChild: (playerId: number) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        const player = updatedPlayers[playerIndex];
        
        // Player gains a child
        const newChildren = player.children + 1;
        const childExpense = player.childExpenses + 200; // $200 per child
        
        updatedPlayers[playerIndex] = {
          ...player,
          children: newChildren,
          childExpenses: childExpense,
          expenses: player.expenses + 200 // Increase total expenses
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // Process dream action (for fast track)
  processDream: (playerId: number) => {
    // This would typically trigger a dream card draw or selection
    console.log(`Player ${playerId} landed on dream space`);
  },
  
  // Enter fast track
  enterFastTrack: (playerId: number) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        const player = updatedPlayers[playerIndex];
        
        // Move player to fast track
        updatedPlayers[playerIndex] = {
          ...player,
          fastTrack: true,
          position: 0 // Reset position for fast track board
        };
      }
      
      return {
        ...state,
        players: updatedPlayers,
        phase: 'fastTrack'
      };
    });
  },
  
  // Process fast track payday
  processFastTrackPayday: (playerId: number, multiplier: number = 1) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        const player = updatedPlayers[playerIndex];
        
        // Calculate fast track income (higher than rat race)
        const fastTrackIncome = (player.passiveIncome || 0) * multiplier;
        
        updatedPlayers[playerIndex] = {
          ...player,
          cash: player.cash + fastTrackIncome
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // Move player on fast track board
  moveFastTrackPlayer: (playerId: number, spaces: number) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        // Calculate new position (wrap around fast track board)
        const currentPosition = updatedPlayers[playerIndex].position;
        const newPosition = (currentPosition + spaces) % 12; // Fast track has 12 spaces
        
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          position: newPosition
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // End downsize period
  endDownsize: (playerId: number) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        const player = updatedPlayers[playerIndex];
        
        // End downsize period and restore income
        updatedPlayers[playerIndex] = {
          ...player,
          isDownsized: false,
          downsizedTurns: 0,
          income: player.salary // Restore original income
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // Process charity benefit
  processCharityBenefit: (playerId: number) => {
    gameStore.update(state => {
      const updatedPlayers = [...state.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        const player = updatedPlayers[playerIndex];
        
        // Player gets a benefit from charity (extra income)
        if (player.charityTurns > 0) {
          updatedPlayers[playerIndex] = {
            ...player,
            cash: player.cash + 1000, // Extra $1000 income
            charityTurns: player.charityTurns - 1
          };
        }
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    });
  },
  
  // Reset game
  resetGame: () => {
    gameStore.set(initialGameState);
  },
  
  // Save game to localStorage
  saveGame: (slot: number = 0) => {
    let saved = false;
    
    gameStore.update(state => {
      try {
        const saveData = {
          ...state,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem(`cashflow-save-${slot}`, JSON.stringify(saveData));
        saved = true;
      } catch (error) {
        console.error('Failed to save game:', error);
      }
      
      return state;
    });
    
    return saved;
  },
  
  // Load game from localStorage
  loadGame: (slot: number = 0): boolean => {
    try {
      const savedData = localStorage.getItem(`cashflow-save-${slot}`);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        gameStore.set(parsedData);
        return true;
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
    
    return false;
  },
  
  // Get saved games list
  getSavedGames: (): Array<{ slot: number; savedAt: string; players: string[] }> => {
    const savedGames: Array<{ slot: number; savedAt: string; players: string[] }> = [];
    
    try {
      for (let i = 0; i < 5; i++) { // Support 5 save slots
        const savedData = localStorage.getItem(`cashflow-save-${i}`);
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          savedGames.push({
            slot: i,
            savedAt: parsedData.savedAt || 'Unknown',
            players: parsedData.players?.map((p: Player) => p.name) || []
          });
        }
      }
    } catch (error) {
      console.error('Failed to get saved games:', error);
    }
    
    return savedGames;
  },
  
  // Delete saved game
  deleteSavedGame: (slot: number): boolean => {
    try {
      localStorage.removeItem(`cashflow-save-${slot}`);
      return true;
    } catch (error) {
      console.error('Failed to delete saved game:', error);
      return false;
    }
  },
  
  // Auto-save game (called after each turn)
  autoSave: () => {
    try {
      gameStore.update(state => {
        const saveData = {
          ...state,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem('cashflow-autosave', JSON.stringify(saveData));
        return state;
      });
      return true;
    } catch (error) {
      console.error('Failed to auto-save game:', error);
      return false;
    }
  },
  
  // Load auto-saved game
  loadAutoSave: (): boolean => {
    try {
      const savedData = localStorage.getItem('cashflow-autosave');
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        gameStore.set(parsedData);
        return true;
      }
    } catch (error) {
      console.error('Failed to load auto-saved game:', error);
    }
    
    return false;
  },
  
  // Check if auto-save exists
  hasAutoSave: (): boolean => {
    return localStorage.getItem('cashflow-autosave') !== null;
  }
};

// Initialize the card deck with real cards from the original game
gameStore.update(state => {
  const cards: Card[] = [];
  
  // Add small deal cards (stocks, real estate)
  Object.values(smallDealCards).forEach(cardData => {
    cards.push(convertToCard(cardData, 'small-deal'));
  });
  
  // Add big deal cards
  Object.values(bigDealCards).forEach(cardData => {
    cards.push(convertToCard(cardData, 'big-deal'));
  });
  
  // Add doodad cards (expenses)
  Object.values(doodadCards).forEach(cardData => {
    cards.push(convertToCard(cardData, 'doodad'));
  });
  
  // Add offer cards
  Object.values(offerCards).forEach(cardData => {
    cards.push(convertToCard(cardData, 'offer'));
  });
  
  // Shuffle the cards
  const shuffledCards = shuffleArray(cards);
  
  return {
    ...state,
    deck: shuffledCards
  };
});

// Helper function to convert CardData to Card
function convertToCard(cardData: CardData, defaultType: Card['type']): Card {
  return {
    id: cardData.id,
    type: defaultType,
    title: cardData.name,
    description: cardData.description,
    amount: cardData.cost || cardData.offer || cardData.offerPerUnit || 0,
    cost: cardData.cost,
    income: cardData.cashFlow,
    ROI: cardData.roi,
    symbol: cardData.symbol,
    price: cardData.price,
    range: cardData.range,
    dividend: cardData.dividend,
    downPayment: cardData.downPayment,
    mortgage: cardData.mortgage,
    cashFlow: cardData.cashFlow,
    tag: cardData.tag,
    landType: cardData.landType,
    units: cardData.units,
    propertyType: cardData.propertyType,
    loan: cardData.loan,
    payment: cardData.payment,
    child: cardData.child,
    rule: cardData.rule,
    offer: cardData.offer,
    offerPerUnit: cardData.offerPerUnit
  };
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Get player color based on their selected color
export function getPlayerColor(colorName: string): string {
  const colorMap: Record<string, string> = {
    'Green': '#4CAF50',
    'Red': '#F44336',
    'Blue': '#2196F3',
    'Black': '#212121',
    'Pink': '#E91E63',
    'Aqua': '#00BCD4',
    'Orange': '#FF9800',
    'White': '#FFFFFF'
  };
  
  return colorMap[colorName] || '#9E9E9E'; // Default to grey
}