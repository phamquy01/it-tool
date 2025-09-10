import type { LucideIcon } from 'lucide-react';
import {
  Ampersand,
  CopyMinus,
  // Shuffle,
  // Fingerprint,
  // EyeOff,
  // FileLock,
  // ArrowDown01,
  // LockKeyhole,
  // Menu,
  // FileText,
  // HardDriveUpload,
  // RectangleEllipsis,
  // Calendar1,
  // ArrowLeftRight,
  Facebook,
  Funnel,
  Merge,
  Scan,
  ScanText,
  ShieldCheck,
  SmilePlus,
  Split,
  UserRoundSearch,
  UsersRound,
} from 'lucide-react';
// import TokenGenerator from '../../pages/crypto/TokenGenerator';
// import HashText from '../../pages/crypto/HashText';
// import Bcrypt from '../../pages/crypto/Bcrypt';
// import UUID from '../../pages/crypto/UUID';
// import ULID from '../../pages/crypto/ULID';
// import Encryption from '../../pages/crypto/Encryption';
// import BIP39 from '../../pages/crypto/BIP39';
// import HmacGenerator from '../../pages/crypto/HmacGenerator';
// import RSAKeyGenerator from '../../pages/crypto/RSAKeyGenerator';
// import PasswordStrengthAnalyser from '../../pages/crypto/PasswordStrengthAnalyser';
// import PDFSignatureChecker from '../../pages/crypto/PDFSignatureChecker';
// import DateTimeConverter from '../../pages/converter/DateTimeConverter';
// import IntegerBaseConverter from '../../pages/converter/IntegerBaseConverter';
import CheckLiveUID from '../../pages/facebook/CheckLiveUID';
import FilterDataFromContent from '../../pages/facebook/FilterDataFromContent';
import GetOtpFrom2FA from '../../pages/facebook/GetOtpFrom2FA';
import FindIdFacebook from '../../pages/facebook/FindIdFacebook';
import SplitString from '../../pages/string-process-tool/SplitString';
import JoinString from '../../pages/string-process-tool/JoinStringContent';
import JoinStringTwo from '../../pages/string-process-tool/JoinStringTwoContent';
import RemoveDuplicate from '../../pages/string-process-tool/RemoveDuplicate';
import IconFacebook from '../../pages/facebook/IconFacebook';
import ScanFbGroupByKeyword from '../../pages/facebook/ScanFbGroupByKeyword';
import ScanPostByKeyword from '../../pages/facebook/ScanPostByKeyword';
import ScanGroupMembers from '../../pages/facebook/ScanGroupMembers';

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
    title: 'sidebar.tools.facebook.category',
    items: [
      {
        label: 'sidebar.tools.facebook.find_id_facebook.title',
        icon: UserRoundSearch,
        path: '/find-id-facebook',
        description: 'sidebar.tools.facebook.find_id_facebook.description',
        component: FindIdFacebook,
      },
      {
        label: 'sidebar.tools.facebook.check_live_uid.title',
        icon: Facebook,
        path: '/check-live-uid',
        description: 'sidebar.tools.facebook.check_live_uid.description',
        component: CheckLiveUID,
      },
      {
        label: 'sidebar.tools.facebook.filter_data_from_content.title',
        icon: Funnel,
        path: '/filter-data-from-content',
        description:
          'sidebar.tools.facebook.filter_data_from_content.description',
        component: FilterDataFromContent,
      },
      {
        label: 'sidebar.tools.facebook.get_otp_2fa.title',
        icon: ShieldCheck,
        path: '/get-otp-2fa',
        description: 'sidebar.tools.facebook.get_otp_2fa.description',
        component: GetOtpFrom2FA,
      },
      {
        label: 'sidebar.tools.facebook.icon_facebook.title',
        icon: SmilePlus,
        path: '/icon-facebook',
        description: 'sidebar.tools.facebook.icon_facebook.description',
        component: IconFacebook,
      },
      {
        label: 'sidebar.tools.facebook.scan_facebook_group_by_keyword.title',
        icon: Scan,
        path: '/scan-facebook-group-by-keyword',
        description:
          'sidebar.tools.facebook.scan_facebook_group_by_keyword.description',
        component: ScanFbGroupByKeyword,
      },
      {
        label: 'sidebar.tools.facebook.scan_post_by_keyword.title',
        icon: ScanText,
        path: '/scan-post-by-keyword',
        description: 'sidebar.tools.facebook.scan_post_by_keyword.description',
        component: ScanPostByKeyword,
      },
      {
        label: 'sidebar.tools.facebook.scan_group_members.title',
        icon: UsersRound,
        path: '/scan-group-members',
        description: 'sidebar.tools.facebook.scan_group_members.description',
        component: ScanGroupMembers,
      },
    ],
  },
  {
    title: 'sidebar.tools.string_processing_tool.category',
    items: [
      {
        label: 'sidebar.tools.string_processing_tool.split_string.title',
        icon: Split,
        path: '/split-string',
        description:
          'sidebar.tools.string_processing_tool.split_string.description',
        component: SplitString,
      },
      {
        label: 'sidebar.tools.string_processing_tool.join_string.title',
        icon: Merge,
        path: '/join-string-1',
        description:
          'sidebar.tools.string_processing_tool.join_string.description',
        component: JoinString,
      },
      {
        label: 'sidebar.tools.string_processing_tool.join_string_two.title',
        icon: Ampersand,
        path: '/join-string-2',
        description:
          'sidebar.tools.string_processing_tool.join_string_two.description',
        component: JoinStringTwo,
      },
      {
        label: 'sidebar.tools.string_processing_tool.remove_duplicate.title',
        icon: CopyMinus,
        path: '/remove-duplicate',
        description:
          'sidebar.tools.string_processing_tool.remove_duplicate.description',
        component: RemoveDuplicate,
      },
    ],
  },
  //       component: TokenGenerator,
  //     },
  //     {
  //       label: 'sidebar.tools.crypto.hash_text.title',
  //       icon: EyeOff,
  //       path: '/hash-text',
  //       description: 'sidebar.tools.crypto.hash_text.description',
  //       component: HashText,
  //     },
  //     {
  //       label: 'sidebar.tools.crypto.bcrypt.title',
  //       icon: FileLock,
  //       path: '/bcrypt',
  //       description: 'sidebar.tools.crypto.bcrypt.description',
  //       component: Bcrypt,
  //     },
  //     {
  //       label: 'sidebar.tools.crypto.uuid_generator.title',
  //       icon: Fingerprint,
  //       path: '/uuid-generator',
  //       description: 'sidebar.tools.crypto.uuid_generator.description',
  //       component: UUID,
  //     },
  //     {
  //       label: 'sidebar.tools.crypto.ulid_generator.title',
  //       icon: ArrowDown01,
  //       path: '/ulid-generator',
  //       description: 'sidebar.tools.crypto.ulid_generator.description',
  //       component: ULID,
  //     },
  //     {
  //       label: 'sidebar.tools.crypto.encryption.title',
  //       icon: LockKeyhole,
  //       path: '/encrypt-decrypt',
  //       description: 'sidebar.tools.crypto.encryption.description',
  //       component: Encryption,
  //     },
  //     {
  //       label: 'sidebar.tools.crypto.bip39_generator.title',
  //       icon: Menu,
  //       path: '/bip39-generator',
  //       description: 'sidebar.tools.crypto.bip39_generator.description',
  //       component: BIP39,
  //     },
  //     {
  //       label: 'sidebar.tools.crypto.hmac_generator.title',
  //       icon: Menu,
  //       path: '/hmac-generator',
  //       description: 'sidebar.tools.crypto.hmac_generator.description',
  //       component: HmacGenerator,
  //     },
  //     {
  //       label: 'sidebar.tools.crypto.rsa_key_pair_generator.title',
  //       icon: FileText,
  //       path: '/rsa-key-pair-generator',
  //       description: 'sidebar.tools.crypto.rsa_key_pair_generator.description',
  //       component: RSAKeyGenerator,
  //     },
  //     {
  //       label: 'sidebar.tools.crypto.password_strength_analyser.title',
  //       icon: RectangleEllipsis,
  //       path: '/password-strength-analyser',
  //       description:
  //         'sidebar.tools.crypto.password_strength_analyser.description',
  //       component: PasswordStrengthAnalyser,
  //     },
  //     {
  //       label: 'sidebar.tools.crypto.pdf_signature_checker.title',
  //       icon: HardDriveUpload,
  //       path: '/pdf-signature-checker',
  //       description: 'sidebar.tools.crypto.pdf_signature_checker.description',
  //       component: PDFSignatureChecker,
  //     },
  //   ],
  // },
  // {
  //   title: 'sidebar.tools.converter.category',
  //   items: [
  //     {
  //       label: 'sidebar.tools.converter.date_time.title',
  //       icon: Calendar1,
  //       path: '/date-time-converter',
  //       description: 'sidebar.tools.converter.date_time.description',
  //       component: DateTimeConverter,
  //     },
  //     {
  //       label: 'sidebar.tools.converter.integer_base.title',
  //       icon: ArrowLeftRight,
  //       path: '/integer-base-converter',
  //       description: 'sidebar.tools.converter.integer_base.description',
  //       component: IntegerBaseConverter,
  //     },
  //   ],
  // },
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
  categories[0].items = getFavoriteTools();
  return categories;
};
