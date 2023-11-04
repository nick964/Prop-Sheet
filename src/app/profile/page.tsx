"use client"

import  ProfileDisplay from '../components/profile';

import { useSession } from 'next-auth/react';
import React from 'react';


export default  function Page() {

const { data: session, status } = useSession();
console.log(JSON.stringify(session));
console.log(JSON.stringify(session?.user));
console.log(status);

if(session) {
    return (
        <div>
            Logged in as {session?.user?.name}
        </div>
    )
}

return (
    <div>
        <button >Sign In</button>
    </div>
)

}