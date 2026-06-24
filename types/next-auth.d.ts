import type { DefaultSession } from 'next-auth';

// Augment the session, user & JWT with our custom fields (id + roles).
declare module 'next-auth' {
  interface User {
    roles?: string[];
  }
  interface Session {
    user: {
      id: string;
      roles: string[];
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    roles?: string[];
  }
}
