import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    phone: string;
    name: string;
    playerId: string;
    email?: string | null;
    withdrawPassword?: string | null;
    isBanned: boolean;
    referId: string;
    createdAt: Date;
    invitedById?: string | null;
  }

  interface Session {
    user: User;
  }

  interface JWT {
  }
}
