export const bookingConfig = {
  services: [
    { id: 'regular', name: 'Regular Cleaning' },
    { id: 'deep', name: 'Deep Cleaning' },
    { id: 'end-of-lease', name: 'End of Lease' },
  ],
  locations: {
    sydney: ['Inner West', 'Eastern Suburbs'],
    melbourne: ['CBD', 'Inner Suburbs'],
  },
  pricing: {
    base: {
      regular: 120,
      deep: 180,
      'end-of-lease': 250,
    },
    extras: {
      windows: 30,
      fridge: 25,
    },
  },
  duration: {
    min: 2,
    max: 8,
    default: 3,
  },
} as const