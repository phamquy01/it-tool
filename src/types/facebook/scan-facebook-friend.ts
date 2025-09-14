export type ApiScanFacebookFriendsResponse<T> = {
  fbdtsg?: string;
  cursor?: string;
  data?: T;
  error?: string;
};

export type FacebookFriendsData = {
  avatar: string;
  id: string;
  name: string;
};

export type ScanFacebookFriendsResponse = ApiScanFacebookFriendsResponse<
  FacebookFriendsData[]
>;
