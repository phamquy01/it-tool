import type { LucideIcon } from 'lucide-react';
import {
  Shuffle,
  Hash,
  KeySquare,
  Lock,
  Grid,
  Fingerprint,
} from 'lucide-react';
import TokenGenerator from '../../pages/TokenGenerator';
import HashText from '../../pages/HashText';
import Bcrypt from '../../pages/Bcrypt';
import UUID from '../../pages/UUID';
import ULID from '../../pages/ULID';
import Encryption from '../../pages/Encryption';

export interface ToolItem {
  component: React.FC;
  label: string;
  icon: LucideIcon;
  path: string;
  description: string;
}

export interface ToolCategory {
  title: string;
  items: ToolItem[];
}

export const FAVORITES_KEY = 'favoriteTools';

export const toolCategories: ToolCategory[] = [
  {
    title: 'Crypto',
    items: [
      {
        label: 'Token generator',
        icon: Shuffle,
        path: '/token-generator',
        description: 'Generate random tokens for authentication',
        component: TokenGenerator,
      },
      {
        label: 'Hash text',
        icon: Hash,
        path: '/hash-text',
        description: 'Create hash values from text using various algorithms',
        component: HashText,
      },
      {
        label: 'Bcrypt',
        icon: Fingerprint,
        path: '/bcrypt',
        description:
          'Hash and compare text string using bcrypt. Bcrypt is a password-hashing function based on the Blowfish cipher.',
        component: Bcrypt,
      },
      {
        label: 'UUIDs generator',
        icon: KeySquare,
        path: '/uuid-generator',
        description: 'Generate unique identifiers (UUIDs)',
        component: UUID,
      },
      {
        label: 'ULID generator',
        icon: Grid,
        path: '/ulid-generator',
        description:
          'Generate universally unique lexicographically sortable identifiers',
        component: ULID,
      },
      {
        label: 'Encrypt / decrypt text',
        icon: Lock,
        path: '/encrypt-decrypt',
        description: 'Encrypt and decrypt text using various methods',
        component: Encryption,
      },
    ],
  },
];

// Helper function to get all tools as a flat array
export const getAllTools = (): ToolItem[] => {
  return toolCategories.flatMap((category) => category.items);
};

// Helper function to get favorite tools from localStorage
export const getFavoriteTools = (): ToolItem[] => {
  const stored = localStorage.getItem('favoriteTools');
  if (!stored) return [];

  const favoritePaths: string[] = JSON.parse(stored);
  const allTools = getAllTools();

  return allTools.filter((tool) => favoritePaths.includes(tool.path));
};

// Helper function to get toolCategories with favorites populated
export const getToolCategoriesWithFavorites = (): ToolCategory[] => {
  const categories = [...toolCategories];
  categories[0].items = getFavoriteTools(); // Update Favorite Tools category
  return categories;
};

// Helper function to check if a tool is available/implemented
export const isToolAvailable = (path: string): boolean => {
  const availableTools = ['/token-generator', '/hash-text'];
  return availableTools.includes(path);
};
