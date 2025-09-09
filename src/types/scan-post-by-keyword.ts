export type ApiScanPostByKeywordResponse<T> = {
  cursor?: string;
  data?: T;
  error?: string;
};

// Kiểu dữ liệu mới cho từng post
export type PostKeywordData = {
  content: string;
  creationTime: string;
  id: string;
  image: string;
  url: string;
};

// Kết quả scan keyword => data là mảng PostKeywordData
export type ScanPostByKeywordResponse = ApiScanPostByKeywordResponse<
  PostKeywordData[]
>;
