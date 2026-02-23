/**
 * Dream configurations for CashFlow game Fast Track
 * Each dream has a cost, description, and optional perk
 */

export interface DreamConfig {
  id: string;
  name: string;
  cost: number;
  description: string;
  perk?: string;
}

export const dreamConfigs: DreamConfig[] = [
  {
    id: 'villa',
    name: 'Luxury Villa',
    cost: 500000,
    description: 'A magnificent villa with ocean views, private beach access, and a infinity pool',
    perk: 'Gain +$5,000/month passive income from rental income'
  },
  {
    id: 'yacht',
    name: 'Luxury Yacht',
    cost: 250000,
    description: 'A 60-foot luxury yacht with crew quarters, hot tub, and water toys',
    perk: 'Gain +$2,000/month passive income from charter rentals'
  },
  {
    id: 'private-jet',
    name: 'Private Jet',
    cost: 5000000,
    description: 'A brand new Gulfstream G650 with custom interior and global range',
    perk: 'Travel anywhere instantly, no travel time costs'
  },
  {
    id: 'race-car',
    name: 'Formula 1 Race Car',
    cost: 1000000,
    description: 'Your own Formula 1 race car with professional racing team',
    perk: 'Earn prize money from races, +$10,000/month potential income'
  },
  {
    id: 'art-collection',
    name: 'Art Collection',
    cost: 2000000,
    description: 'An impressive collection of masterpieces by famous artists',
    perk: 'Art appreciates 10% annually, museum exhibition opportunities'
  },
  {
    id: 'winery',
    name: 'Winery Estate',
    cost: 3000000,
    description: 'A prestigious vineyard with tasting room and event venue',
    perk: 'Gain +$15,000/month passive income from wine sales'
  },
  {
    id: 'island-resort',
    name: 'Private Island Resort',
    cost: 10000000,
    description: 'Your own tropical island with luxury resort facilities',
    perk: 'Gain +$50,000/month passive income from resort operations'
  },
  {
    id: 'tech-company',
    name: 'Tech Startup',
    cost: 5000000,
    description: 'A cutting-edge technology company with innovative products',
    perk: 'Gain +$25,000/month passive income from licensing deals'
  },
  {
    id: 'charity-foundation',
    name: 'Charity Foundation',
    cost: 1000000,
    description: 'Establish your own charitable foundation helping communities worldwide',
    perk: 'Triple charity benefits, gain +$3,000/month from donations'
  },
  {
    id: 'sports-team',
    name: 'Professional Sports Team',
    cost: 8000000,
    description: 'Own a professional sports franchise with stadium and facilities',
    perk: 'Gain +$40,000/month passive income from ticket sales and merchandising'
  }
];

// Helper functions
export function getRandomDream(): DreamConfig {
  const randomIndex = Math.floor(Math.random() * dreamConfigs.length);
  return dreamConfigs[randomIndex];
}

export function getDreamById(id: string): DreamConfig | undefined {
  return dreamConfigs.find(dream => dream.id === id);
}

export function getAffordableDreams(cash: number): DreamConfig[] {
  return dreamConfigs.filter(dream => dream.cost <= cash);
}

export function getAllDreamNames(): string[] {
  return dreamConfigs.map(dream => dream.name);
}