export type ApiScanCommentTiktokResponse<T> = {
  cursor?: string;
  data?: T;
  error?: string;
};

export type CommentTiktokData = {
    create_time: string;
    id: string;
    nickname: string;
    text: string;
    unique_id: string;
};

export type ScanCommentTiktokResponse = ApiScanCommentTiktokResponse<
  CommentTiktokData[]
>;
