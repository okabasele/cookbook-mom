// ===========================
// 🍽️ UTILITY FUNCTIONS
// ===========================
export const getRecipeEmoji = (title: string): string => {
  const map: { [key: string]: string } = {
    cookie: '🍪',
    cake: '🍰',
    bread: '🥖',
    pasta: '🍝',
    soup: '🍲',
    salad: '🥗',
    pizza: '🍕',
    burger: '🍔',
    croissant: '🥐',
    cupcake: '🧁',
    pie: '🥧',
    taco: '🌮',
    curry: '🍛',
    sushi: '🍣',
    steak: '🥩',
    chicken: '🍗',
    fish: '🐟',
    rice: '🍚',
    sandwich: '🥪',
    ice: '🍦',
    chocolate: '🍫',
    coffee: '☕',
    tea: '🍵',
    juice: '🧃',
    wine: '🍷',
    beer: '🍺',
    default: '🍽️',
  };

  const key = Object.keys(map).find(k => title.toLowerCase().includes(k)) || 'default';
  return map[key];
};

export const getRelativeTime = (date: string): string => {
  const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days}j`;
  return `Il y a ${Math.floor(days / 7)}sem`;
};

export const getFlagEmoji = (countryCode: string): string => {
  const flags: { [key: string]: string } = {
    en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸', de: '🇩🇪', it: '🇮🇹', jp: '🇯🇵', cn: '🇨🇳',
    default: '🏳️'
  };
  return flags[countryCode] || countryCode
};

export const customObjectGroupBy = <T, K extends string | number>(
  array: T[],
  keyGetter: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((acc, item) => {
    const key = keyGetter(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
};

// ===========================
//  CONVERSION DATA
// ===========================
export const CONVERSIONS = {
  temperature: {
    name: 'Température',
    emoji: '🌡️',
    units: ['°F', '°C'],
    // accept optional `to` so calls with 2 args are allowed
    convert: (value: number, from: string, to?: string) => {
      if (from === '°F') return ((value - 32) * 5) / 9;
      return (value * 9) / 5 + 32;
    },
    examples: [
      { from: 350, fromUnit: '°F', to: 177, toUnit: '°C', label: 'Four moyen' },
      { from: 375, fromUnit: '°F', to: 190, toUnit: '°C', label: 'Four chaud' },
      { from: 425, fromUnit: '°F', to: 218, toUnit: '°C', label: 'Four très chaud' },
    ],
  },
  volume: {
    name: 'Volume',
    emoji: '📏',
    units: ['cup', 'ml', 'tbsp', 'tsp', 'L'],
    convert: (value: number, from: string, to?: string) => {
      const toMl: Record<string, number> = {
        cup: 240,
        ml: 1,
        tbsp: 15,
        tsp: 5,
        L: 1000,
      };
      if (!to) return value; // safe fallback if `to` is not provided
      const mlValue = value * toMl[from];
      return mlValue / toMl[to];
    },
    examples: [
      { from: 1, fromUnit: 'cup', to: 240, toUnit: 'ml', label: '1 tasse' },
      { from: 1, fromUnit: 'tbsp', to: 15, toUnit: 'ml', label: "1 c. à soupe" },
      { from: 1, fromUnit: 'tsp', to: 5, toUnit: 'ml', label: "1 c. à café" },
    ],
  },
  weight: {
    name: 'Poids',
    emoji: '⚖️',
    units: ['oz', 'g', 'lb', 'kg'],
    convert: (value: number, from: string, to?: string) => {
      const toG: Record<string, number> = {
        oz: 28.35,
        g: 1,
        lb: 453.592,
        kg: 1000,
      };
      if (!to) return value;
      const gValue = value * toG[from];
      return gValue / toG[to];
    },
    examples: [
      { from: 1, fromUnit: 'oz', to: 28, toUnit: 'g', label: '1 once' },
      { from: 1, fromUnit: 'lb', to: 454, toUnit: 'g', label: '1 livre' },
      { from: 8, fromUnit: 'oz', to: 227, toUnit: 'g', label: '8 onces' },
    ],
  },
  length: {
    name: 'Longueur (moules)',
    emoji: '📐',
    units: ['inch', 'cm'],
    convert: (value: number, from: string, to?: string) => {
      if (from === 'inch') return value * 2.54;
      return value / 2.54;
    },
    examples: [
      { from: 6, fromUnit: 'inch', to: 15, toUnit: 'cm', label: 'Moule 6 pouces' },
      { from: 8, fromUnit: 'inch', to: 20, toUnit: 'cm', label: 'Moule 8 pouces' },
      { from: 9, fromUnit: 'inch', to: 23, toUnit: 'cm', label: 'Moule 9 pouces' },
      { from: 10, fromUnit: 'inch', to: 25, toUnit: 'cm', label: 'Moule 10 pouces' },
    ],
  },
};

