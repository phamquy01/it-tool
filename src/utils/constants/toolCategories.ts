import type { LucideIcon } from 'lucide-react';
import {
  Shuffle,
  Hash,
  KeySquare,
  Lock,
  Grid,
  Fingerprint,
  Tv,
} from 'lucide-react';
import TokenGenerator from '../../pages/TokenGenerator';
import HashText from '../../pages/HashText';
import Bcrypt from '../../pages/Bcrypt';
import UUID from '../../pages/UUID';
import ULID from '../../pages/ULID';
import Encryption from '../../pages/Encryption';
import BIP39 from '../../pages/BIP39';
import CheckLiveUID from '../../pages/CheckLiveUID';
import HmacGenerator from '../../pages/HmacGenerator';
import RSAKeyGenerator from '../../pages/RSAKeyGenerator';

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
    title: 'Facebook',
    items: [
      {
        label: 'Check live',
        icon: Tv,
        path: '/check-live',
        description: 'Check if a Facebook user is currently live',
        component: CheckLiveUID,
      },
    ],
  },
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
      {
        label: 'BIP39 passphrase generator',
        icon: Lock,
        path: '/bip39-generator',
        description:
          'Generate a BIP39 passphrase from an existing or random mnemonic, or get the mnemonic from the passphrase.',
        component: BIP39,
      },
      {
        label: 'Hmac generator',
        icon: Tv,
        path: '/hmac-generator',
        description:
          'Computes a hash-based message authentication code (HMAC) using a secret key and your favorite hashing function.',
        component: HmacGenerator,
      },
      {
        label: 'RSA key pair generator',
        icon: Lock,
        path: '/rsa-key-pair-generator',
        description:
          'Generate a new random RSA private and public pem certificate key pair.',
        component: RSAKeyGenerator,
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
