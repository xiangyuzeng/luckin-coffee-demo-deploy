// Fake bean origin data for demo purposes

export interface BeanOrigin {
  country: string;
  region: string;
  altitude: string;
  process: string;
  roastProfile: string;
  tastingNotes: string[];
  certifications: string[];
  story: string;
  farmName?: string;
}

// Bean origins mapped to drink types
const BEAN_ORIGINS: Record<string, BeanOrigin> = {
  signature: {
    country: 'Ethiopia',
    region: 'Yirgacheffe',
    altitude: '1,700-2,200m',
    process: 'Washed',
    roastProfile: 'Medium',
    tastingNotes: ['Blueberry', 'Jasmine', 'Citrus', 'Honey'],
    certifications: ['Rainforest Alliance', 'Fair Trade'],
    story: 'Our signature blend comes from the birthplace of coffee. These beans are hand-picked by local farmers in the Yirgacheffe region, known for producing some of the world\'s most aromatic and complex coffees.',
    farmName: 'Konga Cooperative',
  },
  classic: {
    country: 'Colombia',
    region: 'Huila',
    altitude: '1,500-1,800m',
    process: 'Washed',
    roastProfile: 'Medium-Dark',
    tastingNotes: ['Caramel', 'Chocolate', 'Nutty', 'Balanced'],
    certifications: ['UTZ Certified', 'Organic'],
    story: 'Sourced from family farms in the Huila department of Colombia, these beans offer a perfectly balanced cup with rich chocolate notes and a smooth finish.',
    farmName: 'Finca La Esperanza',
  },
  coldBrew: {
    country: 'Brazil',
    region: 'Minas Gerais',
    altitude: '1,000-1,300m',
    process: 'Natural',
    roastProfile: 'Medium',
    tastingNotes: ['Chocolate', 'Nuts', 'Low Acidity', 'Sweet'],
    certifications: ['Rainforest Alliance'],
    story: 'Our cold brew blend uses naturally processed Brazilian beans, which develop a sweet, chocolatey flavor perfect for cold extraction. The low acidity makes it incredibly smooth.',
    farmName: 'Fazenda Santa Inês',
  },
  espresso: {
    country: 'Guatemala',
    region: 'Antigua',
    altitude: '1,500-1,700m',
    process: 'Washed',
    roastProfile: 'Dark',
    tastingNotes: ['Dark Chocolate', 'Spice', 'Smoky', 'Full Body'],
    certifications: ['Fair Trade', 'Shade Grown'],
    story: 'Grown in the volcanic soils of Antigua, these beans produce an intense, full-bodied espresso with complex spice notes and a lingering chocolate finish.',
    farmName: 'Finca Filadelfia',
  },
};

function getDrinkType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('cold brew')) return 'coldBrew';
  if (lower.includes('espresso') || lower.includes('americano')) return 'espresso';
  if (lower.includes('signature') || lower.includes('coconut') || lower.includes('velvet')) return 'signature';
  return 'classic';
}

export function getBeanOrigin(drinkName: string): BeanOrigin {
  const type = getDrinkType(drinkName);
  return BEAN_ORIGINS[type] || BEAN_ORIGINS.classic;
}

// Country flag emojis
export function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    'Ethiopia': '🇪🇹',
    'Colombia': '🇨🇴',
    'Brazil': '🇧🇷',
    'Guatemala': '🇬🇹',
    'Kenya': '🇰🇪',
    'Costa Rica': '🇨🇷',
  };
  return flags[country] || '🌍';
}
