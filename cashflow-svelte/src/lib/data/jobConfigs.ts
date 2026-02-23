/**
 * Job configurations for CashFlow game
 * Each job has a salary and associated expenses
 */

export interface JobConfig {
  id: string;
  name: string;
  salary: number;
  expenses: {
    taxes: number;
    homeMortgage: number;
    schoolLoanPayment: number;
    carLoanPayment: number;
    creditCardPayment: number;
    retailPayment: number;
    otherExpenses: number;
    childExpenses: number;
    bankLoanPayment: number;
  };
  totalExpenses: number;
  cashFlow: number; // salary - totalExpenses
  startingCash: number;
  savings: number;
}

export const jobConfigs: Record<string, JobConfig> = {
  'airline-pilot': {
    id: 'airline-pilot',
    name: 'Airline Pilot',
    salary: 9500,
    expenses: {
      taxes: 2350,
      homeMortgage: 1100,
      schoolLoanPayment: 400,
      carLoanPayment: 300,
      creditCardPayment: 200,
      retailPayment: 50,
      otherExpenses: 400,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 4800,
    cashFlow: 4700,
    startingCash: 400,
    savings: 400
  },
  'business-manager': {
    id: 'business-manager',
    name: 'Business Manager',
    salary: 4600,
    expenses: {
      taxes: 830,
      homeMortgage: 700,
      schoolLoanPayment: 150,
      carLoanPayment: 150,
      creditCardPayment: 100,
      retailPayment: 50,
      otherExpenses: 200,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 2180,
    cashFlow: 2420,
    startingCash: 350,
    savings: 350
  },
  'doctor': {
    id: 'doctor',
    name: 'Doctor (MD)',
    salary: 13200,
    expenses: {
      taxes: 3420,
      homeMortgage: 1900,
      schoolLoanPayment: 900,
      carLoanPayment: 500,
      creditCardPayment: 300,
      retailPayment: 100,
      otherExpenses: 600,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 7720,
    cashFlow: 5480,
    startingCash: 450,
    savings: 450
  },
  'engineer': {
    id: 'engineer',
    name: 'Engineer',
    salary: 4900,
    expenses: {
      taxes: 930,
      homeMortgage: 800,
      schoolLoanPayment: 200,
      carLoanPayment: 200,
      creditCardPayment: 100,
      retailPayment: 50,
      otherExpenses: 250,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 2530,
    cashFlow: 2370,
    startingCash: 350,
    savings: 350
  },
  'janitor': {
    id: 'janitor',
    name: 'Janitor',
    salary: 1600,
    expenses: {
      taxes: 200,
      homeMortgage: 400,
      schoolLoanPayment: 0,
      carLoanPayment: 100,
      creditCardPayment: 50,
      retailPayment: 30,
      otherExpenses: 100,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 880,
    cashFlow: 720,
    startingCash: 250,
    savings: 250
  },
  'lawyer': {
    id: 'lawyer',
    name: 'Lawyer',
    salary: 7500,
    expenses: {
      taxes: 1850,
      homeMortgage: 1400,
      schoolLoanPayment: 600,
      carLoanPayment: 400,
      creditCardPayment: 200,
      retailPayment: 80,
      otherExpenses: 400,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 4930,
    cashFlow: 2570,
    startingCash: 400,
    savings: 400
  },
  'mechanic': {
    id: 'mechanic',
    name: 'Mechanic',
    salary: 2000,
    expenses: {
      taxes: 280,
      homeMortgage: 500,
      schoolLoanPayment: 0,
      carLoanPayment: 150,
      creditCardPayment: 80,
      retailPayment: 40,
      otherExpenses: 150,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 1200,
    cashFlow: 800,
    startingCash: 300,
    savings: 300
  },
  'nurse': {
    id: 'nurse',
    name: 'Nurse',
    salary: 3100,
    expenses: {
      taxes: 520,
      homeMortgage: 600,
      schoolLoanPayment: 100,
      carLoanPayment: 150,
      creditCardPayment: 80,
      retailPayment: 40,
      otherExpenses: 180,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 1670,
    cashFlow: 1430,
    startingCash: 300,
    savings: 300
  },
  'police-officer': {
    id: 'police-officer',
    name: 'Police Officer',
    salary: 3000,
    expenses: {
      taxes: 500,
      homeMortgage: 600,
      schoolLoanPayment: 0,
      carLoanPayment: 150,
      creditCardPayment: 80,
      retailPayment: 40,
      otherExpenses: 180,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 1550,
    cashFlow: 1450,
    startingCash: 300,
    savings: 300
  },
  'secretary': {
    id: 'secretary',
    name: 'Secretary',
    salary: 2500,
    expenses: {
      taxes: 380,
      homeMortgage: 500,
      schoolLoanPayment: 50,
      carLoanPayment: 120,
      creditCardPayment: 70,
      retailPayment: 40,
      otherExpenses: 150,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 1310,
    cashFlow: 1190,
    startingCash: 300,
    savings: 300
  },
  'teacher': {
    id: 'teacher',
    name: 'Teacher (K-12)',
    salary: 3300,
    expenses: {
      taxes: 560,
      homeMortgage: 650,
      schoolLoanPayment: 150,
      carLoanPayment: 150,
      creditCardPayment: 80,
      retailPayment: 40,
      otherExpenses: 200,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 1830,
    cashFlow: 1470,
    startingCash: 300,
    savings: 300
  },
  'truck-driver': {
    id: 'truck-driver',
    name: 'Truck Driver',
    salary: 2500,
    expenses: {
      taxes: 380,
      homeMortgage: 500,
      schoolLoanPayment: 0,
      carLoanPayment: 120,
      creditCardPayment: 70,
      retailPayment: 40,
      otherExpenses: 150,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 1260,
    cashFlow: 1240,
    startingCash: 300,
    savings: 300
  },
  'ceo': {
    id: 'ceo',
    name: 'CEO',
    salary: 24000,
    expenses: {
      taxes: 7200,
      homeMortgage: 3500,
      schoolLoanPayment: 1200,
      carLoanPayment: 800,
      creditCardPayment: 500,
      retailPayment: 200,
      otherExpenses: 1000,
      childExpenses: 0,
      bankLoanPayment: 0
    },
    totalExpenses: 14400,
    cashFlow: 9600,
    startingCash: 600,
    savings: 600
  }
};

/**
 * Get a random job ID
 */
export function getRandomJobId(): string {
  const jobIds = Object.keys(jobConfigs);
  return jobIds[Math.floor(Math.random() * jobIds.length)];
}

/**
 * Get job config by ID
 */
export function getJobConfig(jobId: string): JobConfig | undefined {
  return jobConfigs[jobId];
}

/**
 * Get job config by display name (e.g., "Airline Pilot: $9500")
 */
export function getJobConfigByDisplayName(displayName: string): JobConfig | undefined {
  // Extract job name from display name (e.g., "Airline Pilot: $9500" -> "Airline Pilot")
  const name = displayName.split(':')[0].trim();
  
  // Find matching job config
  return Object.values(jobConfigs).find(job => job.name === name);
}

/**
 * Get all job display names for dropdown
 */
export function getJobDisplayNames(): string[] {
  return [
    'Random Job',
    ...Object.values(jobConfigs).map(job => `${job.name}: $${job.salary.toLocaleString()}`)
  ];
}

/**
 * Get a random color
 */
export function getRandomColor(): string {
  const colors = ['Green', 'Red', 'Blue', 'Black', 'Pink', 'Aqua', 'Orange', 'White'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get color hex value
 */
export function getColorHex(colorName: string): string {
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
  
  return colorMap[colorName] || '#9E9E9E';
}