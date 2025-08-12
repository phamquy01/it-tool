import type { LucideIcon } from 'lucide-react';
import {
  Shuffle,
  Hash,
  KeySquare,
  Lock,
  List,
  Shield,
  Key,
  Grid,
  FileText,
  Calendar,
  XSquare,
  Code,
  Link,
  Link2,
  Fingerprint,
} from 'lucide-react';

export interface ToolItem {
  label: string;
  icon: LucideIcon;
  path: string;
  description: string;
}

export interface ToolCategory {
  title: string;
  items: ToolItem[];
}

export const toolCategories: ToolCategory[] = [
  {
    title: 'Crypto',
    items: [
      {
        label: 'Token generator',
        icon: Shuffle,
        path: '/token-generator',
        description: 'Generate random tokens for authentication',
      },
      {
        label: 'Hash text',
        icon: Hash,
        path: '/hash-text',
        description: 'Create hash values from text using various algorithms',
      },
      {
        label: 'Bcrypt',
        icon: Fingerprint,
        path: '/bcrypt',
        description: 'Hash passwords using bcrypt algorithm',
      },
      {
        label: 'UUIDs generator',
        icon: KeySquare,
        path: '/uuid-generator',
        description: 'Generate unique identifiers (UUIDs)',
      },
      {
        label: 'ULID generator',
        icon: Grid,
        path: '/ulid-generator',
        description:
          'Generate universally unique lexicographically sortable identifiers',
      },
      {
        label: 'Encrypt / decrypt text',
        icon: Lock,
        path: '/encrypt-decrypt',
        description: 'Encrypt and decrypt text using various methods',
      },
      {
        label: 'BIP39 passphrase gen...',
        icon: List,
        path: '/bip39',
        description: 'Generate BIP39 mnemonic passphrases',
      },
      {
        label: 'Hmac generator',
        icon: Shield,
        path: '/hmac',
        description: 'Generate HMAC authentication codes',
      },
      {
        label: 'RSA key pair generator',
        icon: Key,
        path: '/rsa',
        description: 'Generate RSA public/private key pairs',
      },
      {
        label: 'Password strength ana...',
        icon: Shield,
        path: '/password-strength',
        description: 'Analyze password strength and security',
      },
      {
        label: 'PDF signature checker',
        icon: FileText,
        path: '/pdf-signature',
        description: 'Verify PDF digital signatures',
      },
    ],
  },
  {
    title: 'Converter',
    items: [
      {
        label: 'Date-time converter',
        icon: Calendar,
        path: '/date-time-converter',
        description: 'Convert between different date and time formats',
      },
      {
        label: 'Integer base converter',
        icon: Shuffle,
        path: '/integer-base-converter',
        description: 'Convert numbers between different bases',
      },
      {
        label: 'Roman numeral converter',
        icon: XSquare,
        path: '/roman-numeral-converter',
        description: 'Convert between Roman numerals and numbers',
      },
    ],
  },
  {
    title: 'Web',
    items: [
      {
        label: 'Encode/decode URL',
        icon: Link,
        path: '/encode-decode-url',
        description: 'Encode or decode URL formatted strings',
      },
      {
        label: 'Escape HTML entities',
        icon: Code,
        path: '/escape-html-entities',
        description: 'Convert special characters to HTML entities',
      },
      {
        label: 'URL parser',
        icon: Link2,
        path: '/url-parser',
        description: 'Parse and extract parts from a URL',
      },
    ],
  },
];

// Helper function to get all tools as a flat array
export const getAllTools = (): ToolItem[] => {
  return toolCategories.flatMap((category) => category.items);
};

// Helper function to check if a tool is available/implemented
export const isToolAvailable = (path: string): boolean => {
  const availableTools = ['/token-generator', '/hash-text'];
  return availableTools.includes(path);
};
