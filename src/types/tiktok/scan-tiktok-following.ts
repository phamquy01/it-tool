export type ApiScanTiktokFollowingResponse<T> = {
  secUid?: string;
  cursor?: string;
  data?: T;
  error?: string;
};

export type TiktokFollowingData = {
  diggCount: number;
  followerCount: number;
  followingCount: number;
  friendCount: number;
  heartCount: number;
  id: string;
  nickname: string;
  uniqueId: string;
  videoCount: number;
};

export type ScanFollowingTiktokResponse = ApiScanTiktokFollowingResponse<
  TiktokFollowingData[]
>;
