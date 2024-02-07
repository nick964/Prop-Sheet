import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';

async function login(credentials: { username: string, password: string }) {
    try {
        console.log('IN CREDENTIALS LOGIN');
        console.log(credentials);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        };
        console.log('calling this url');
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/signin`);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/signin`, credentials);
        const data = response.data;
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
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/oauth-register`);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/oauth-register`, credentials);
        const data = response.data;
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
                console.log('logging this in my username callback');
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
                console.log('logging provider');
                console.log(account.provider);
                
                var username = '';
                var name = '';
                if(!(account.provider === 'credentials')) {
                    if(account.provider === 'twitter') {
                        const nameData = user.name ?? '';
                        const nameDataArray = nameData.split(',');
                        name = nameDataArray[0] || '';
                        username = nameDataArray[1] || '';
                    } else {
                        name = profile?.name || '';
                        username = profile?.email || '';
                    }
                    var myImage = '';
                    if(account.provider === 'twitter') {
                        myImage = user?.image || '';
                    } else if (account.provider === 'google') {
                        myImage = profile?.picture || '';
                    } else if (account.provider === 'facebook') {
                        myImage = user?.image || '';
                    }

                    const email = profile?.email || '';
                    const credentials = {
                        username:  username,
                        name: name,
                        email: email,
                        provider: account?.provider,
                        img: myImage
                    };
                    console.log('credentials before oauth login - this creates the user if they do not exist');
                    console.log(credentials);
                    const returnedUser = await oauthlogin(credentials);
                    console.log('returnedUser in sign in');
                    console.log(returnedUser);
                    if(returnedUser != null && returnedUser.success === false) {
                        const errorMessage = returnedUser.errorMessage;
                        return ('/signup-conflict?message=' + errorMessage);
                    }
                }
            } 
            return true;
        },
        async jwt({ token, user, account, profile }) {
            if (user != null && !token.accessToken) {
                var username = '';
                var name = '';
                if(account != null && account.provider != 'credentials') {
                    if(account != null && account.provider === 'twitter') {
                        const nameData = user.name ?? '';
                        const nameDataArray = nameData.split(',');
                        name = nameDataArray[0] || '';
                        username = nameDataArray[1] || '';
                    } else {
                        name = profile?.name || '';
                        username = profile?.email || '';
                    }
                    const email = profile?.email || '';
                    const credentials = {
                        username: username,
                        name: name,
                        email: token.email,
                        provider: account?.provider,
    
                    };
                    console.log('log credentials');
                    console.log(credentials);
                    console.log('CALLING OAUTH NOW IN JWT FUNCTION');
                    const returnedUser = await oauthlogin(credentials);
                    console.log('returnedUser');
                    console.log(returnedUser);
                    if (returnedUser) {
                        token.accessToken = returnedUser.token;
                        token.refreshToken = returnedUser.refreshToken;
                        token.picture = returnedUser.icon;
                        token.role = returnedUser.roles[0];
                        token.name = returnedUser.name;
                    }
                } else {
                    console.log('setting token in jwt function');
                    console.log(user.token);
                    token.accessToken = user.token;
                    token.picture = user.icon;
                    token.role = user.roles?.[0] ?? '';
                    token.name = user.name;
                }
            }
            return token;
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            if (session.user) {
                session.user.accessToken = token.accessToken?.toString() ?? '';
                session.user.icon = token.picture?.toString() ?? '';
                session.user.role = token.role?.toString() ?? '';
                session.user.name = token.name?.toString() ?? '';
            }
            
            return session;
        }
    },
}