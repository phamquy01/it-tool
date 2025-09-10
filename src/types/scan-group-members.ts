export type ApiScanGroupMembersResponse<T> = {
  fbdtsg?: string;
  cursor?: string;
  data?: T;
  error?: string;
};

export type GroupMembersData = {
  avatar: string;
  join_status_text: string;
  name: string;
  uid: string;
};

export type ScanGroupMembersResponse = ApiScanGroupMembersResponse<
  GroupMembersData[]
>;
