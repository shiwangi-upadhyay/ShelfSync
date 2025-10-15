export type User = {
  _id: string;
  name: string;
  avatarUrl?: string;
};

export type Team = {
  _id: string;
  name: string;
  admin: User;
  members: User[];
};

export type TabType = "messages" | "tasks" | "all" | "create";