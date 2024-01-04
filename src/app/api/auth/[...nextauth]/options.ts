import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from 'next/headers'

async function login(credentials: { username: string, password: string }) {
    try {
        console.log('IN CREDENTIALS LOGIN');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        };
        console.log('calling this url');
        console.log(`${process.env.BACKEND_URL}api/auth/signin`);
        const response = await fetch(`${process.env.BACKEND_URL}api/auth/signin`, requestOptions);
        const data = await response.json();
        console.log(JSON.stringify(data));
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function oauthlogin(credentials: { username: string }) {
    try {
        console.log('oauthlogin');
        console.log(credentials);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        };
        console.log('calling this url');
        console.log(`${process.env.BACKEND_URL}api/auth/oauth-register`);
        const response = await fetch(`${process.env.BACKEND_URL}api/auth/oauth-register`, requestOptions);
        const data = await response.json();
        console.log(JSON.stringify(data));
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const creds =  {
                    username : credentials?.username || '', 
                    password: credentials?.password || ''
                };
                const user = await login(creds);
                console.log('user');
                console.log(user);
                
                if (user) {
                    return user;
                } else {
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID as string,
            clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
            version: '2.0',
            // rewrite the userInfo address to obtain username
            userinfo: 'https://api.twitter.com/2/users/me?user.fields=id,username,profile_image_url',
            profile(profile) {
              return {
                id: profile.data.id,
                // use username instead of name
                name: profile.data.name + ',' + profile.data.username,
                email: profile.data.email ?? null,
                image: profile.data.profile_image_url,
              }
            },
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async signIn({user, account, profile}) {
            console.log("USER");
            console.log(user);
            console.log("ACCOUNT");
            console.log(account);
            console.log("PROFILE");
            console.log(profile);

            if(profile != null && account?.provider != null) {
                console.log('outh sign up now in sign in form');
                console.log('profile');
                console.log(profile);
                console.log('logging profile.data.username');
                
                const nameData = user.name ?? '';
                const nameDataArray = nameData.split(',');
                const name = nameDataArray[0] || '';
                const username = nameDataArray[1] || '';
                const email = profile?.email || '';
                const credentials = {
                    username:  username,
                    name: name,
                    email: email,
                    provider: account?.provider
                };
                console.log('credentials');
                console.log(credentials);
                const returnedUser = await oauthlogin(credentials);
                console.log('returnedUser in sign in');
                console.log(returnedUser);
            } else {
                console.log('normal sign in');
            }


            console.log('user');
            console.log(user);

            return true;
        },
        async jwt({ token, user, account, profile }) {
            console.log('now im in jwt');
            console.log('JWT');
            console.log(token);
            console.log(user);
            console.log(account);
            console.log(profile);
            if (user != null && !token.accessToken) {
                console.log('CALLING OAUTH NOW');
                console.log('profile');
                console.log(profile);
                const nameData = user?.name ?? '';
                const nameDataArray = nameData.split(',');
                console.log('nameDataArray');
                console.log(nameDataArray);
                const name = nameDataArray[0] || '';
                const username = nameDataArray[1] || '';
                const credentials = {
                    username: username,
                    name: name,
                    email: token.email,
                    provider: account?.provider,

                };
                console.log('log credentials');
                console.log(credentials);

                const returnedUser = await oauthlogin(credentials);
                console.log('returnedUser');
                console.log(returnedUser);
                if (returnedUser) {
                    token.accessToken = returnedUser.token;
                    token.refreshToken = returnedUser.refreshToken;
                }
            }
            return token;
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            if (session.user) {
                session.user.accessToken = token.accessToken?.toString() ?? '';
            }
            
            return session;
        }
    },
}