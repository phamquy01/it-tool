export type ApiScanFacebookGroupResponse<T> = {
  fbdtsg?: string; // token để xác thực các request tiếp theo
  cursor?: string; // con trỏ để phân trang
  data?: T; // dữ liệu trả về
  error?: string; // lỗi nếu có
};

// Kiểu dữ liệu của từng group
export type GroupKeywordData = {
  avatar: string;
  description: string;
  id: string;
  member: string;
  name: string;
  privacy: string;
  url: string;
};

// Kết quả scan keyword => data là mảng GroupKeywordData
export type ScanGroupKeywordResponse = ApiScanFacebookGroupResponse<
  GroupKeywordData[]
>;

export const GROUP_PRIVACY = {
  PUBLIC: {
    en: 'Public',
    vi: 'Công khai',
    color: 'green',
  },
} as const;
