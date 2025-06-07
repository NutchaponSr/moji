export type Member = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  role: "admin" | "member" | "guest";
  organizationId: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};