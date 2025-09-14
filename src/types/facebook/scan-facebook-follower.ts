export type ApiScanFacebookFollowersResponse<T> = {
  collectionToken?: string;
  fbdtsg?: string;
  cursor?: string;
  data?: T;
  error?: string;
};

export type FacebookFollowersData = {
  avatar: string;
  id: string;
  name: string;
};

export type ScanFacebookFollowersResponse = ApiScanFacebookFollowersResponse<
  FacebookFollowersData[]
>;
