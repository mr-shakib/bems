import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  imageUrl: string;
  imagePublicId?: string;
  inviteCode: string;
  userId: string;
};
