import type { LucideIcon } from 'lucide-react';
import {
  Ampersand,
  Contact,
  CopyMinus,
  Facebook,
  Funnel,
  Merge,
  MessageSquareText,
  Scan,
  ScanText,
  ScrollText,
  ShieldCheck,
  SmilePlus,
  Split,
  UserRoundCheck,
  UserRoundSearch,
  UsersRound,
  UserStar,
} from 'lucide-react';
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
import ScanTiktokFollower from '../../pages/tiktok/ScanTiktokFollower';
import ScanTiktokFollowing from '../../pages/tiktok/ScanTiktokFollowing';
import ScanTiktokComment from '../../pages/tiktok/ScanTiktokComment';
import ScanFacebookFriends from '../../pages/facebook/ScanFacebookFriends';
import ScanFacebookFollowers from '../../pages/facebook/ScanFacebookFollowers';

export interface ToolItem {
  component: React.FC;
  label: string;
  icon: LucideIcon;
  path: string;
  description: string;
  category?: string;
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
      {
        label: 'sidebar.tools.facebook.scan_facebook_friends.title',
        icon: ScrollText,
        path: '/scan-facebook-friends',
        description: 'sidebar.tools.facebook.scan_facebook_friends.description',
        component: ScanFacebookFriends,
      },
      {
        label: 'sidebar.tools.facebook.scan_facebook_followers.title',
        icon: Contact,
        path: '/scan-facebook-followers',
        description:
          'sidebar.tools.facebook.scan_facebook_followers.description',
        component: ScanFacebookFollowers,
      },
    ],
  },
  {
    title: 'sidebar.tools.tiktok.category',
    items: [
      {
        label: 'sidebar.tools.tiktok.scan_tiktok_follower.title',
        icon: UserRoundCheck,
        path: '/scan-tiktok-follower',
        description: 'sidebar.tools.tiktok.scan_tiktok_follower.description',
        component: ScanTiktokFollower,
      },
      {
        label: 'sidebar.tools.tiktok.scan_tiktok_following.title',
        icon: UserStar,
        path: '/scan-tiktok-following',
        description: 'sidebar.tools.tiktok.scan_tiktok_following.description',
        component: ScanTiktokFollowing,
      },
      {
        label: 'sidebar.tools.tiktok.scan_tiktok_comment.title',
        icon: MessageSquareText,
        path: '/scan-tiktok-comment',
        description: 'sidebar.tools.tiktok.scan_tiktok_comment.description',
        component: ScanTiktokComment,
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

export const getCategoryColor = (category: string) => {
  const configs = {
    'sidebar.tools.facebook.category': {
      bg: 'bg-blue-600',
      lightBg: 'bg-blue-50 dark:bg-blue-500/20',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    'sidebar.tools.tiktok.category': {
      bg: 'bg-black',
      lightBg: 'bg-gray-900 dark:bg-gray-600/30',
      text: 'text-gray-100 dark:text-gray-100',
      icon: 'text-white dark:text-gray-400',
    },
    'sidebar.tools.instagram.category': {
      bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      lightBg: 'bg-pink-50 dark:bg-pink-500/20',
      text: 'text-pink-700 dark:text-pink-300',
      icon: 'text-pink-600 dark:text-pink-400',
    },
    'sidebar.tools.twitter.category': {
      bg: 'bg-blue-400',
      lightBg: 'bg-blue-50 dark:bg-blue-400/20',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
    },
  };
  return configs[category as keyof typeof configs] || null;
};
export const getAllTools = (): ToolItem[] => {
  return toolCategories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.title,
    }))
  );
};

export const getFavoriteTools = (): ToolItem[] => {
  const stored = localStorage.getItem('favoriteTools');
  if (!stored) return [];

  const favoritePaths: string[] = JSON.parse(stored);
  const allTools = getAllTools();

  return allTools.filter((tool) => favoritePaths.includes(tool.path));
};

export const getToolCategoriesWithFavorites = (): ToolCategory[] => {
  const categories = [...toolCategories];
  categories[0].items = getFavoriteTools();
  return categories;
};
