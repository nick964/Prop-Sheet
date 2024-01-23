import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's access token. */
      accessToken: string
    }
  }

    /**
   * Extends the built-in JWT types with additional properties
   */
    interface JWT {
      id?: string;
      token?: string; // Adding the token property
    }
  
    /**
     * Extends the built-in User types with additional properties
     */
    interface User {
      token?: string; // Adding the token property
    }

    /**
     * Extends the built-in User types with additional properties
     */
    interface Profile {
          picture?: string; // Adding the token property
    }
}