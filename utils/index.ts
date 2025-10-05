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