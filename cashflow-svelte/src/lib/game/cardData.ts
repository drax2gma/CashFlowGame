// Card data types and card decks from the original Cashflow game
export interface CardData {
  id: string;
  type: string;
  name: string;
  description: string;
  rule?: string;
  symbol?: string;
  price?: number;
  range?: string;
  dividend?: boolean | number;
  shares?: number;
  roi?: number;
  cost?: number;
  downPayment?: number;
  mortgage?: number;
  cashFlow?: number;
  tag?: string;
  landType?: string;
  units?: number;
  propertyType?: string;
  amount?: number;
  offer?: number;
  offerPerUnit?: number;
  lowestUnit?: number;
  cashFlowChange?: number;
  valueIncrease?: number;
  payment?: number;
  loan?: number;
  child?: boolean;
}

// Small Deal Cards - Stocks, Real Estate, etc.
export const smallDealCards: Record<string, CardData> = {
  mutual01: {
    id: "gro4us30",
    type: "Mutual Fund",
    name: "GRO4US Fund",
    description: "Lower interest rates drive market and fund to strong showing.",
    rule: "Only you may buy as many units as you want at this price. Everyone may sell at this price",
    symbol: "GRO4US",
    price: 30,
    range: "$10 to $30",
    dividend: false
  },
  mutual02: {
    id: "gro4us20",
    type: "Mutual Fund",
    name: "GRO4US Fund",
    description: "Brilliant young fund manager. Everyone believes he has the Midas touch",
    rule: "Only you may buy as many units as you want at this price. Everyone may sell at this price",
    symbol: "GRO4US",
    price: 20,
    range: "$10 to $30",
    dividend: false
  },
  mutual03: {
    id: "gro4us10",
    type: "Mutual Fund",
    name: "GRO4US Fund",
    description: "Weak earnings by most companies lead to weak price of mutual fund",
    rule: "Only you may buy as many units as you want at this price. Everyone may sell at this price",
    symbol: "GRO4US",
    price: 10,
    range: "$10 to $30",
    dividend: false
  },
  stock001: {
    id: "myt4u40",
    type: "Stock",
    name: "MYT4U Electronics Co.",
    description: "Booming market leads to record share price of this home electronics seller!",
    rule: "Only you may buy as many shares as you want at this price. Everyone may sell at this price.",
    symbol: "MYT4U",
    price: 40,
    range: "$5 to $30",
    dividend: false
  },
  stock002: {
    id: "myt4u05",
    type: "Stock",
    name: "MYT4U Electronics Co.",
    description: "High inflation leads to poor share price for this home electronics seller.",
    rule: "Only you may buy as many shares as you want at this price. Everyone may sell at this price.",
    symbol: "MYT4U",
    price: 5,
    range: "$5 to $30",
    dividend: false
  },
  stock007: {
    id: "myt4u20",
    type: "Stock",
    name: "MYT4U Electronics Co.",
    description: "Fast growing seller of home electronics headed by 32 year old Harvard grad.",
    rule: "Only you may buy as many shares as you want at this price. Everyone may sell at this price.",
    symbol: "MYT4U",
    price: 20,
    range: "$5 to $30",
    dividend: false
  },
  stock101: {
    id: "ok4u40",
    type: "Stock",
    name: "OK4U Drug Co.",
    description: "Market strength leads to high share price for this long time maker of medicines.",
    rule: "Only you may buy as many shares as you want at this price. Everyone may sell at this price.",
    symbol: "OK4U",
    price: 40,
    range: "$5 to $40",
    dividend: false
  },
  stock102: {
    id: "ok4u20",
    type: "Stock",
    name: "OK4U Drug Co.",
    description: "Low inflation leads to high share price for this long time maker of medicines.",
    rule: "Only you may buy as many shares as you want at this price. Everyone may sell at this price.",
    symbol: "OK4U",
    price: 20,
    range: "$5 to $40",
    dividend: false
  },
  stock107: {
    id: "ok4u01",
    type: "Stock",
    name: "OK4U Drug Co.",
    description: "Market panic causes crash in the shares of this long time maker of medicines.",
    rule: "Only you may buy as many shares as you want at this price. Everyone may sell at this price.",
    symbol: "OK4U",
    price: 1,
    range: "$5 to $40",
    dividend: false
  },
  stock201: {
    id: "on2u40",
    type: "Stock",
    name: "ON2U Entertainment Co.",
    description: "Box office hit by children's division casuses record share price.",
    rule: "Only you may buy as many shares as you want at this price. Everyone may sell at this price.",
    symbol: "ON2U",
    price: 40,
    range: "$5 to $40",
    dividend: false
  },
  stock207: {
    id: "on2u01",
    type: "Stock",
    name: "ON2U Entertainment Co.",
    description: "Newest theme park loses record amount. Share price hits all-time low.",
    rule: "Only you may buy as many shares as you want at this price. Everyone may sell at this price.",
    symbol: "ON2U",
    price: 1,
    range: "$5 to $40",
    dividend: false
  },
  realEstateS1: {
    id: "reS1",
    type: "Real Estate",
    name: "You Find a Great Deal!",
    description: "Older 3/2 house, repossessed by government agency. Ready to go with government financing and a tenant.",
    rule: "Borrow from the Bank if you must, but... BUY THIS! 132% ROI, may sell for $65,000 to $135,000.",
    roi: 1.32,
    cost: 35000,
    downPayment: 2000,
    mortgage: 33000,
    cashFlow: 220,
    tag: "3Br/2Ba",
    landType: "3Br/2Ba"
  },
  realEstateS6: {
    id: "reS6",
    type: "Real Estate",
    name: "Bank Foreclosure! 2/1 Condo",
    description: "Bank foreclosure! 2/1 condo in desirable neighborhood close to jobs and stores. Make offer, favorable financing by bank.",
    rule: "Use this yourself or sell to another player. 53% ROI, may sell for $45,000 to $65,000",
    roi: 0.53,
    cost: 40000,
    downPayment: 5000,
    mortgage: 35000,
    cashFlow: 220,
    tag: "2Br/1Ba",
    landType: "2Br/1Ba"
  },
  realEstateS11: {
    id: "reS11",
    type: "Real Estate",
    name: "House For Sale - 3 Br/2 Ba",
    description: "Nice 3/2 house available in depressed market due to layoffs. Would make good investment property for right buyer.",
    rule: "Use this yourself or sell to another player. 60% ROI, may sell for $65,000 to $135,000.",
    roi: 0.6,
    cost: 50000,
    downPayment: 4000,
    mortgage: 46000,
    cashFlow: 200,
    tag: "3Br/2Ba",
    landType: "3Br/2Ba"
  },
  companyS1: {
    id: "compS1",
    type: "Company",
    name: "Start a Company Part Time",
    description: "Develop interesting idea for a software program, so you start a company to produce and sell it. No profits during startup, long hours, no extra pay.",
    rule: "Use this yourself or sell to another player. 0% ROI, may sell for ??, if anything.",
    roi: 0,
    cost: 5000,
    downPayment: 5000,
    cashFlow: 0,
    tag: "SOFTWARE",
    landType: "business"
  },
  coin1: {
    id: "coin1",
    type: "Coin",
    name: "1500's Spanish",
    description: "You spot an unusual 1500's Royal Spanish New World (Havana Mint Only) \"pieces of eight\" gold coin in good condition at a swap meet. One only, seller asks $500.",
    rule: "Use this yourself or sell to another player. 0% ROI, may sell for $0 to $4,000.",
    roi: 0,
    cost: 500,
    downPayment: 500,
    cashFlow: 0,
    amount: 1
  }
};

// Big Deal Cards - Larger investments
export const bigDealCards: Record<string, CardData> = {
  realEstateB1: {
    id: "reB1",
    type: "Real Estate",
    name: "8-plex for Sale",
    description: "Reinvesting owner offers 8-plex for sale at reasonable price. Financing already in place. All it needs is your down payment.",
    rule: "Use this yourself or sell to another player. 51% ROI, may sell for $200,000 to $280,000.",
    roi: 0.51,
    cost: 220000,
    downPayment: 40000,
    mortgage: 180000,
    cashFlow: 1700,
    tag: "8PLEX",
    landType: "plex",
    units: 8
  },
  realEstateB4: {
    id: "reB4",
    type: "Real Estate",
    name: "4-plex for Sale",
    description: "4-plex available - forced sale. Out-of-state, financially distressed owner years behind on taxes. Some records available.",
    rule: "Use this yourself or sell to another player. 56% ROI, may sell for $100,00 to $140,000.",
    roi: 0.56,
    cost: 80000,
    downPayment: 16000,
    mortgage: 64000,
    cashFlow: 750,
    tag: "4PLEX",
    landType: "plex",
    units: 4
  },
  realEstateB6: {
    id: "reB6",
    type: "Automated Business",
    name: "Automated Car Wash for Sale",
    description: "Successful 4 bay coin operated auto wash near busy intersection. Seller is moving to retirement community out of state.",
    rule: "Use this yourself or sell to another player. 86% ROI. No other buyers in sight.",
    roi: 0.86,
    cost: 125000,
    downPayment: 25000,
    mortgage: 100000,
    cashFlow: 1800,
    tag: "CarWash",
    landType: "car wash"
  },
  realEstateB12: {
    id: "reB12",
    type: "Real Estate",
    name: "Duplex for Sale",
    description: "Duplex owner must sell to pay hospital bills. Two tenants in place, all records, good investment oppurtunity.",
    rule: "Use this yourself or sell to another player. 40% ROI, may sell for $50,000 to $80,000.",
    roi: 0.4,
    cost: 60000,
    mortgage: 48000,
    downPayment: 12000,
    cashFlow: 400,
    tag: "DUPLEX",
    landType: "duplex",
    units: 2
  },
  realEstateB16: {
    id: "reB16",
    type: "Real Estate",
    name: "4-plex for Sale",
    description: "4-plex for sale by owner, moving to another state. Full records, fully rented, low occupant turnover in good neighborhood.",
    rule: "Use this yourself or sell to another player. 75% ROI, may sell for $100,000 to $140,000.",
    roi: 0.75,
    cost: 140000,
    downPayment: 32000,
    mortgage: 108000,
    cashFlow: 2000,
    tag: "4PLEX",
    landType: "plex",
    units: 4
  },
  limitedPartnershipB1: {
    id: "lpB1",
    type: "Limited Partnership",
    name: "Limited Partner Wanted",
    description: "Non-franchise sandwich shop doubling the number of locations. Owner needs additional equity capital to get operating loan.",
    rule: "Use this yourself or sell to another player. 60% ROI, owner may buy you out for $60,000 to $90,000.",
    roi: 0.6,
    cost: 30000,
    downPayment: 30000,
    cashFlow: 1500,
    tag: "LP-Food",
    landType: "limited"
  }
};

// Doodad Cards - Unexpected expenses
export const doodadCards: Record<string, CardData> = {
  doodad1: {
    id: "doodad1",
    type: "Doodad",
    name: "Water Heater Leaks",
    description: "Pay $450 for a new one",
    cost: 450
  },
  doodad2: {
    id: "doodad2",
    type: "Doodad",
    name: "Go Out to Dinner",
    description: "Spend $80",
    cost: 80
  },
  doodad3: {
    id: "doodad3",
    type: "Doodad",
    name: "New Boat!",
    description: "Pay $1,000 down and $17,000 on time.",
    cost: 1000,
    loan: 17000,
    payment: 340
  },
  doodad8: {
    id: "doodad8",
    type: "Doodad",
    name: "Son's College Tuition",
    description: "Pay $1500",
    cost: 1500,
    child: true
  },
  doodad15: {
    id: "doodad15",
    type: "Doodad",
    name: "Family Vacation!",
    description: "Costs $2000",
    cost: 2000
  },
  doodad30: {
    id: "doodad30",
    type: "Doodad",
    name: "Your Child Needs Braces",
    description: "Pay $2000",
    cost: 2000,
    child: true
  }
};

// Offer Cards - Buy/sell opportunities
export const offerCards: Record<string, CardData> = {
  offer1: {
    id: "offer1",
    type: "Offer",
    name: "Plex Buyer",
    description: "Buyer offers $30,000 per unit for all units in any combination of duplexes, 4-plexes, or 8-plexes. Has own financing.",
    rule: "Everyone may sell at this price. If you sell, pay off the related mortgage and give up the cash flow.",
    offerPerUnit: 30000,
    landType: "plex"
  },
  offer5: {
    id: "offer5",
    type: "Offer",
    name: "House Buyer - 3Br/2Ba",
    description: "You are offered $135,000 for a 3/2 rental house. Buyer has own financing.",
    rule: "Everyone may sell at this price. If you sell, pay off the related mortgage and give up the cash flow.",
    offer: 135000,
    landType: "3Br/2Ba"
  },
  offer43: {
    id: "offer43",
    type: "Offer",
    name: "Price of Gold Soars",
    description: "Rioting in Middle East. Oil prices threatened. Price of gold skyrockets to $600 per ounce.",
    rule: "Everyone who owns 1 ounce Krugerrands may sell at this price.",
    offer: 600,
    landType: "Krugerrands"
  },
  offer44: {
    id: "offer44",
    type: "Offer",
    name: "Collector Wants Gold Coins",
    description: 'Collector looking for authentic 1500\'s Royal Spanish New World (Havana mint only) "pieces of eight" gold coins.',
    rule: "Cash offer of $5,000 for each coin to everyone.",
    offer: 5000,
    landType: "1500's Spanish"
  }
};

// All cards combined
export const allCards: Record<string, CardData> = {
  ...smallDealCards,
  ...bigDealCards,
  ...doodadCards,
  ...offerCards
};

// Helper function to get a random card from a category
export function getRandomCard(category: 'smallDeal' | 'bigDeal' | 'doodad' | 'offer'): CardData | null {
  let cardPool: Record<string, CardData>;
  
  switch (category) {
    case 'smallDeal':
      cardPool = smallDealCards;
      break;
    case 'bigDeal':
      cardPool = bigDealCards;
      break;
    case 'doodad':
      cardPool = doodadCards;
      break;
    case 'offer':
      cardPool = offerCards;
      break;
    default:
      return null;
  }
  
  const keys = Object.keys(cardPool);
  if (keys.length === 0) return null;
  
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return cardPool[randomKey];
}

// Get card by ID
export function getCardById(id: string): CardData | undefined {
  return allCards[id];
}
